import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

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

function ReportRoute() {
  const [answers, setAnswers] = useState<Answers>({});

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
  }, []);

  const firstName = String(answers.first_name ?? "").trim() || "there";
  const businessName = String(answers.business_name ?? "").trim() || "your business";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="container-page flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link to="/audit" className="text-sm font-medium text-black/60 dark:text-white/70 hover:text-black dark:hover:text-white">
            <ArrowLeft className="inline h-4 w-4" /> Back to audit
          </Link>
        </div>
      </header>

      <main className="container-page py-14 sm:py-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-100/60 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
          <Wrench className="h-3 w-3" /> Preview — full engine coming soon
        </div>

        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
          {firstName}, your report is ready.
        </h1>
        <p className="mt-4 text-lg text-black/60 dark:text-white/60">
          A personalised growth strategy for <span className="font-semibold text-black dark:text-white">{businessName}</span>.
        </p>

        {/* Growth Score card (mocked, matches homepage visual) */}
        <div className="mt-10 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-brand">
          <div className="flex items-center justify-between text-xs font-semibold text-black/50 dark:text-white/60 uppercase tracking-wider">
            <span>Growth Score</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-gradient" /> AI-generated
            </span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-7xl font-extrabold text-brand-gradient leading-none">72</span>
            <span className="pb-2 text-sm text-black/50 dark:text-white/50">/ 100</span>
          </div>
          <div className="mt-8 space-y-5">
            {[
              { label: "Attract", value: 64 },
              { label: "Convert", value: 78 },
              { label: "Retain", value: 71 },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{r.label}</span>
                  <span className="text-black/50 dark:text-white/50">{r.value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient rounded-full"
                    style={{ width: `${r.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-8 bg-black/[.02] dark:bg-white/[.02]">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
            Coming soon
          </div>
          <h2 className="mt-2 text-2xl font-bold">Your full AI-generated strategy</h2>
          <p className="mt-2 text-black/60 dark:text-white/60">
            The full engine will convert your answers into specific recommendations across positioning,
            channels, funnel, retention and automation — with priority-ranked next moves.
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
