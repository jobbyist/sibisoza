import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ExternalLink, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site/nav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/newsroom/$articleId")({
  head: ({ params }) => ({
    meta: [
      { title: "Newsroom — Sibiso Marketing" },
      { property: "og:title", content: "Sibiso Newsroom" },
      { property: "og:url", content: `https://sibisoza.lovable.app/newsroom/${params.articleId}` },
    ],
    links: [{ rel: "canonical", href: `https://sibisoza.lovable.app/newsroom/${params.articleId}` }],
  }),
  component: ArticleDetail,
});

type Article = {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
  likes_count: number;
};

type Comment = { id: string; name: string; comment: string; created_at: string };

function ArticleDetail() {
  const { articleId } = Route.useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLiked(window.localStorage.getItem(`liked_${articleId}`) === "1");
    void loadAll();
    async function loadAll() {
      setLoading(true);
      const { data: a } = await supabase
        .from("newsroom_articles")
        .select("*")
        .eq("id", articleId)
        .maybeSingle();
      setArticle(a as Article | null);
      const { data: c } = await supabase
        .from("newsroom_comments")
        .select("id,name,comment,created_at")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });
      setComments((c as Comment[]) ?? []);
      setLoading(false);
    }
  }, [articleId]);

  const onLike = async () => {
    if (!article || liked || liking) return;
    setLiking(true);
    const prevCount = article.likes_count;
    // Optimistic
    setArticle({ ...article, likes_count: prevCount + 1 });
    setLiked(true);
    window.localStorage.setItem(`liked_${articleId}`, "1");
    const { data, error } = await supabase.rpc("increment_article_like", {
      _article_id: articleId,
    });
    if (error) {
      // rollback
      setArticle({ ...article, likes_count: prevCount });
      setLiked(false);
      window.localStorage.removeItem(`liked_${articleId}`);
      toast.error("Couldn't save your like", {
        description: "Please check your connection and try again.",
      });
    } else if (typeof data === "number") {
      setArticle((a) => (a ? { ...a, likes_count: data } : a));
    }
    setLiking(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || posting) return;
    setPosting(true);
    const { data, error } = await supabase
      .from("newsroom_comments")
      .insert({ article_id: articleId, name: name.trim(), comment: text.trim() })
      .select("id,name,comment,created_at")
      .single();
    if (!error && data) {
      setComments((prev) => [data as Comment, ...prev]);
      setText("");
      toast.success("Comment posted");
    } else {
      toast.error("Couldn't post your comment", {
        description: error?.message?.includes("length")
          ? "Please keep your name under 80 characters and comment under 2000."
          : "Something went wrong. Please try again in a moment.",
      });
    }
    setPosting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-gradient" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <SiteNav />
        <main className="container-page pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 underline text-brand-gradient"
          >
            Back to home
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <SiteNav />
      <main className="container-page pt-28 pb-20 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/50">
          {article.source_name} · {new Date(article.published_at).toLocaleDateString()}
        </div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold leading-[1.05]">{article.title}</h1>

        <p className="mt-6 text-lg text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-line">
          {article.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            disabled={liked || liking}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 h-10 text-sm font-semibold transition-colors",
              liked
                ? "bg-brand-gradient text-white border-transparent shadow-brand"
                : "border-black/15 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
            )}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            {liked ? "Liked" : "Like"} · {article.likes_count}
          </button>
          <a
            href={article.source_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 h-10 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            Read original at {article.source_name} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Comments */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Discussion ({comments.length})
          </h2>

          <form onSubmit={onSubmit} className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-white/[.02]">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              required
              className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white px-5 h-11 outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your take…"
              maxLength={2000}
              required
              rows={3}
              className="mt-3 w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white px-5 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="mt-3 flex justify-end">
              <Button type="submit" variant="gradient" disabled={posting}>
                {posting ? "Posting…" : "Post comment"}
              </Button>
            </div>
          </form>

          <ul className="mt-8 space-y-5">
            {comments.map((c) => (
              <li key={c.id} className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-white/[.02]">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-black/40 dark:text-white/40">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>
                <p className="mt-2 text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-line">
                  {c.comment}
                </p>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="text-sm text-black/50 dark:text-white/50">Be the first to comment.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
