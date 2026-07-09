import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

/**
 * Renders a lucide icon stroked with the brand gradient by wrapping the
 * currentColor stroke in a transparent-text container that inherits from a
 * gradient text color.
 */
export function GradientIcon({ icon: Icon, size = "md", className, label }: GradientIconProps) {
  const box = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconSize = size === "sm" ? 20 : size === "lg" ? 30 : 24;

  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white shadow-soft",
        box,
        className,
      )}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="brand-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6A00" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
        </defs>
      </svg>
      <Icon
        size={iconSize}
        stroke="url(#brand-stroke)"
        strokeWidth={1.75}
        className="[&_*]:stroke-[url(#brand-stroke)]"
      />
    </span>
  );
}
