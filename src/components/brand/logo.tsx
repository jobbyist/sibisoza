import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light" | "gradient";
  className?: string;
  showTagline?: boolean;
}

/**
 * Sibiso Marketing wordmark. The second "O" in SIBISO is replaced by a
 * circular eye/crescent-moon icon (thin ring + filled crescent).
 */
export function Logo({ variant = "dark", className, showTagline = false }: LogoProps) {
  const isLight = variant === "light";
  const textClass = isLight ? "text-white" : "text-black";
  const ringStroke = isLight ? "#ffffff" : "#000000";
  const crescentFill = variant === "gradient" ? "url(#logo-grad)" : isLight ? "#ffffff" : "#000000";

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span
        className={cn(
          "font-display font-extrabold tracking-tight text-[18px] leading-none uppercase inline-flex items-center",
          textClass,
        )}
      >
        <span>SIBIS</span>
        <svg
          viewBox="0 0 24 24"
          className="mx-[1px] h-[0.95em] w-[0.95em] -translate-y-[1px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6A00" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={ringStroke} strokeWidth="1.6" />
          <path
            d="M15.5 6.5a7 7 0 1 0 0 11 5.5 5.5 0 0 1 0-11z"
            fill={crescentFill}
          />
        </svg>
        <span>&nbsp;MARKETING</span>
      </span>
      {showTagline && (
        <span className={cn("hidden sm:inline text-xs font-medium", isLight ? "text-white/70" : "text-black/60")}>
          Strategic Growth Partner
        </span>
      )}
    </div>
  );
}
