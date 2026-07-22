import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, Mic, Rss, ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "The Sibiso Growth Podcast — Sibiso Marketing" },
      {
        name: "description",
        content:
          "Weekly conversations with founders, marketers and operators on what actually moves revenue. Stream featured episodes of The Sibiso Growth Podcast.",
      },
      { property: "og:title", content: "The Sibiso Growth Podcast — Sibiso Marketing" },
      {
        property: "og:description",
        content: "Strategy, unfiltered. Featured episodes from The Sibiso Growth Podcast.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PodcastPage,
});

type Episode = {
  n: string;
  title: string;
  guest: string;
  duration: string;
  summary: string;
  audioUrl: string;
};

// TODO: replace placeholder audio with real episode URLs once the show is live.
const EPISODES: Episode[] = [
  {
    n: "01",
    title: "The Attract → Convert → Retain framework, explained.",
    guest: "Sibiso Founding Team",
    duration: "32 min",
    summary:
      "Why most growth stalls at Convert, and how to design a system where every pillar compounds the next.",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f4bd21c.mp3",
  },
  {
    n: "02",
    title: "How to build a second demand channel before referrals dry up.",
    guest: "Growth Operators Roundtable",
    duration: "41 min",
    summary:
      "A tactical playbook for adding an owned channel — SEO, content and LinkedIn — without diluting focus.",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
  },
  {
    n: "03",
    title: "AI in the funnel: where it compounds, where it distracts.",
    guest: "Sibiso Strategy Desk",
    duration: "28 min",
    summary:
      "The three AI use-cases that meaningfully move revenue this year — and the shiny ones to avoid.",
    audioUrl: "https://cdn.pixabay.com/download/audio/2023/06/28/audio_a5bbe0f8bb.mp3",
  },
];

function PodcastPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <SiteNav />

      <main className="container-page py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-black/50 dark:text-white/50">
          <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-black dark:text-white font-medium">Podcast</span>
        </nav>

        {/* Hero */}
        <div className="mt-8 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 dark:text-white/70">
              <Mic className="h-3 w-3" /> The Sibiso Growth Podcast
            </div>
            <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.05]">
              Strategy, <span className="text-brand-gradient">unfiltered.</span>
            </h1>
            <p className="mt-5 text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-xl">
              Weekly conversations with founders, marketers and operators on what actually moves revenue. Featured episodes below — full library on Substack.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://sibisomarketing.substack.com" target="_blank" rel="noreferrer">
                <Button variant="gradient" size="lg">
                  <Rss className="h-4 w-4" /> Subscribe on Substack
                </Button>
              </a>
              <Link to="/">
                <Button variant="ghost" size="lg">
                  Back to home <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative aspect-square max-w-[400px] w-full rounded-3xl overflow-hidden shadow-brand"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-90">
                <Sparkles className="h-3 w-3" /> Featured
              </div>
              <div>
                <div className="text-3xl font-extrabold leading-tight">
                  Conversations on growth, brand & the future of business.
                </div>
                <div className="mt-4 text-sm opacity-80">3 featured episodes · weekly release</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured episodes */}
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Featured episodes</h2>
            <span className="text-sm text-black/50 dark:text-white/50">3 of 3</span>
          </div>

          <div className="mt-6 space-y-5">
            {EPISODES.map((ep, i) => (
              <motion.article
                key={ep.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-soft"
              >
                <div className="grid lg:grid-cols-[auto_1fr] gap-6">
                  <div
                    className="hidden lg:flex h-24 w-24 rounded-2xl items-center justify-center text-white text-2xl font-extrabold shadow-brand"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    {ep.n}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
                      <span className="lg:hidden">Episode {ep.n}</span>
                      <span className="hidden lg:inline">Episode {ep.n}</span>
                      <span>·</span>
                      <span>{ep.duration}</span>
                      <span>·</span>
                      <span>{ep.guest}</span>
                    </div>
                    <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-snug">{ep.title}</h3>
                    <p className="mt-2 text-black/60 dark:text-white/60 leading-relaxed">{ep.summary}</p>

                    <audio
                      controls
                      preload="none"
                      className="mt-5 w-full"
                      aria-label={`Play episode ${ep.n}: ${ep.title}`}
                    >
                      <source src={ep.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-[32px] p-10 sm:p-14 text-white" style={{ background: "var(--brand-gradient)" }}>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
            Never miss an episode.
          </h2>
          <p className="mt-4 text-white/80 max-w-xl">
            Subscribe on Substack for new episodes, show notes and exclusive growth playbooks in your inbox.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://sibisomarketing.substack.com" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Rss className="h-4 w-4" /> Subscribe on Substack
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
