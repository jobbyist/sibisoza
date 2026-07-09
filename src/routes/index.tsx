import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Magnet,
  Filter,
  Users,
  Sparkles,
  Target,
  BarChart3,
  Handshake,
  Play,
  Download,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Rss,
  CheckCircle2,
  Star,
  Rocket,
  Building2,
  Stethoscope,
  ShoppingBag,
  GraduationCap,
  Landmark,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site/nav";
import { FrameworkDiagram } from "@/components/site/framework-diagram";
import { Section, Eyebrow } from "@/components/brand/section";
import { GradientIcon } from "@/components/brand/gradient-icon";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen bg-white text-black">
      <SiteNav />
      <main className="pt-24">
        <Hero />
        <TrustBar />
        <Framework />
        <SocialProof />
        <AuditTeaser />
        <HowItWorks />
        <Solutions />
        <Industries />
        <CaseStudies />
        <Podcast />
        <ClientPortal />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient gradient wash */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full blur-3xl opacity-40"
        style={{ background: "var(--brand-gradient-soft)" }}
      />
      <div className="container-page relative">
        <div className="grid lg:grid-cols-[1.05fr_1fr] items-center gap-12 lg:gap-16 py-14 sm:py-20">
          <div>
            <Eyebrow>Strategic Growth Partner</Eyebrow>
            <h1 className="mt-6 text-[40px] sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.03em]">
              Turn Your Visibility{" "}
              <span className="text-brand-gradient">Into Revenue.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-black/60 leading-relaxed">
              Strategic growth systems designed to attract, convert and retain
              customers—helping businesses achieve measurable and sustainable
              growth.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#audit">
                <Button variant="gradient" size="lg" className="group">
                  Start Free Growth Audit
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
              <a href="#strategy">
                <Button variant="subtle" size="lg">
                  Book Free Strategy Session
                </Button>
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/60">
              {[
                "10-minute AI audit",
                "Custom growth report",
                "No credit card required",
              ].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gradient" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <FrameworkDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */

function TrustBar() {
  const items = [
    "Trusted by ambitious brands",
    "Featured in industry publications",
    "Backed by data & AI",
    "Rooted in South Africa · Global reach",
  ];
  return (
    <div className="border-y border-black/5 bg-mist/60">
      <div className="container-page py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs sm:text-sm text-black/50 font-medium">
        {items.map((i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-black/30" />
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FRAMEWORK ---------------- */

function Framework() {
  const steps = [
    {
      icon: Magnet,
      title: "Attract",
      copy: "Reach the right audience with strategy, brand storytelling and data-driven visibility that compounds over time.",
    },
    {
      icon: Filter,
      title: "Convert",
      copy: "Turn attention into action with high-intent funnels, offers and experiences engineered for measurable revenue.",
    },
    {
      icon: Users,
      title: "Retain",
      copy: "Build loyalty loops, referral engines and lifecycle systems that keep customers coming back—and bringing others.",
    },
  ];
  return (
    <Section
      id="framework"
      eyebrow="The 3-Step Growth Framework"
      title={
        <>
          A repeatable system to{" "}
          <span className="text-brand-gradient">grow with intent.</span>
        </>
      }
      description="Every engagement is built on the same disciplined framework—so growth isn't a lucky campaign, it's a compounding system."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative rounded-3xl border border-black/10 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-brand"
          >
            <div className="flex items-center justify-between">
              <GradientIcon icon={s.icon} />
              <span className="text-sm font-semibold text-black/30">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-black/60 leading-relaxed">{s.copy}</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-gradient">
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- SOCIAL PROOF ---------------- */

function SocialProof() {
  const logos = ["Northwind", "Kaya Studio", "Vela Labs", "Fynbos & Co", "Ubuntu Health", "Meridian"];
  return (
    <Section
      id="proof"
      eyebrow="Social Proof"
      title="Growth partners to teams that ship."
      description="A snapshot of the brands trusting Sibiso to design and operate their revenue systems."
      align="center"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
        {logos.map((l) => (
          <div
            key={l}
            className="h-16 rounded-xl border border-black/10 bg-white flex items-center justify-center text-black/50 font-semibold tracking-tight"
          >
            {l}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- AUDIT TEASER ---------------- */

function AuditTeaser() {
  return (
    <Section id="audit" className="pt-6">
      <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-black text-white p-8 sm:p-14">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-70"
          style={{ background: "var(--brand-gradient)" }}
        />
        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> AI Business Growth Audit
            </div>
            <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold leading-tight">
              Find the leaks costing you revenue—in under 10 minutes.
            </h2>
            <p className="mt-4 text-white/70 max-w-xl">
              Answer a few strategic questions and our AI will generate a custom
              growth report scoring your Attract, Convert and Retain systems—plus
              the exact next moves to unlock revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="gradient" size="lg">
                Start Free Growth Audit <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                className="rounded-full h-12 px-7 bg-white/10 text-white border border-white/20 hover:bg-white/15"
              >
                See a sample report
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-white text-black p-6 shadow-brand">
              <div className="flex items-center justify-between text-xs font-semibold text-black/50 uppercase tracking-wider">
                <span>Growth Score</span>
                <span>Preview</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-6xl font-extrabold text-brand-gradient leading-none">
                  72
                </span>
                <span className="pb-2 text-sm text-black/50">/ 100</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Attract", value: 64 },
                  { label: "Convert", value: 78 },
                  { label: "Retain", value: 71 },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{r.label}</span>
                      <span className="text-black/50">{r.value}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-black/5 overflow-hidden">
                      <div
                        className="h-full bg-brand-gradient rounded-full"
                        style={{ width: `${r.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-black/50">
                <Sparkles className="h-3.5 w-3.5 text-brand-gradient" />
                Personalised recommendations included
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    { icon: Target, title: "Diagnose", copy: "AI-guided audit uncovers where growth is stuck across your funnel." },
    { icon: BarChart3, title: "Design", copy: "We architect a bespoke Attract → Convert → Retain system for your business." },
    { icon: Rocket, title: "Deploy", copy: "Implementation, measurement and iteration—engineered for compounding results." },
  ];
  return (
    <Section
      id="how"
      eyebrow="How It Works"
      title="From insight to revenue in three moves."
      description="A clear path from where you are today to a growth system that scales."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-3xl border border-black/10 p-8 bg-white shadow-soft">
            <div className="flex items-center gap-4">
              <GradientIcon icon={s.icon} size="sm" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
                Step 0{i + 1}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-black/60 leading-relaxed">{s.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- SOLUTIONS ---------------- */

function Solutions() {
  const solutions = [
    { icon: Target, title: "Growth Strategy", copy: "Positioning, offers, GTM plans." },
    { icon: BarChart3, title: "Performance Marketing", copy: "Paid, SEO, content, analytics." },
    { icon: Handshake, title: "Brand & Storytelling", copy: "Identity, narrative, creative." },
    { icon: Sparkles, title: "AI Growth Systems", copy: "Automations that scale revenue." },
  ];
  return (
    <Section
      id="solutions"
      eyebrow="Solutions"
      title="Systems, not services."
      description="Modular capabilities that plug into your existing team—or run end-to-end as a growth partner."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {solutions.map((s) => (
          <div
            key={s.title}
            className="group rounded-2xl border border-black/10 p-6 bg-white shadow-soft hover:shadow-brand hover:-translate-y-0.5 transition-all"
          >
            <GradientIcon icon={s.icon} size="sm" />
            <h4 className="mt-5 font-bold">{s.title}</h4>
            <p className="mt-1 text-sm text-black/60">{s.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- INDUSTRIES ---------------- */

function Industries() {
  const industries = [
    { icon: ShoppingBag, name: "Retail & E-commerce" },
    { icon: Stethoscope, name: "Health & Wellness" },
    { icon: GraduationCap, name: "Education" },
    { icon: Building2, name: "Professional Services" },
    { icon: Landmark, name: "Financial Services" },
    { icon: Wrench, name: "Industrial & B2B" },
  ];
  return (
    <Section
      id="industries"
      eyebrow="Industries Served"
      title="Growth systems tuned to your market."
      description="We work across sectors where distinctive positioning and disciplined execution create outsized results."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {industries.map((i) => (
          <div
            key={i.name}
            className="rounded-2xl border border-black/10 bg-white p-5 flex flex-col items-start gap-4 hover:border-black/30 transition-colors"
          >
            <GradientIcon icon={i.icon} size="sm" />
            <span className="text-sm font-semibold leading-tight">{i.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- CASE STUDIES ---------------- */

function CaseStudies() {
  const cases = [
    { tag: "E-commerce", title: "3.4× revenue in 6 months", copy: "Rebuilt the funnel end-to-end for a lifestyle DTC brand." },
    { tag: "Health", title: "62% CAC reduction", copy: "Repositioning + paid strategy for a wellness clinic network." },
    { tag: "B2B SaaS", title: "$1.2M pipeline in Q1", copy: "Content + ABM system for a fintech scale-up." },
  ];
  return (
    <Section
      id="cases"
      eyebrow="Case Studies"
      title="Real systems. Measurable outcomes."
      description="A preview of engagements—full case studies coming soon."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {cases.map((c) => (
          <a
            key={c.title}
            href="#"
            className="group block rounded-3xl overflow-hidden border border-black/10 bg-white shadow-soft hover:shadow-brand transition-all"
          >
            <div
              className="h-40 relative"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]" />
              <span className="absolute top-4 left-4 rounded-full bg-white/90 text-black text-xs font-semibold px-3 py-1">
                {c.tag}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold group-hover:text-brand-gradient transition-colors">
                {c.title}
              </h3>
              <p className="mt-2 text-black/60 text-sm">{c.copy}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Read case study <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PODCAST ---------------- */

function Podcast() {
  return (
    <Section id="podcast">
      <div className="rounded-[32px] border border-black/10 bg-mist p-8 sm:p-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
        <div className="relative aspect-square max-w-[360px] w-full rounded-3xl overflow-hidden shadow-brand"
          style={{ background: "var(--brand-gradient)" }}>
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90">
              The Sibiso Growth Podcast
            </span>
            <div>
              <div className="text-3xl font-extrabold leading-tight">
                Conversations on growth, brand & the future of business.
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black font-semibold px-4 py-2 text-sm hover:bg-white/90">
                <Play className="h-4 w-4 fill-black" /> Listen to the latest
              </button>
            </div>
          </div>
        </div>
        <div>
          <Eyebrow>Podcast</Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold leading-[1.05]">
            Strategy, unfiltered.
          </h2>
          <p className="mt-4 text-black/60 leading-relaxed max-w-xl">
            Weekly conversations with founders, marketers and operators on what
            actually moves revenue. Player and episode library coming soon.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://sibisomarketing.substack.com"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="subtle" size="lg">
                Subscribe on Substack
              </Button>
            </a>
            <Button variant="ghost" size="lg" className="rounded-full">
              Browse episodes
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- CLIENT PORTAL ---------------- */

function ClientPortal() {
  return (
    <Section
      id="portal"
      eyebrow="Client Portal"
      title="Your growth engine, transparent by default."
      description="Track deliverables, dashboards, strategy docs and revenue KPIs in one shared workspace. Full portal launching soon."
    >
      <div className="relative rounded-[28px] border border-black/10 bg-white shadow-soft overflow-hidden">
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="border-r border-black/10 p-5 bg-mist/60 hidden md:block">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
              Workspace
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {["Overview", "Growth Report", "Campaigns", "Content", "Reports", "Team"].map((l, i) => (
                <li
                  key={l}
                  className={
                    "px-3 py-2 rounded-lg " +
                    (i === 0
                      ? "bg-black text-white font-semibold"
                      : "text-black/60 hover:bg-black/5")
                  }
                >
                  {l}
                </li>
              ))}
            </ul>
          </aside>
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
                  This month
                </div>
                <h3 className="mt-1 text-2xl font-bold">Revenue impact</h3>
              </div>
              <span className="rounded-full bg-brand-gradient text-white text-xs font-semibold px-3 py-1">
                +38.4%
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { k: "Pipeline", v: "R2.4M" },
                { k: "Qualified leads", v: "312" },
                { k: "CAC", v: "-24%" },
              ].map((m) => (
                <div key={m.k} className="rounded-xl border border-black/10 p-4">
                  <div className="text-xs text-black/50">{m.k}</div>
                  <div className="mt-1 text-xl font-bold">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 h-40 rounded-xl border border-black/10 p-4 bg-gradient-to-b from-white to-mist/50 flex items-end gap-2">
              {[38, 52, 44, 61, 55, 72, 68, 84, 79, 92].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-brand-gradient opacity-90"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */

function Testimonials() {
  const quotes = [
    {
      q: "Sibiso doesn't sell tactics—they build systems. Our revenue tripled without doubling our spend.",
      a: "Naledi M.",
      r: "Founder, DTC brand",
    },
    {
      q: "The most strategic partner we've worked with. Clear thinking, sharp execution.",
      a: "Thabo K.",
      r: "CEO, B2B SaaS",
    },
    {
      q: "They translated brand into revenue. That's rare.",
      a: "Sarah L.",
      r: "CMO, Health group",
    },
  ];
  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title="Words from partners in growth."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {quotes.map((t) => (
          <blockquote
            key={t.a}
            className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft flex flex-col"
          >
            <div className="flex gap-1 text-brand-gradient">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-black/80 leading-relaxed">"{t.q}"</p>
            <footer className="mt-6 pt-6 border-t border-black/10">
              <div className="font-semibold">{t.a}</div>
              <div className="text-sm text-black/50">{t.r}</div>
            </footer>
          </blockquote>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs = [
    {
      q: "What is the AI Growth Audit?",
      a: "A guided assessment that scores your Attract, Convert and Retain systems and generates a personalised report of high-impact next moves.",
    },
    {
      q: "Do you work with businesses outside South Africa?",
      a: "Yes. We partner with ambitious businesses globally, with a home base in South Africa.",
    },
    {
      q: "How is Sibiso different from a typical agency?",
      a: "We're a strategic growth partner. We design and operate the system—not just campaigns—so growth compounds over time.",
    },
    {
      q: "How quickly can we start?",
      a: "Most engagements kick off within two weeks of your strategy session, once scope and outcomes are agreed.",
    },
  ];
  return (
    <Section id="faq" eyebrow="FAQ" title="Answers, upfront." align="center">
      <div className="max-w-3xl mx-auto divide-y divide-black/10 rounded-3xl border border-black/10 bg-white shadow-soft">
        {faqs.map((f, i) => (
          <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
              <span className="font-semibold text-lg">{f.q}</span>
              <ChevronDown className="h-5 w-5 mt-1 text-black/50 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-black/60 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCTA() {
  return (
    <Section id="strategy" className="pb-28">
      <div
        className="relative overflow-hidden rounded-[32px] p-10 sm:p-16 text-white text-center"
        style={{ background: "var(--brand-gradient)" }}
      >
        <div aria-hidden className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_10%,white,transparent_40%),radial-gradient(circle_at_80%_90%,white,transparent_40%)]" />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-[1.05]">
            Ready to Turn Your Visibility Into Revenue?
          </h2>
          <p className="mt-4 text-white/90 text-lg">
            Let's design a growth system that pays for itself—and then some.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full h-12 px-7 bg-black text-white hover:bg-black/90">
              Book Strategy Session
            </Button>
            <Button size="lg" className="rounded-full h-12 px-7 bg-white text-black hover:bg-white/90">
              Request Custom Proposal
            </Button>
            <Button
              size="lg"
              className="rounded-full h-12 px-7 bg-white/10 text-white border border-white/30 hover:bg-white/15"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- FOOTER ---------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="container-page py-16">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <Logo />
            <p className="mt-5 text-sm text-black/60 max-w-sm leading-relaxed">
              We partner with ambitious businesses to design and implement growth
              systems that drive predictable revenue and long-term impact.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="https://www.linkedin.com" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialLink>
              <SocialLink href="https://instagram.com/sibisomarketing" label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
              <SocialLink href="https://sibisomarketing.substack.com" label="Substack"><Rss className="h-4 w-4" /></SocialLink>
            </div>
          </div>
          <FooterCol
            title="Company"
            items={["About", "Case Studies", "Podcast", "Contact"]}
          />
          <FooterCol
            title="Solutions"
            items={["Growth Strategy", "Performance Marketing", "Brand & Story", "AI Systems"]}
          />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
              Get in touch
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2 text-black/70">
                <Mail className="h-4 w-4 text-brand-gradient" />
                <a href="mailto:hello@sibisomarketing.co.za" className="hover:text-black">
                  hello@sibisomarketing.co.za
                </a>
              </li>
              <li className="flex items-center gap-2 text-black/70">
                <Phone className="h-4 w-4 text-brand-gradient" />
                <a href="tel:+27753813495" className="hover:text-black">
                  +27 75 381 3495
                </a>
              </li>
              <li className="flex items-center gap-2 text-black/70">
                <span className="h-4 w-4 inline-flex items-center justify-center text-brand-gradient">→</span>
                <a href="https://sibisomarketing.co.za" className="hover:text-black">
                  sibisomarketing.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs text-black/50">
          <div>© {new Date().getFullYear()} Sibiso Marketing (Pty) Ltd. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-black/70">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-black">{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 text-black/70 hover:text-white hover:bg-black transition-colors"
    >
      {children}
    </a>
  );
}
