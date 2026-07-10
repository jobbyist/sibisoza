import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/brand/section";

type Article = {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  published_at: string;
  likes_count: number;
};

export function NewsroomGrid() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("newsroom_articles")
        .select("id,title,summary,source_name,published_at,likes_count")
        .order("published_at", { ascending: false })
        .limit(4);
      setArticles((data as Article[]) ?? []);
    })();
  }, []);

  return (
    <Section
      id="newsroom"
      eyebrow="Newsroom"
      title={<>What's moving in <span className="text-brand-gradient">growth right now.</span></>}
      description="Curated marketing, brand and growth intelligence — refreshed regularly."
    >
      {articles.length === 0 ? (
        <div className="text-center text-sm text-black/40 dark:text-white/40">Loading latest stories…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {articles.map((a) => (
            <Link
              key={a.id}
              to="/newsroom/$articleId"
              params={{ articleId: a.id }}
              className="group rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-7 shadow-soft hover:shadow-brand transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
                <span>{a.source_name}</span>
                <span>{new Date(a.published_at).toLocaleDateString()}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-black dark:text-white leading-snug group-hover:text-brand-gradient transition-colors">
                {a.title}
              </h3>
              <p className="mt-3 text-sm text-black/60 dark:text-white/60 leading-relaxed line-clamp-3">
                {a.summary}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                  <Heart className="h-3.5 w-3.5" /> {a.likes_count}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gradient">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
