import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Target,
  TrendingUp,
  Repeat,
  Layers,
  Download,
  RefreshCw,
  Share2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { buildReport, type Report, type Recommendation } from "@/lib/audit/report";
import { downloadReportPdf } from "@/lib/audit/pdf";
import { INDUSTRIES } from "@/lib/audit/questions";
import { CALENDLY_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit/report")({
  head: () => ({
    meta: [
      { title: "Your Growth Strategy Report — Sibiso Marketing" },
      {
        name: "description",
        content:
          "Your personalised Sibiso Growth Score and prioritised recommendations across Attract, Convert and Retain.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

type Answers = Record<string, unknown>;

const PILLAR_ICON: Record<string, typeof Target> = {
  Attract: Target,
  Convert: TrendingUp,
  Retain: Repeat,
  Foundations: Layers,
};

function ReportRoute() {
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const report: Report | null = useMemo(
    () => (hasAnswers ? buildReport(answers) : null),
    [answers, hasAnswers],
  );

  const industryLabel = useMemo(() => {
    if (report?.industryLabel) return report.industryLabel;
    return INDUSTRIES.find((i) => i.value === String(answers.industry ?? ""))?.label ?? "";
  }, [answers.industry, report?.industryLabel]);

  const onDownload = useCallback(async () => {
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
  }, [report, firstName, businessName]);

  const onShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareData = {
      title: "My Sibiso Growth Strategy Report",
      text: `${firstName}'s growth strategy report for ${businessName}.`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* fallthrough */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Report link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }, [firstName, businessName]);

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
        {!hydrated ? null : !hasAnswers || !report ? (
          <EmptyState />
        ) : (
          <ReadyState
            report={report}
            firstName={firstName}
            businessName={businessName}
            industryLabel={industryLabel}
            downloading={downloading}
            onDownload={onDownload}
            onShare={onShare}
          />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center max-w-xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold">No audit answers found</h1>
      <p className="mt-3 text-black/60 dark:text-white/60">
        We couldn't find your audit answers on this device. Please retake the audit to generate your report.
      </p>
      <Link to="/audit" className="mt-6 inline-block">
        <Button variant="gradient" size="lg">
          Start the audit
        </Button>
      </Link>
    </div>
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
}: {
  report: Report;
  firstName: string;
  businessName: string;
  industryLabel: string;
  downloading: boolean;
  onDownload: () => void;
  onShare: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[.03] dark:bg-white/[.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
          <Sparkles className="h-3 w-3 text-brand-gradient" /> Growth Strategy Report
        </div>
        {industryLabel && (
          <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/60 dark:text-white/60">
            {industryLabel}
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
        {firstName}, here's your growth read-out for{" "}
        <span className="text-brand-gradient">{businessName}</span>.
      </h1>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-10 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 sm:p-10 shadow-brand"
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
              Growth Score
            </div>
            <div className="mt-2 flex items-end gap-2 justify-center md:justify-start">
              <span className="text-7xl sm:text-8xl font-extrabold text-brand-gradient leading-none tabular-nums">
                {report.score}
              </span>
              <span className="pb-3 text-lg text-black/50 dark:text-white/50">/ 100</span>
            </div>
          </div>
          <div className="space-y-4">
            {report.pillars.map((p, idx) => {
              const Icon = PILLAR_ICON[p.label] ?? Target;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.06 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <Icon className="h-4 w-4 text-brand-gradient" />
                      {p.label}
                    </span>
                    <span className="tabular-nums text-black/60 dark:text-white/60">{p.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-gradient rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.value}%` }}
                      transition={{ duration: 0.9, delay: 0.15 + idx * 0.06, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-black/55 dark:text-white/55">{p.note}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="gradient" size="lg" onClick={onDownload} disabled={downloading}>
            <Download className="h-4 w-4" /> {downloading ? "Preparing PDF…" : "Download PDF"}
          </Button>
          <Button variant="subtle" size="lg" onClick={onShare} className="dark:bg-white/5 dark:text-white dark:border-white/15">
            <Share2 className="h-4 w-4" /> Share report
          </Button>
          <Link to="/audit">
            <Button variant="ghost" size="lg">
              <RefreshCw className="h-4 w-4" /> Retake audit
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recommendations */}
      <section className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Personalised recommendations</h2>
        <p className="mt-2 text-black/60 dark:text-white/60">
          Prioritised moves based on your answers — start at the top.
        </p>
        <div className="mt-8 space-y-4">
          {report.recommendations.map((r, i) => (
            <RecommendationCard key={i} rec={r} index={i} />
          ))}
        </div>
      </section>

      {/* Calendly upsell */}
      <section
        className="mt-16 rounded-[32px] p-10 sm:p-14 text-white shadow-brand"
        style={{ background: "var(--brand-gradient)" }}
      >
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
              <Calendar className="h-3 w-3" /> Free 15-min strategy session
            </div>
            <h3 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight">
              Want us to walk you through this report?
            </h3>
            <p className="mt-4 text-white/85 max-w-xl">
              Book a free 15-minute session with a Sibiso growth strategist. We'll unpack your scores, sequence the recommendations and outline what to ship in the next 30 days.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Calendar className="h-4 w-4" /> Book my free session
                </Button>
              </a>
              <Button
                size="lg"
                variant="ghost"
                onClick={onDownload}
                className="text-white border border-white/40 hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          <ul className="space-y-3 text-white/90">
            {[
              "A strategist reviews your answers in advance",
              "Prioritised 30-day action plan",
              "Zero-pressure, walk-away-with-value guarantee",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </motion.div>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon = PILLAR_ICON[rec.pillar] ?? Layers;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-soft hover:shadow-brand transition-shadow",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1">
          <Icon className="h-3 w-3" /> {rec.pillar}
        </span>
        <span className="text-xs font-semibold text-black/40 dark:text-white/50 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug">{rec.title}</h3>
      <p className="mt-2 text-black/60 dark:text-white/60 leading-relaxed">{rec.detail}</p>
    </motion.div>
  );
}
