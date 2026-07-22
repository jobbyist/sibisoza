import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Tag,
  Mail,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, SERVICES } from "@/lib/services-data";
import { CALENDLY_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getServiceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — Sibiso Marketing" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — Sibiso Marketing`;
    return {
      meta: [
        { title },
        { name: "description", content: service.overview },
        { property: "og:title", content: title },
        { property: "og:description", content: service.overview },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <SiteNav />
      <div className="container-page py-24 text-center">
        <h1 className="text-4xl font-extrabold">Service not found</h1>
        <p className="mt-3 text-black/60 dark:text-white/60">
          The service you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-brand-gradient font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}

function ServicePage() {
  const { service } = Route.useLoaderData();
  const Icon = service.icon;

  const purchaseHref = `mailto:hello@sibisomarketing.co.za?subject=${encodeURIComponent(
    `Purchase: ${service.title}`,
  )}&body=${encodeURIComponent(
    `Hi Sibiso team,\n\nI'd like to purchase the ${service.title} package. Please send onboarding + payment details.\n\nThanks!`,
  )}`;

  const contactHref = `mailto:hello@sibisomarketing.co.za?subject=${encodeURIComponent(
    `Enquiry: ${service.title}`,
  )}`;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <SiteNav />

      <main className="container-page py-10 sm:py-14">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-black/50 dark:text-white/50"
        >
          <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/" hash="solutions" className="hover:text-black dark:hover:text-white">
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-black dark:text-white font-medium truncate">{service.title}</span>
        </nav>

        {/* Hero */}
        <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full text-xs font-semibold uppercase tracking-wider text-white px-3 py-1 bg-gradient-to-r",
                  service.border,
                )}
              >
                {service.tag}
              </span>
              <span className="text-xs font-semibold tracking-[0.16em] uppercase text-black/40 dark:text-white/50">
                Service {service.n}
              </span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
              {service.title}
            </h1>
            <p className="mt-5 text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-2xl">
              {service.overview}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={purchaseHref}>
                <Button variant="gradient" size="lg">
                  <ShoppingCart className="h-4 w-4" /> Purchase
                </Button>
              </a>
              <a href={contactHref}>
                <Button variant="subtle" size="lg" className="dark:bg-white/5 dark:text-white dark:border-white/15">
                  <Mail className="h-4 w-4" /> Contact Us
                </Button>
              </a>
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="lg">
                  Book a free strategy call <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
              <div className="inline-flex items-center gap-2 text-black/70 dark:text-white/70">
                <Tag className="h-4 w-4 text-brand-gradient" />
                <span className="font-semibold">{service.price}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-black/70 dark:text-white/70">
                <Clock className="h-4 w-4 text-brand-gradient" />
                <span>{service.timeline}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn(
              "rounded-3xl p-[1.5px] bg-gradient-to-br shadow-brand",
              service.border,
            )}
          >
            <div className="rounded-[calc(1.5rem-1.5px)] bg-white dark:bg-neutral-900 p-8">
              <span
                className="inline-flex items-center justify-center h-14 w-14 rounded-full"
                style={{
                  backgroundImage:
                    "linear-gradient(white, white), linear-gradient(135deg,#FF6A00,#E91E63)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  border: "2px solid transparent",
                }}
              >
                <Icon className="h-6 w-6" stroke="url(#brand-stroke)" />
              </span>
              <h2 className="mt-5 text-xl font-bold">What you get</h2>
              <ul className="mt-4 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-brand-gradient shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Outcomes */}
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Outcomes you can expect</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {service.outcomes.map((o, i) => (
              <div
                key={o}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-gradient">
                  Outcome 0{i + 1}
                </span>
                <p className="mt-3 text-black dark:text-white font-medium leading-snug">{o}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Our process</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {service.process.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6"
              >
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-black/40 dark:text-white/50">
                  Step 0{i + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  {p.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="mt-20 rounded-[32px] p-10 sm:p-14 text-white" style={{ background: "var(--brand-gradient)" }}>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
            Ready to ship {service.title}?
          </h2>
          <p className="mt-4 text-white/80 max-w-xl">
            Purchase today or talk to a strategist first — either way, we can start this week.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={purchaseHref}>
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <ShoppingCart className="h-4 w-4" /> Purchase
              </Button>
            </a>
            <a href={contactHref}>
              <Button size="lg" variant="ghost" className="text-white border border-white/40 hover:bg-white/10">
                <Mail className="h-4 w-4" /> Contact Us
              </Button>
            </a>
          </div>
        </section>

        {/* Other services */}
        <section className="mt-20">
          <h2 className="text-xl font-bold">Explore other services</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3).map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors"
              >
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-black/40 dark:text-white/50">
                  {s.n} · {s.tag}
                </span>
                <div className="mt-2 font-bold leading-snug">{s.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-gradient">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
