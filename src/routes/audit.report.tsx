import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, ArrowLeft, Wrench, Target, TrendingUp, Repeat, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { buildReport, type Answers, type Recommendation } from "@/lib/audit/report";

export const Route = createFileRoute("/audit/report")({
  head: () => ({
    meta: [
      { title: "Your Growth Strategy Report — Sibiso Marketing" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

function ReportRoute() {
  const [answers, setAnswers] = useState<Answers>({});
  const [ready, setReady] = useState(false);

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
    setReady(true);
  }, []);

  const report = useMemo(() => buildReport(answers), [answers]);
  const firstName = String(answers.first_name ?? "").trim() || "there";
  const businessName = String(answers.business_name ?? "").trim() || "your business";

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
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-100/60 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
          <Wrench className="h-3 w-3" /> Preview report — full AI engine in progress
        </div>

        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
          {firstName}, here's your growth read-out.
        </h1>
        <p className="mt-4 text-lg text-black/60 dark:text-white/60">
          A personalised strategy snapshot for{" "}
          <span className="font-semibold text-black dark:text-white">{businessName}</span>
          {report.industryLabel ? ` · ${report.industryLabel}` : ""}.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Growth Score */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand">
            <div className="flex items-center justify-between text-xs font-semibold text-black/50 dark:text-white/60 uppercase tracking-wider">
              <span>Growth Score</span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-brand-gradient" /> Preview scoring
              </span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-7xl font-extrabold text-brand-gradient leading-none">
                {ready ? report.score : "—"}
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

          {/* Priority moves summary */}
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

        {/* Full recommendations */}
        <section className="mt-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Your personalised recommendations</h2>
          <p className="mt-3 text-black/60 dark:text-white/60 max-w-2xl">
            Generated from your answers across Attract, Convert, Retain and Foundations. The full AI
            engine will expand each of these into a fully-modelled 90-day plan.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {report.recommendations.map((r, i) => (
              <RecCard key={i} rec={r} index={i + 1} />
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-8 bg-black/[.02] dark:bg-white/[.02]">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
            Work in progress
          </div>
          <h2 className="mt-2 text-2xl font-bold">The full AI Growth Engine is coming</h2>
          <p className="mt-2 text-black/60 dark:text-white/60 max-w-2xl">
            The next release converts this preview into a fully-modelled strategy: channel mix,
            funnel maths, priority-ranked 30/60/90 day moves and a downloadable board-ready PDF.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/">
              <Button variant="gradient" size="lg">Book Strategy Session</Button>
            </Link>
            <Link to="/audit">
              <Button variant="subtle" size="lg">Retake the audit</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon =
    rec.pillar === "Attract" ? Target : rec.pillar === "Convert" ? TrendingUp : rec.pillar === "Retain" ? Repeat : Layers;
  return (
    <article className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-brand/50">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <Icon className="h-3 w-3 text-brand-gradient" /> {rec.pillar}
        </div>
        <span className="text-xs text-black/40 dark:text-white/40 font-mono">#{String(index).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug">{rec.title}</h3>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70 leading-relaxed">{rec.detail}</p>
    </article>
  );
}
