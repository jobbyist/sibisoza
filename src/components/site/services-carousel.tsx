import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { SERVICES, type ServiceDetail } from "@/lib/services-data";

const AUTOPLAY_MS = 5000;

export function ServicesCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const total = SERVICES.length;
  const maxIndex = Math.max(0, total - perView);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [maxIndex],
  );

  const goTo = (i: number) => setIndex(Math.min(Math.max(0, i), maxIndex));

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused, go]);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  const cardWidthPct = 100 / perView;
  const translatePct = -(index * cardWidthPct);

  const dots = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, i) => i),
    [maxIndex],
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${translatePct}%)` }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.slug}
              className="shrink-0 px-3"
              style={{ width: `${cardWidthPct}%` }}
            >
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Services carousel pagination">
          {dots.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-8 bg-brand-gradient"
                  : "w-2 bg-black/20 dark:bg-white/25 hover:bg-black/40",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceDetail }) {
  const Icon = service.icon;
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className={cn(
        "group relative block rounded-3xl p-[1.5px] bg-gradient-to-br shadow-soft h-full hover:shadow-brand transition-shadow",
        service.border,
      )}
    >
      <div className="relative h-full rounded-[calc(1.5rem-1.5px)] bg-white dark:bg-neutral-950 p-7 flex flex-col">
        <div className="flex items-start justify-between">
          <span
            className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 bg-white dark:bg-neutral-950 border-transparent bg-clip-padding"
            style={{
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(135deg,#FF6A00,#E91E63)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <Icon className="h-5 w-5" stroke="url(#brand-stroke)" />
          </span>
          <span className="text-2xl font-extrabold text-black/20 dark:text-white/25 tabular-nums">
            {service.n}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-bold text-black dark:text-white leading-snug group-hover:text-brand-gradient transition-colors">
          {service.title}
        </h3>

        <span
          className={cn(
            "mt-3 inline-flex self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r",
            service.border,
          )}
        >
          {service.tag}
        </span>

        <p className="mt-4 text-sm text-black/60 dark:text-white/60 leading-relaxed flex-1">
          {service.copy}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div
            className={cn(
              "h-[3px] w-14 rounded-full bg-gradient-to-r",
              service.border,
            )}
          />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-black/60 dark:text-white/60 group-hover:text-brand-gradient transition-colors">
            View details <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
