import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
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
  Share2,
  Calendar,
  CheckCircle2,
  Brain,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import {
  generateAuditReport,
  type AiRecommendation,
  type AiReport,
} from "@/lib/audit/generate-report.functions";
import { downloadReportPdf } from "@/lib/audit/pdf";
import { INDUSTRIES } from "@/lib/audit/questions";
import { CALENDLY_URL } from "@/lib/config";

export const Route = createFileRoute("/audit/report")({
  head: () => ({
    meta: [
      { title: "Your Growth Strategy Report — Sibiso Marketing" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

type Answers = Record<string, unknown>;
type Status = "loading" | "ready" | "error";

// Rough estimate of how long Claude typically takes to draft the report.
const ESTIMATED_SECONDS = 28;

const THOUGHT_STEPS = [
  { icon: Brain, label: "Reading your answers" },
  { icon: Target, label: "Diagnosing your Attract engine" },
  { icon: TrendingUp, label: "Scoring your Convert engine" },
  { icon: Repeat, label: "Auditing your Retain engine" },
  { icon: Zap, label: "Prioritising your growth moves" },
  { icon: Sparkles, label: "Drafting your personalised report" },
];

function ReportRoute() {
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [report, setReport] = useState<AiReport | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const generate = useServerFn(generateAuditReport);

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
        const msg =
          err instanceof Error ? err.message : "Something went wrong generating your report.";
        console.error("[audit/report]", err);
        setErrorMsg(msg);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, hasAnswers, attempt, answers, generate]);

  const regenerate = useCallback(() => {
    setAttempt((n) => n + 1);
    toast.message("Regenerating your report", {
      description: "Sibiso AI is drafting a fresh strategy based on your latest answers.",
    });
  }, []);

  const onDownload = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      await downloadReportPdf(report, { firstName, businessName });
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("The PDF couldn't be generated. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const onShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareData = {
      title: "My Sibiso Growth Strategy Report",
      text: `${firstName}'s growth strategy report for ${businessName} — powered by Sibiso AI.`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Report link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link. Please copy from the address bar.");
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
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <LoadingState firstName={firstName} businessName={businessName} attempt={attempt} />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState
                message={errorMsg}
                hasAnswers={hasAnswers}
                onRetry={regenerate}
                firstName={firstName}
              />
            </motion.div>
          )}

          {status === "ready" && report && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ReadyState
                report={report}
                firstName={firstName}
                businessName={businessName}
                industryLabel={industryLabel}
                downloading={downloading}
                onDownload={onDownload}
                onShare={onShare}
                onRegenerate={regenerate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LoadingState({
  firstName,
  businessName,
  attempt,
}: {
  firstName: string;
  businessName: string;
  attempt: number;
}) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
    const id = window.setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [attempt]);

  // Progress asymptotically approaches 95% so it never "finishes" before Claude replies.
  const progress = Math.min(95, (elapsed / ESTIMATED_SECONDS) * 92);
  const remaining = Math.max(0, Math.ceil(ESTIMATED_SECONDS - elapsed));
  const stepIndex = Math.min(
    THOUGHT_STEPS.length - 1,
    Math.floor((elapsed / ESTIMATED_SECONDS) * THOUGHT_STEPS.length),
  );

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[.03] dark:bg-white/[.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
        <Sparkles className="h-3 w-3 text-brand-gradient" />
        Powered by Sibiso AI · Claude
      </div>

      <motion.h1
        className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {firstName}, we're drafting your growth strategy…
      </motion.h1>
      <p className="mt-4 text-lg text-black/60 dark:text-white/60">
        Personalising for{" "}
        <span className="font-semibold text-black dark:text-white">{businessName}</span>. This
        usually takes about {ESTIMATED_SECONDS} seconds.
      </p>

      <div className="mt-10 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand overflow-hidden relative">
        {/* Floating gradient orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-gradient opacity-20 blur-3xl"
          animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-gradient opacity-10 blur-3xl"
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          <div className="flex items-center justify-between text-sm">
            <div className="inline-flex items-center gap-2 font-semibold text-black/80 dark:text-white/80">
              <Loader2 className="h-4 w-4 animate-spin text-brand-gradient" />
              Sibiso AI is thinking…
            </div>
            <div className="font-mono text-xs text-black/50 dark:text-white/50">
              {remaining === 0 ? "wrapping up…" : `~${remaining}s remaining`}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-brand-gradient rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </div>
          <div className="mt-2 text-right text-[11px] font-mono uppercase tracking-wider text-black/40 dark:text-white/50">
            {Math.round(progress)}%
          </div>

          {/* Thought steps */}
          <ul className="mt-6 space-y-2.5">
            {THOUGHT_STEPS.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.label}
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: done || active ? 1 : 0.4, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span
                    className={
                      done
                        ? "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white"
                        : active
                        ? "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/15 dark:border-white/20 text-brand-gradient"
                        : "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40"
                    }
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : active ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </motion.span>
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span
                    className={
                      active
                        ? "font-semibold text-black dark:text-white"
                        : "text-black/70 dark:text-white/70"
                    }
                  >
                    {s.label}
                    {active && "…"}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function ErrorState({
  message,
  hasAnswers,
  onRetry,
  firstName,
}: {
  message: string;
  hasAnswers: boolean;
  onRetry: () => void;
  firstName: string;
}) {
  return (
    <>
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
        Sorry {firstName}, we hit a snag.
      </h1>
      <div className="mt-8 rounded-3xl border border-red-300/40 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-8">
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
            <Button variant="gradient" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" /> Regenerate my report
            </Button>
          )}
          <Link to="/audit">
            <Button variant="subtle">Retake the audit</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

function ReadyState({
  report,
  firstName,
  businessName,
  industryLabel,
  downloading,
  onDownload,
  onShare,
  onRegenerate,
}: {
  report: AiReport;
  firstName: string;
  businessName: string;
  industryLabel: string;
  downloading: boolean;
  onDownload: () => void;
  onShare: () => void;
  onRegenerate: () => void;
}) {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[.03] dark:bg-white/[.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
        <Sparkles className="h-3 w-3 text-brand-gradient" />
        Powered by Sibiso AI · {report.provider === "claude" ? "Claude" : "Fallback"}
      </div>

      <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
        {report.headline || `${firstName}, here's your growth read-out.`}
      </h1>
      <p className="mt-4 text-lg text-black/60 dark:text-white/60">
        A personalised strategy snapshot for{" "}
        <span className="font-semibold text-black dark:text-white">{businessName}</span>
        {industryLabel ? ` · ${industryLabel}` : ""}.
      </p>

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
        <Button variant="subtle" size="lg" onClick={onShare}>
          <Share2 className="h-4 w-4" /> Share report
        </Button>
        <Button variant="ghost" size="lg" onClick={onRegenerate}>
          <RefreshCw className="h-4 w-4" /> Regenerate my report
        </Button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-black/50 dark:text-white/60 uppercase tracking-wider">
            <span>Growth Score</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-gradient" /> AI-generated
            </span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <motion.span
              className="text-7xl font-extrabold text-brand-gradient leading-none"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              {report.score}
            </motion.span>
            <span className="pb-2 text-sm text-black/50 dark:text-white/50">/ 100</span>
          </div>
          <div className="mt-8 space-y-6">
            {report.pillars.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-black/50 dark:text-white/50">{p.value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.value}%` }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + i * 0.08 }}
                  />
                </div>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60">{p.note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-black/10 dark:border-white/10 p-8 bg-black/[.02] dark:bg-white/[.02]"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
            Priority moves
          </div>
          <h2 className="mt-2 text-2xl font-bold">Where to focus first</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {report.recommendations.slice(0, 4).map((r, i) => (
              <motion.li
                key={i}
                className="flex gap-3"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mt-0.5">
                    {r.pillar}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
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

      <CalendlyUpsell firstName={firstName} />
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
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-brand/50"
    >
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
    </motion.article>
  );
}

function CalendlyUpsell({ firstName }: { firstName: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.5 }}
      className="mt-16 relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-black text-white p-10 sm:p-14"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gradient opacity-40 blur-3xl"
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-gradient opacity-25 blur-3xl"
        animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <Sparkles className="h-3 w-3" /> Free · 15 minutes · No pitch
        </div>
        <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold leading-[1.05]">
          {firstName}, want to turn this report into a plan?
        </h2>
        <p className="mt-4 text-white/70 text-lg max-w-xl">
          Book a free 15-minute strategy session with a Sibiso growth strategist. We'll walk
          through your top 3 priority moves and map the first 30 days.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="gradient" size="lg" className="shadow-brand">
              <Calendar className="h-4 w-4" /> Book my free strategy session
            </Button>
          </a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="self-center text-sm text-white/60 hover:text-white underline underline-offset-4">
            or view available times
          </a>
        </div>
      </div>
    </motion.section>
  );
}
