import { Magnet, Filter, Users } from "lucide-react";

/**
 * Attract → Convert → Retain node diagram. Pure SVG + CSS animation.
 * Respects prefers-reduced-motion via the global rule in styles.css.
 */
export function FrameworkDiagram() {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[5/4]">
      {/* soft glow */}
      <div
        aria-hidden
        className="absolute inset-8 rounded-[40%] blur-3xl opacity-60"
        style={{ background: "var(--brand-gradient-soft)" }}
      />

      <svg viewBox="0 0 500 400" className="relative w-full h-full">
        <defs>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6A00" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E91E63" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* connecting flow lines */}
        <path
          d="M110 110 C 200 60, 300 60, 390 110"
          fill="none"
          stroke="url(#edge-grad)"
          strokeWidth="1.5"
          className="animate-dash"
        />
        <path
          d="M390 130 C 320 220, 180 220, 110 130"
          fill="none"
          stroke="url(#edge-grad)"
          strokeWidth="1.5"
          className="animate-dash"
          style={{ animationDelay: "-0.7s" }}
        />
        <path
          d="M110 150 C 200 320, 300 320, 390 150"
          fill="none"
          stroke="url(#edge-grad)"
          strokeWidth="1.5"
          className="animate-dash"
          style={{ animationDelay: "-1.1s" }}
        />

        {/* halo blobs */}
        <circle cx="110" cy="130" r="90" fill="url(#node-glow)" />
        <circle cx="250" cy="200" r="110" fill="url(#node-glow)" />
        <circle cx="390" cy="130" r="90" fill="url(#node-glow)" />
      </svg>

      {/* nodes as HTML for crisp icons */}
      <Node
        style={{ left: "6%", top: "22%" }}
        icon={<Magnet className="h-5 w-5" />}
        label="Attract"
      />
      <Node
        style={{ left: "50%", top: "48%", transform: "translate(-50%,-50%)" }}
        icon={<Filter className="h-5 w-5" />}
        label="Convert"
        primary
      />
      <Node
        style={{ right: "6%", top: "22%" }}
        icon={<Users className="h-5 w-5" />}
        label="Retain"
      />

      {/* orbiting dot */}
      <div
        aria-hidden
        className="absolute h-2 w-2 rounded-full bg-brand-gradient animate-float"
        style={{ left: "30%", top: "70%" }}
      />
      <div
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full bg-brand-gradient animate-float-slow"
        style={{ left: "68%", top: "78%" }}
      />
    </div>
  );
}

function Node({
  icon,
  label,
  primary,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute animate-float"
      style={{ animationDelay: primary ? "-1.5s" : undefined, ...style }}
    >
      <div
        className={
          primary
            ? "flex items-center gap-2 rounded-2xl px-4 py-3 bg-brand-gradient text-white shadow-brand"
            : "flex items-center gap-2 rounded-2xl px-4 py-3 bg-white border border-black/10 shadow-soft"
        }
      >
        <span className={primary ? "text-white" : "text-brand-gradient"}>{icon}</span>
        <span className={"font-semibold text-sm " + (primary ? "text-white" : "text-black")}>
          {label}
        </span>
      </div>
    </div>
  );
}
