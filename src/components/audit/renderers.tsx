import type { Question } from "@/lib/audit/questions";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  question: Question;
  value: unknown;
  onChange: (v: string | string[] | number) => void;
  onEnter: () => void;
};

export function QuestionInput({ question, value, onChange, onEnter }: Props) {
  const q = question;

  if (q.type === "short_text") {
    return (
      <textarea
        autoFocus
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onEnter();
        }}
        placeholder={q.placeholder}
        rows={3}
        className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white text-lg leading-relaxed px-5 py-4 outline-none focus:ring-2 focus:ring-ring resize-none"
      />
    );
  }

  if (q.type === "email") {
    return (
      <input
        autoFocus
        type="email"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder={q.placeholder ?? "you@company.com"}
        className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white text-lg px-6 h-14 outline-none focus:ring-2 focus:ring-ring"
      />
    );
  }

  if (q.type === "number" || q.type === "range") {
    return (
      <input
        autoFocus
        type={q.type === "range" ? "range" : "number"}
        min={q.min}
        max={q.max}
        step={q.step ?? 1}
        value={(value as number) ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white text-lg px-6 h-14 outline-none focus:ring-2 focus:ring-ring"
      />
    );
  }

  if (q.type === "single_select") {
    const selected = (value as string) ?? "";
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options?.map((o) => {
          const isSel = selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                // small delay so user sees the select, then auto-advance
                setTimeout(onEnter, 220);
              }}
              className={cn(
                "text-left rounded-2xl border px-5 py-4 transition-all group",
                isSel
                  ? "border-transparent ring-2 ring-[#E91E63] bg-white dark:bg-white/10 shadow-brand"
                  : "border-black/15 dark:border-white/15 bg-white dark:bg-white/5 hover:border-black/40 dark:hover:border-white/30",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full border shrink-0",
                    isSel
                      ? "bg-brand-gradient border-transparent text-white"
                      : "border-black/25 dark:border-white/30",
                  )}
                >
                  {isSel && <Check size={12} />}
                </span>
                <div>
                  <div className="font-semibold text-black dark:text-white leading-snug">
                    {o.label}
                  </div>
                  {o.description && (
                    <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                      {o.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "multi_select") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options?.map((o) => {
          const isSel = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                const next = isSel ? selected.filter((v) => v !== o.value) : [...selected, o.value];
                onChange(next);
              }}
              className={cn(
                "text-left rounded-2xl border px-5 py-4 transition-all",
                isSel
                  ? "border-transparent ring-2 ring-[#E91E63] bg-white dark:bg-white/10"
                  : "border-black/15 dark:border-white/15 bg-white dark:bg-white/5 hover:border-black/40 dark:hover:border-white/30",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center justify-center h-5 w-5 rounded-md border shrink-0",
                    isSel
                      ? "bg-brand-gradient border-transparent text-white"
                      : "border-black/25 dark:border-white/30",
                  )}
                >
                  {isSel && <Check size={12} />}
                </span>
                <span className="font-semibold text-black dark:text-white">{o.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return null;
}

export function isAnswered(q: Question, v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (q.type === "multi_select") return Array.isArray(v) && v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return !Number.isNaN(v);
  return true;
}
