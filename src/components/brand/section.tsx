import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  containerClassName?: string;
  align?: "left" | "center";
  children?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  align = "left",
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <div className={cn("container-page", containerClassName)}>
        {(eyebrow || title || description) && (
          <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white leading-[1.05]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base sm:text-lg text-black/60 dark:text-white/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        {children && <div className={cn(eyebrow || title ? "mt-14" : "")}>{children}</div>}
      </div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
      {children}
    </div>
  );
}
