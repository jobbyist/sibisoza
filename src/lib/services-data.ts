import {
  LayoutTemplate,
  BarChart3,
  Palette,
  Mic,
  Zap,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type ServiceDetail = {
  slug: string;
  n: string;
  title: string;
  tag: string;
  copy: string;
  icon: LucideIcon;
  border: string;
  price: string;
  timeline: string;
  overview: string;
  outcomes: string[];
  includes: string[];
  process: { title: string; copy: string }[];
};

export const SERVICES: ServiceDetail[] = [
  {
    slug: "landing-pages",
    n: "01",
    title: "High-Performance Landing Pages",
    tag: "Convert Engine",
    copy: "High-converting websites built for rapid deployment and lead generation.",
    icon: LayoutTemplate,
    border: "from-[#FF6A00] to-[#FF3D3D]",
    price: "From R24,000",
    timeline: "10–14 days",
    overview:
      "A high-intent landing page engineered for conversion — from message-market fit to page speed, analytics and A/B ready structure.",
    outcomes: [
      "2–4× lift in lead-to-conversion rate on paid traffic",
      "Sub-2s load time across mobile & desktop",
      "Analytics + heatmaps wired to a single dashboard",
    ],
    includes: [
      "Conversion-first copy & wireframe",
      "Custom brand-aligned design",
      "Development, hosting setup & launch",
      "GA4 + event tracking",
      "A/B test-ready framework",
    ],
    process: [
      { title: "Diagnose", copy: "We audit your offer, ICP and traffic to define the page hypothesis." },
      { title: "Design", copy: "Copy-driven wireframes, then a full brand-aligned design pass." },
      { title: "Deploy", copy: "Build, QA, analytics wiring and go-live with post-launch optimisation." },
    ],
  },
  {
    slug: "analytics-reporting",
    n: "02",
    title: "Analytics & Insights Reporting",
    tag: "Retain Engine",
    copy: "Actionable business intelligence powered by GA4, Looker and performance dashboards.",
    icon: BarChart3,
    border: "from-[#FF3D3D] to-[#E91E63]",
    price: "From R18,000",
    timeline: "2–3 weeks",
    overview:
      "Turn scattered marketing and sales data into a single source of truth — with dashboards your team will actually use.",
    outcomes: [
      "Unified funnel visibility across paid, organic and CRM",
      "Weekly insight cadence with actions, not just numbers",
      "Confidence in the metrics that drive decisions",
    ],
    includes: [
      "GA4 audit & re-implementation",
      "Looker Studio dashboards",
      "CRM & ad-platform integrations",
      "KPI framework & reporting cadence",
    ],
    process: [
      { title: "Map", copy: "Define the KPIs that matter and the sources feeding them." },
      { title: "Build", copy: "Instrument tracking, dashboards and alerting." },
      { title: "Operate", copy: "Weekly / monthly reviews with prioritised next actions." },
    ],
  },
  {
    slug: "brand-identity",
    n: "03",
    title: "Brand Identity & Visual Design Systems",
    tag: "Attract Engine",
    copy: "Strategic brand identities and scalable visual systems for modern businesses.",
    icon: Palette,
    border: "from-[#E91E63] to-[#FF6A00]",
    price: "From R32,000",
    timeline: "3–5 weeks",
    overview:
      "A confident, distinctive brand identity — from positioning to a scalable visual system your team can apply anywhere.",
    outcomes: [
      "A brand that commands premium pricing",
      "Consistent presence across every touchpoint",
      "A design system your team can actually use",
    ],
    includes: [
      "Positioning & narrative",
      "Logo, colour, typography & motion",
      "Brand guidelines & Figma system",
      "Launch collateral kit",
    ],
    process: [
      { title: "Strategy", copy: "Positioning workshops and audience research." },
      { title: "Design", copy: "Identity exploration, refinement and system build-out." },
      { title: "Rollout", copy: "Guidelines, templates and launch assets." },
    ],
  },
  {
    slug: "podcast-content",
    n: "04",
    title: "Podcast & Content Marketing Launchpad",
    tag: "Attract + Retain",
    copy: "Launch, distribute and grow authority through premium content ecosystems.",
    icon: Mic,
    border: "from-[#FF6A00] to-[#E91E63]",
    price: "From R28,000/mo",
    timeline: "Ongoing · 6-month min.",
    overview:
      "End-to-end podcast & content production designed to build category authority and inbound demand.",
    outcomes: [
      "A weekly authority engine you don't have to run",
      "10× repurposed assets from every episode",
      "Compounding organic reach on LinkedIn, YouTube & search",
    ],
    includes: [
      "Show strategy & branding",
      "Recording, editing & publishing",
      "Show notes, clips & social distribution",
      "Guest sourcing & booking",
    ],
    process: [
      { title: "Launch", copy: "Format, brand and technical setup." },
      { title: "Produce", copy: "Weekly episodes plus a repurposing engine." },
      { title: "Grow", copy: "Distribution partnerships and audience reporting." },
    ],
  },
  {
    slug: "marketing-automation",
    n: "05",
    title: "Marketing & Sales Automation",
    tag: "Convert + Retain",
    copy: "Intelligent CRM, automation and AI-powered lead nurturing systems.",
    icon: Zap,
    border: "from-[#FF3D3D] to-[#FF6A00]",
    price: "From R36,000",
    timeline: "4–6 weeks",
    overview:
      "Design and implement the CRM, workflows and AI nurture that turn leads into revenue — automatically.",
    outcomes: [
      "20–35% lift in lead-to-close rate",
      "Zero leads dropped through the cracks",
      "AI-drafted follow-ups your team ships in minutes",
    ],
    includes: [
      "CRM setup or migration (HubSpot / Pipedrive)",
      "Lifecycle & nurture sequences",
      "AI-powered lead scoring & drafting",
      "Sales enablement dashboards",
    ],
    process: [
      { title: "Blueprint", copy: "Map lifecycle stages, data model and automation triggers." },
      { title: "Build", copy: "Implement CRM, workflows and AI integrations." },
      { title: "Enable", copy: "Train the team and iterate on performance." },
    ],
  },
  {
    slug: "social-ad-creatives",
    n: "06",
    title: "Social Media Ad Creatives",
    tag: "Attract Engine",
    copy: "Scroll-stopping creative campaigns designed to maximize engagement and conversions.",
    icon: Megaphone,
    border: "from-[#E91E63] to-[#FF3D3D]",
    price: "From R14,000/mo",
    timeline: "Ongoing",
    overview:
      "A creative studio on tap — testing, iterating and shipping ad creative that lowers CAC and lifts ROAS.",
    outcomes: [
      "10–20 fresh creatives per month",
      "Structured creative testing framework",
      "Lower CAC through winning-concept scale-outs",
    ],
    includes: [
      "Concept development & scripting",
      "Static, motion & UGC-style creatives",
      "Meta, TikTok & LinkedIn variants",
      "Weekly performance review",
    ],
    process: [
      { title: "Concept", copy: "Research winning hooks and angles for your ICP." },
      { title: "Produce", copy: "Ship a batch of variants across formats." },
      { title: "Iterate", copy: "Double down on winners, kill the rest." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
