import { createServerFn } from "@tanstack/react-start";

export type AiPillar = {
  label: "Attract" | "Convert" | "Retain";
  value: number;
  note: string;
};

export type AiRecommendation = {
  pillar: "Attract" | "Convert" | "Retain" | "Foundations";
  title: string;
  detail: string;
};

export type AiReport = {
  score: number;
  headline: string;
  summary: string;
  industryLabel: string;
  pillars: AiPillar[];
  recommendations: AiRecommendation[];
  generatedAt: string;
  provider: "claude" | "fallback";
};

function extractJson(text: string): unknown {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.search(/[{[]/);
  if (start === -1) throw new Error("No JSON found in AI response");
  const openChar = cleaned[start];
  const closeChar = openChar === "[" ? "]" : "}";
  const end = cleaned.lastIndexOf(closeChar);
  if (end === -1) throw new Error("Malformed JSON in AI response");
  cleaned = cleaned.substring(start, end + 1);
  try {
    return JSON.parse(cleaned);
  } catch {
    const repaired = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
    return JSON.parse(repaired);
  }
}

function clamp(n: unknown, lo = 20, hi = 96): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 55;
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

function normalize(raw: unknown, provider: AiReport["provider"] = "claude"): AiReport {
  const r = (raw ?? {}) as Record<string, unknown>;
  const pillarsIn = Array.isArray(r.pillars) ? (r.pillars as Record<string, unknown>[]) : [];
  const recsIn = Array.isArray(r.recommendations)
    ? (r.recommendations as Record<string, unknown>[])
    : [];

  const labelSet: AiPillar["label"][] = ["Attract", "Convert", "Retain"];
  const pillars: AiPillar[] = labelSet.map((label) => {
    const p = pillarsIn.find((x) => String(x.label).toLowerCase() === label.toLowerCase());
    return {
      label,
      value: clamp(p?.value ?? 55),
      note: String(p?.note ?? "").slice(0, 400) || `${label} baseline established.`,
    };
  });

  const recPillars: AiRecommendation["pillar"][] = ["Attract", "Convert", "Retain", "Foundations"];
  const recommendations: AiRecommendation[] = recsIn
    .map((x) => {
      const pillar = recPillars.find(
        (p) => p.toLowerCase() === String(x.pillar ?? "").toLowerCase(),
      );
      return {
        pillar: pillar ?? "Foundations",
        title: String(x.title ?? "").slice(0, 160),
        detail: String(x.detail ?? "").slice(0, 900),
      };
    })
    .filter((x) => x.title && x.detail)
    .slice(0, 10);

  return {
    score: clamp(r.score ?? 60),
    headline: String(r.headline ?? "Your growth read-out").slice(0, 200),
    summary: String(r.summary ?? "").slice(0, 800),
    industryLabel: String(r.industryLabel ?? "").slice(0, 120),
    pillars,
    recommendations,
    generatedAt: new Date().toISOString(),
    provider,
  };
}

const SYSTEM_PROMPT = `You are a senior growth strategist at Sibiso Marketing, a strategic growth partner (not a generic agency). You use the Attract → Convert → Retain framework.

Given a business owner's audit answers, produce a personalised Growth Strategy Report.

Return ONLY a single valid JSON object (no prose, no markdown code fences) matching:
{
  "score": number 20-96 (overall growth score),
  "headline": string (one bold statement, <= 90 chars),
  "summary": string (2-3 sentences of personalised diagnosis, reference first_name and business_name if provided),
  "industryLabel": string (human-readable industry name),
  "pillars": [
    {"label": "Attract", "value": 20-96, "note": "1-2 sentence diagnosis of their attract engine"},
    {"label": "Convert", "value": 20-96, "note": "1-2 sentence diagnosis of their conversion engine"},
    {"label": "Retain",  "value": 20-96, "note": "1-2 sentence diagnosis of their retention engine"}
  ],
  "recommendations": [
    {"pillar": "Attract"|"Convert"|"Retain"|"Foundations", "title": "action-oriented title", "detail": "2-4 sentences that reference specifics from their answers"}
  ]
}

Rules:
- Provide 6 to 8 recommendations, prioritised by impact.
- Be specific to their industry, revenue range, budget, urgency and stated growth challenge.
- Tone: sharp, confident, strategic — never generic advice.
- Do NOT include any keys other than the schema above.
- Respond with ONLY the JSON object, nothing else.`;

async function callClaude(answers: Record<string, unknown>, apiKey: string): Promise<AiReport> {
  const userPrompt = `Audit answers (JSON):\n${JSON.stringify(answers, null, 2)}\n\nGenerate the Growth Strategy Report now. Return only the JSON object.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[generateAuditReport] Anthropic ${res.status}: ${body}`);
      if (res.status === 401 || res.status === 403) {
        throw new Error("Claude API key is invalid or missing permissions.");
      }
      if (res.status === 429) {
        throw new Error("Claude is rate-limiting us. Please retry in a few seconds.");
      }
      if (res.status === 529 || res.status >= 500) {
        throw new Error("Claude is overloaded right now. Please retry in a moment.");
      }
      throw new Error(`Claude request failed (${res.status}).`);
    }

    const json = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text =
      json.content?.filter((c) => c.type === "text").map((c) => c.text ?? "").join("").trim() ?? "";
    if (!text) throw new Error("Claude returned an empty response.");

    const parsed = extractJson(text);
    return normalize(parsed, "claude");
  } finally {
    clearTimeout(timeout);
  }
}

export const generateAuditReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as { answers?: Record<string, unknown> };
    return { answers: d.answers ?? {} };
  })
  .handler(async ({ data }): Promise<AiReport> => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error(
        "ANTHROPIC_API_KEY is not configured. Please add it in the project settings.",
      );
    }
    return await callClaude(data.answers, key);
  });
