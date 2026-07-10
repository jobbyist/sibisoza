import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "sibiso_audit_v1";

type AnswerValue = string | string[] | number | null;
type Answers = Record<string, AnswerValue>;

type Ctx = {
  answers: Answers;
  step: number;
  setStep: (n: number) => void;
  setAnswer: (id: string, value: AnswerValue) => void;
  reset: () => void;
};

const AuditCtx = createContext<Ctx | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Answers; step?: number };
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.step === "number") setStep(parsed.step);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* ignore */
    }
  }, [answers, step]);

  const setAnswer = useCallback((id: string, value: AnswerValue) => {
    setAnswers((a) => ({ ...a, [id]: value }));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setStep(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ answers, step, setStep, setAnswer, reset }), [answers, step, setAnswer, reset]);

  return <AuditCtx.Provider value={value}>{children}</AuditCtx.Provider>;
}

export function useAudit() {
  const ctx = useContext(AuditCtx);
  if (!ctx) throw new Error("useAudit must be used within <AuditProvider>");
  return ctx;
}
