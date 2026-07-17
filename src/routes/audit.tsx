import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { AuditProvider, useAudit } from "@/lib/audit/context";
import { buildQuestionFlow, ESTIMATED_TOTAL, interpolate } from "@/lib/audit/questions";
import { QuestionInput, isAnswered } from "@/components/audit/renderers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "AI Business Growth Audit — Sibiso Marketing" },
      {
        name: "description",
        content:
          "A guided AI audit that scores your Attract, Convert and Retain systems and delivers a personalised growth strategy — free, in under 10 minutes.",
      },
      { property: "og:title", content: "AI Business Growth Audit — Sibiso Marketing" },
      { property: "og:description", content: "Score your growth systems and get a personalised strategy in under 10 minutes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuditRoute,
});

function AuditRoute() {
  return (
    <AuditProvider>
      <AuditShell />
    </AuditProvider>
  );
}

function AuditShell() {
  const { answers, step, setStep, setAnswer } = useAudit();
  const navigate = useNavigate();

  const industry = answers.industry as string | undefined;
  const flow = useMemo(() => buildQuestionFlow(industry), [industry]);
  const total = flow.length || ESTIMATED_TOTAL;
  const clampedStep = Math.min(step, flow.length - 1);
  const q = flow[clampedStep];
  const value = q ? answers[q.id] : undefined;
  const progress = Math.min(100, Math.round(((clampedStep + 1) / total) * 100));
  const remaining = Math.max(1, Math.ceil(((total - clampedStep - 1) * 30) / 60));

  const goNext = () => {
    if (!q) return;
    if (!isAnswered(q, value)) return;
    if (clampedStep >= flow.length - 1) {
      // Navigate immediately; the report route owns the loading UI & AI call.
      navigate({ to: "/audit/report" });
      return;
    }
    setStep(clampedStep + 1);
  };

  const goBack = () => {
    if (clampedStep === 0) return;
    setStep(clampedStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="container-page flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2" aria-label="Back to Sibiso Marketing home">
            <Logo />
          </Link>
          <div className="flex-1 mx-4 sm:mx-8 max-w-md">
            <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-brand-gradient rounded-full"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          <Link
            to="/"
            aria-label="Exit audit"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/15 text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={16} />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          {q ? (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/50">
                <span>
                  Step {clampedStep + 1} of ~{total}
                </span>
                <span>~{remaining} min left</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
                <Sparkles className="h-3 w-3" /> {q.category}
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-black dark:text-white">
                {interpolate(q.prompt, answers)}
              </h1>
              {q.helperText && (
                <p className="mt-3 text-black/60 dark:text-white/60">{q.helperText}</p>
              )}

              <div className="mt-8">
                <QuestionInput
                  question={q}
                  value={value}
                  onChange={(v) => setAnswer(q.id, v)}
                  onEnter={goNext}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={goBack}
                  disabled={clampedStep === 0}
                  className={cn(clampedStep === 0 && "opacity-40")}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={goNext}
                  disabled={!isAnswered(q, value)}
                >
                  {clampedStep >= flow.length - 1 ? "Generate my report" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
