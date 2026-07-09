import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#framework", label: "Framework" },
  { href: "#audit", label: "Growth Audit" },
  { href: "#how", label: "How It Works" },
  { href: "#solutions", label: "Solutions" },
  { href: "#cases", label: "Case Studies" },
  { href: "#podcast", label: "Podcast" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container-page">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-5 h-14 transition-all",
            scrolled
              ? "glass-card shadow-soft"
              : "bg-white/60 border border-transparent",
          )}
        >
          <a href="#top" className="flex items-center" aria-label="Sibiso Marketing home">
            <Logo />
          </a>
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-black/70 hover:text-black transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <a href="#strategy">
              <Button variant="ghost" size="sm" className="rounded-full">
                Book Strategy Session
              </Button>
            </a>
            <a href="#audit">
              <Button variant="gradient" size="sm" className="rounded-full h-9 px-5">
                Start Free Growth Audit
              </Button>
            </a>
          </div>
          <button
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-card rounded-2xl p-4 shadow-soft">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-black/80 hover:bg-black/5"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#strategy" onClick={() => setOpen(false)}>
                <Button variant="subtle" className="w-full rounded-full">
                  Book Strategy Session
                </Button>
              </a>
              <a href="#audit" onClick={() => setOpen(false)}>
                <Button variant="gradient" className="w-full rounded-full">
                  Start Free Growth Audit
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
