import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  ArrowLeft,
  Target,
  TrendingUp,
  Repeat,
  Layers,
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { buildReport, type Answers } from "@/lib/audit/report";
import {
  generateAuditReport,
  type AiRecommendation,
  type AiReport,
} from "@/lib/audit/generate-report.functions";
import { downloadReportPdf } from "@/lib/audit/pdf";
import { INDUSTRIES } from "@/lib/audit/questions";

export const Route = createFileRoute("/audit/report")({
  head: () => ({
    meta: [
      { title: "Your Growth Strategy Report — Sibiso Marketing" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

type Status = "loading" | "ready" | "error";

function ReportRoute() {
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [report, setReport] = useState<AiReport | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const generate = useServerFn(generateAuditReport);

  // Hydrate answers from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("sibiso_audit_v1");
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Answers };
        if (parsed.answers) setAnswers(parsed.answers);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const firstName = String(answers.first_name ?? "").trim() || "there";
  const businessName = String(answers.business_name ?? "").trim() || "your business";
  const hasAnswers = Object.keys(answers).length > 0;

  // Fetch AI report
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setStatus("loading");
    setErrorMsg("");
    setReport(null);

    (async () => {
      if (!hasAnswers) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(
            "We couldn't find your audit answers on this device. Please retake the audit to generate your report.",
          );
        }
        return;
      }
      try {
        const result = await generate({ data: { answers } });
        if (!cancelled) {
          setReport(result);
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Something went wrong generating your report.";
        console.error("[audit/report]", err);
        setErrorMsg(msg);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, hasAnswers, attempt, answers, generate]);

  const useHeuristicFallback = useCallback(() => {
    const heur = buildReport(answers);
    const industryLabel =
      INDUSTRIES.find((i) => i.value === String(answers.industry ?? ""))?.label ?? heur.industryLabel;
    const ai: AiReport = {
      score: heur.score,
      headline: `${firstName}, here's your growth read-out.`,
      summary: `A quick strategy snapshot for ${businessName}. Generated offline while the AI engine is unavailable — retake or retry for a fully personalised version.`,
      industryLabel,
      pillars: heur.pillars.map((p) => ({ label: p.label, value: p.value, note: p.note })),
      recommendations: heur.recommendations.map((r) => ({
        pillar: r.pillar,
        title: r.title,
        detail: r.detail,
      })),
    };
    setReport(ai);
    setStatus("ready");
  }, [answers, firstName, businessName]);

  const onDownload = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      await downloadReportPdf(report, { firstName, businessName });
    } catch (err) {
      console.error(err);
      alert("Sorry — the PDF couldn't be generated. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const industryLabel = useMemo(() => {
    if (report?.industryLabel) return report.industryLabel;
    return INDUSTRIES.find((i) => i.value === String(answers.industry ?? ""))?.label ?? "";
  }, [answers.industry, report?.industryLabel]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="container-page flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link
            to="/audit"
            className="text-sm font-medium text-black/60 dark:text-white/70 hover:text-black dark:hover:text-white inline-flex items-center gap-1"
          >
            <ArrowLeft className="inline h-4 w-4" /> Back to audit
          </Link>
        </div>
      </header>

      <main className="container-page py-14 sm:py-20 max-w-5xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[.03] dark:bg-white/[.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
          <Sparkles className="h-3 w-3 text-brand-gradient" />
          Powered by Sibiso AI · Gemini
        </div>

        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
          {status === "ready" && report?.headline
            ? report.headline
            : `${firstName}, here's your growth read-out.`}
        </h1>
        <p className="mt-4 text-lg text-black/60 dark:text-white/60">
          A personalised strategy snapshot for{" "}
          <span className="font-semibold text-black dark:text-white">{businessName}</span>
          {industryLabel ? ` · ${industryLabel}` : ""}.
        </p>

        {status === "loading" && <LoadingState firstName={firstName} />}

        {status === "error" && (
          <ErrorState
            message={errorMsg}
            hasAnswers={hasAnswers}
            onRetry={() => setAttempt((n) => n + 1)}
            onFallback={useHeuristicFallback}
          />
        )}

        {status === "ready" && report && (
          <ReadyState
            report={report}
            firstName={firstName}
            businessName={businessName}
            industryLabel={industryLabel}
            downloading={downloading}
            onDownload={onDownload}
          />
        )}
      </main>
    </div>
  );
}

function LoadingState({ firstName }: { firstName: string }) {
  return (
    <div className="mt-12 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-brand-gradient" />
        <p className="text-sm font-semibold text-black/70 dark:text-white/70">
          Analysing your answers, {firstName}… Sibiso AI is drafting your report.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <SkeletonBlock heightClass="h-24" />
        <div className="space-y-3">
          <SkeletonLine w="w-1/3" />
          <SkeletonLine w="w-full" />
          <SkeletonLine w="w-11/12" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonBlock heightClass="h-28" />
          <SkeletonBlock heightClass="h-28" />
          <SkeletonBlock heightClass="h-28" />
          <SkeletonBlock heightClass="h-28" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ heightClass }: { heightClass: string }) {
  return (
    <div
      className={`w-full ${heightClass} rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse`}
    />
  );
}
function SkeletonLine({ w }: { w: string }) {
  return <div className={`${w} h-3 rounded-full bg-black/5 dark:bg-white/5 animate-pulse`} />;
}

function ErrorState({
  message,
  hasAnswers,
  onRetry,
  onFallback,
}: {
  message: string;
  hasAnswers: boolean;
  onRetry: () => void;
  onFallback: () => void;
}) {
  return (
    <div className="mt-12 rounded-3xl border border-red-300/40 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300 mt-0.5" />
        <div>
          <h2 className="text-lg font-bold text-red-800 dark:text-red-200">
            We couldn't generate your report
          </h2>
          <p className="mt-1 text-sm text-red-800/80 dark:text-red-100/80">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {hasAnswers && (
          <>
            <Button variant="gradient" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" /> Try again
            </Button>
            <Button variant="subtle" onClick={onFallback}>
              Show baseline report instead
            </Button>
          </>
        )}
        <Link to="/audit">
          <Button variant="subtle">Retake the audit</Button>
        </Link>
      </div>
    </div>
  );
}

function ReadyState({
  report,
  firstName: _firstName,
  businessName,
  industryLabel: _industryLabel,
  downloading,
  onDownload,
}: {
  report: AiReport;
  firstName: string;
  businessName: string;
  industryLabel: string;
  downloading: boolean;
  onDownload: () => void;
}) {
  return (
    <>
      {report.summary && (
        <p className="mt-6 text-black/75 dark:text-white/80 leading-relaxed max-w-3xl">
          {report.summary}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="gradient" size="lg" onClick={onDownload} disabled={downloading}>
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Preparing PDF…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download PDF
            </>
          )}
        </Button>
        <Link to="/">
          <Button variant="subtle" size="lg">
            Book Strategy Session
          </Button>
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand">
          <div className="flex items-center justify-between text-xs font-semibold text-black/50 dark:text-white/60 uppercase tracking-wider">
            <span>Growth Score</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-gradient" /> AI-generated
            </span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-7xl font-extrabold text-brand-gradient leading-none">
              {report.score}
            </span>
            <span className="pb-2 text-sm text-black/50 dark:text-white/50">/ 100</span>
          </div>
          <div className="mt-8 space-y-6">
            {report.pillars.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-black/50 dark:text-white/50">{p.value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient rounded-full transition-all duration-700"
                    style={{ width: `${p.value}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60">{p.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 dark:border-white/10 p-8 bg-black/[.02] dark:bg-white/[.02]">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
            Priority moves
          </div>
          <h2 className="mt-2 text-2xl font-bold">Where to focus first</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {report.recommendations.slice(0, 4).map((r, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mt-0.5">
                    {r.pillar}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold">Your personalised recommendations</h2>
        <p className="mt-3 text-black/60 dark:text-white/60 max-w-2xl">
          Generated by Sibiso AI from your answers across Attract, Convert, Retain and
          Foundations — tailored to {businessName}.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {report.recommendations.map((r, i) => (
            <RecCard key={i} rec={r} index={i + 1} />
          ))}
        </div>
      </section>
    </>
  );
}

function RecCard({ rec, index }: { rec: AiRecommendation; index: number }) {
  const Icon =
    rec.pillar === "Attract"
      ? Target
      : rec.pillar === "Convert"
      ? TrendingUp
      : rec.pillar === "Retain"
      ? Repeat
      : Layers;
  return (
    <article className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-brand/50">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <Icon className="h-3 w-3 text-brand-gradient" /> {rec.pillar}
        </div>
        <span className="text-xs text-black/40 dark:text-white/40 font-mono">
          #{String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug">{rec.title}</h3>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70 leading-relaxed">{rec.detail}</p>
    </article>
  );
}
