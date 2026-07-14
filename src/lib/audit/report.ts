import { INDUSTRIES } from "./questions";

export type Answers = Record<string, unknown>;

export type PillarScore = { label: "Attract" | "Convert" | "Retain"; value: number; note: string };

export type Recommendation = {
  pillar: "Attract" | "Convert" | "Retain" | "Foundations";
  title: string;
  detail: string;
};

export type Report = {
  score: number;
  pillars: PillarScore[];
  recommendations: Recommendation[];
  industryLabel: string;
};

const s = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function clamp(n: number) {
  return Math.max(20, Math.min(96, Math.round(n)));
}

export function buildReport(a: Answers): Report {
  // ---------- Attract ----------
  let attract = 55;
  const lead = s(a.primary_lead_source);
  if (lead === "referrals") attract += 6;
  if (lead === "organic_search") attract += 12;
  if (lead === "paid_ads") attract += 8;
  if (lead === "outbound") attract += 4;
  if (lead === "events") attract += 6;
  if (lead === "social") attract += 5;

  const budget = s(a.monthly_budget);
  if (budget === "under_10k") attract -= 8;
  if (budget === "10_25k") attract -= 2;
  if (budget === "25_75k") attract += 4;
  if (budget === "75_200k") attract += 8;
  if (budget === "200k_plus") attract += 10;

  // ---------- Convert ----------
  let convert = 55;
  const crm = s(a.crm_usage);
  if (crm === "no_crm") convert -= 14;
  if (crm === "basic_crm") convert -= 4;
  if (crm === "active_crm") convert += 8;
  if (crm === "automated_crm") convert += 16;

  const leak = s(a.gen_biggest_leak) || s(a.ecom_bottleneck) || s(a.edu_funnel_stage);
  if (leak === "consideration" || leak === "cvr" || leak === "info") convert -= 6;
  if (leak === "close" || leak === "cart" || leak === "apply") convert -= 8;

  // ---------- Retain ----------
  let retain = 55;
  const ai = s(a.ai_adoption);
  if (ai === "none") retain -= 10;
  if (ai === "exploring") retain -= 2;
  if (ai === "some") retain += 6;
  if (ai === "deep") retain += 14;

  const ecomRet = s(a.ecom_retention);
  if (ecomRet === "under_10") retain -= 10;
  if (ecomRet === "10_30") retain -= 2;
  if (ecomRet === "30_50") retain += 6;
  if (ecomRet === "50_plus") retain += 12;

  const nurture = s(a.re_nurture);
  if (nurture === "no") retain -= 8;
  if (nurture === "automated") retain += 8;

  const loyalty = s(a.retail_loyalty);
  if (loyalty === "none") retain -= 6;
  if (loyalty === "formal") retain += 8;

  const returning = s(a.rest_returning);
  if (returning === "weak") retain -= 8;
  if (returning === "strong") retain += 8;

  const [A, C, R] = [clamp(attract), clamp(convert), clamp(retain)];
  const overall = clamp(Math.round(A * 0.35 + C * 0.35 + R * 0.3));

  const pillars: PillarScore[] = [
    { label: "Attract", value: A, note: attractNote(A, lead) },
    { label: "Convert", value: C, note: convertNote(C, crm) },
    { label: "Retain", value: R, note: retainNote(R, ai) },
  ];

  const recommendations = buildRecs(a, { A, C, R });

  const industryLabel =
    INDUSTRIES.find((i) => i.value === s(a.industry))?.label ?? "Your industry";

  return { score: overall, pillars, recommendations, industryLabel };
}

function attractNote(v: number, lead: string) {
  if (v < 50) return "Demand generation is thin — you're likely over-reliant on one channel.";
  if (lead === "referrals") return "Strong on trust but exposed — referrals alone don't scale predictably.";
  if (lead === "paid_ads") return "Paid is doing the heavy lifting; add durable owned channels to lower CAC.";
  return "Solid foundation — the compounding lever now is content plus distribution.";
}
function convertNote(v: number, crm: string) {
  if (crm === "no_crm") return "Without a CRM, follow-up is leaking revenue every week.";
  if (v < 55) return "Pipeline discipline and follow-up sequencing are your fastest wins.";
  return "Conversion is healthy — sharpen offer, proof and objection handling to lift it further.";
}
function retainNote(v: number, ai: string) {
  if (v < 50) return "Retention is a leaky bucket — every new customer is fighting churn.";
  if (ai === "deep") return "Automation is compounding for you — expand it into lifecycle and win-back.";
  return "Room to compound — lifecycle journeys and reactivation will unlock hidden revenue.";
}

function buildRecs(a: Answers, scores: { A: number; C: number; R: number }): Recommendation[] {
  const recs: Recommendation[] = [];
  const industry = s(a.industry);
  const firstName = s(a.first_name).trim() || "you";
  const biz = s(a.business_name).trim() || "the business";
  const goal = s(a.growth_goal);
  const urgency = s(a.urgency);
  const budget = s(a.monthly_budget);

  // Foundations — positioning / diagnostic
  const challenge = s(a.growth_challenge);
  if (challenge) {
    recs.push({
      pillar: "Foundations",
      title: "Reframe the core growth problem",
      detail: `You told us the biggest blocker is: "${challenge.slice(0, 180)}". Our first move for ${biz} is to translate that into a measurable KPI (leads / CVR / LTV) so the whole strategy has a scoreboard.`,
    });
  }

  // Attract recs
  if (scores.A < 65) {
    const lead = s(a.primary_lead_source);
    if (lead === "referrals") {
      recs.push({
        pillar: "Attract",
        title: "Build a second demand channel alongside referrals",
        detail: `Referrals are compounding — but a single-channel business is fragile. Layer in an owned content engine (SEO + LinkedIn/thought leadership) to create a predictable second source of qualified leads.`,
      });
    } else if (lead === "paid_ads") {
      recs.push({
        pillar: "Attract",
        title: "De-risk paid with an organic acquisition layer",
        detail: `You're renting attention. Reinvest 20–30% of paid budget into SEO, PR and content so blended CAC drops as your organic surface area grows.`,
      });
    } else {
      recs.push({
        pillar: "Attract",
        title: "Concentrate on one dominant channel this quarter",
        detail: `Rather than spreading effort, pick the single channel with the best unit economics and build a 90-day plan to dominate it before diversifying.`,
      });
    }
  }

  // Convert recs
  const crm = s(a.crm_usage);
  if (crm === "no_crm" || crm === "basic_crm") {
    recs.push({
      pillar: "Convert",
      title: "Stand up a lightweight CRM + follow-up sequence",
      detail: `Instrument every enquiry into a single pipeline with automated follow-ups on day 0, 2, 7 and 21. This alone typically lifts close rate 20–35% inside a quarter.`,
    });
  }
  if (scores.C < 65) {
    recs.push({
      pillar: "Convert",
      title: "Rebuild the offer and proof stack",
      detail: `Tighten your primary offer, price anchor and social proof on the money pages. For ${industry || "your sector"}, this is where the biggest single-week lift usually lives.`,
    });
  }

  // Retain recs
  const ai = s(a.ai_adoption);
  if (scores.R < 65) {
    recs.push({
      pillar: "Retain",
      title: "Launch a lifecycle & reactivation programme",
      detail: `Map the 3–4 moments in your customer journey where value is delivered, and build automated journeys around each. Add a 60/90/180-day reactivation flow to reclaim dormant customers.`,
    });
  }
  if (ai === "none" || ai === "exploring") {
    recs.push({
      pillar: "Retain",
      title: "Introduce AI where it removes friction, not just cost",
      detail: `Start with three high-leverage AI use-cases: inbound triage, personalised follow-up drafting, and content repurposing. This frees your team for the human moments that actually build loyalty.`,
    });
  }

  // Industry-specific
  if (industry === "ecommerce") {
    const leak = s(a.ecom_bottleneck);
    if (leak === "cart") {
      recs.push({
        pillar: "Convert",
        title: "Deploy a checkout + abandonment recovery system",
        detail: `Rebuild checkout for one-page flow, add exit-intent capture and a 3-email/SMS recovery sequence. Recovering 10% of abandons typically pays for the rest of the roadmap.`,
      });
    }
    if (leak === "retention") {
      recs.push({
        pillar: "Retain",
        title: "Ship a repeat-purchase engine",
        detail: `Segment top 20% of buyers, build a VIP flow with early access + rewards, and add a replenishment/cross-sell email track by category.`,
      });
    }
  }
  if (industry === "professional_services") {
    recs.push({
      pillar: "Attract",
      title: "Publish a signature POV asset",
      detail: `Package your best thinking into one flagship guide/report and use it as the anchor for LinkedIn, outbound and PR for the next two quarters.`,
    });
  }
  if (industry === "real_estate" && s(a.re_nurture) !== "automated") {
    recs.push({
      pillar: "Retain",
      title: "Automate long-cycle buyer nurture",
      detail: `Most property leads aren't ready today. A 6–12 month nurture with new-listing digests and area insight emails converts leads competitors have forgotten about.`,
    });
  }
  if (industry === "healthcare" && s(a.hc_reviews) !== "systematic") {
    recs.push({
      pillar: "Attract",
      title: "Systemise reviews & reputation",
      detail: `Automated post-visit review requests to Google — for local healthcare, ranking + reviews is usually a bigger lever than ad spend.`,
    });
  }

  // Prioritisation nudge based on urgency & budget
  if (urgency === "immediate") {
    recs.push({
      pillar: "Foundations",
      title: "Sequence: fastest-payback moves in the first 30 days",
      detail: `Given you need movement this month, we'd front-load Convert-side wins (CRM + follow-up + offer sharpening) — they compound within weeks, not quarters.`,
    });
  }
  if (goal === "grow_100" || goal === "grow_200") {
    recs.push({
      pillar: "Foundations",
      title: "Build the system for 2–3× revenue, not just more marketing",
      detail: `Doubling requires a systems view: pricing, packaging, sales capacity and lifecycle need to move together. Marketing without the other three creates leaky growth.`,
    });
  }
  if (budget === "under_10k") {
    recs.push({
      pillar: "Foundations",
      title: "Bias toward owned & organic while budget is tight",
      detail: `SEO, content, LinkedIn and email produce durable compounding assets — the right home for a lean budget until unit economics justify paid.`,
    });
  }

  // Personalisation touch
  recs[0] = {
    ...recs[0],
    detail: `${firstName}, ${recs[0].detail}`,
  };

  return recs.slice(0, 8);
}
