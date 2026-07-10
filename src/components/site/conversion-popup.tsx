import { useEffect, useRef, useState } from "react";
import { X, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FORMSPREE_ENDPOINT } from "@/lib/config";

const SHOWN_KEY = "sibiso_lead_popup_shown";

/**
 * Single conversion popup listening for exit-intent, 60% scroll, or 30s timer.
 * Whichever fires first shows the modal; then never again this session.
 * Skipped entirely on /audit routes.
 */
export function ConversionPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const firedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/audit")) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    };

    // 30s timer
    const t = window.setTimeout(trigger, 30_000);

    // 60% scroll depth
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      if (height > 0 && scrolled / height >= 0.6) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Exit intent (desktop-ish; ignore touch)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Focus the dialog for a11y
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "conversion_popup", topic: "Growth Systems Checklist" }),
      });
      if (!res.ok) throw new Error("network");
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/10 shadow-brand p-8 outline-none"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/15 text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X size={16} />
        </button>

        {state === "done" ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gradient" />
            <h3 className="mt-4 text-2xl font-extrabold text-black dark:text-white">You're in.</h3>
            <p className="mt-2 text-black/60 dark:text-white/60">
              The Growth Systems Checklist is on its way to your inbox.
            </p>
            <Button onClick={() => setOpen(false)} variant="gradient" className="mt-6">
              Keep exploring
            </Button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
              <Sparkles className="h-3 w-3" /> Free download
            </div>
            <h2
              id="lead-popup-title"
              className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight text-black dark:text-white"
            >
              Get the Free <span className="text-brand-gradient">Growth Systems Checklist</span>
            </h2>
            <p className="mt-3 text-sm text-black/60 dark:text-white/60">
              The 27-point diagnostic we use to pressure-test any business's Attract → Convert → Retain
              engine. Delivered instantly.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white px-5 h-12 outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={state === "sending"}
                className="shrink-0"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending
                  </>
                ) : (
                  "Send it"
                )}
              </Button>
            </form>
            {state === "error" && (
              <p className="mt-3 text-sm text-destructive">
                Something went wrong. Please try again or email hello@sibisomarketing.co.za.
              </p>
            )}
            <p className="mt-3 text-[11px] text-black/40 dark:text-white/40">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
