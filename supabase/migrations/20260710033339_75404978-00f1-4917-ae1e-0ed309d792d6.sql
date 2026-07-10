
CREATE TABLE public.newsroom_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.newsroom_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.newsroom_articles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_newsroom_comments_article ON public.newsroom_comments(article_id, created_at DESC);
CREATE INDEX idx_newsroom_articles_published ON public.newsroom_articles(published_at DESC);

GRANT SELECT ON public.newsroom_articles TO anon, authenticated;
GRANT ALL ON public.newsroom_articles TO service_role;

GRANT SELECT, INSERT ON public.newsroom_comments TO anon, authenticated;
GRANT ALL ON public.newsroom_comments TO service_role;

ALTER TABLE public.newsroom_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsroom_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read articles" ON public.newsroom_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON public.newsroom_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can add comments" ON public.newsroom_comments FOR INSERT WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 80
  AND length(trim(comment)) BETWEEN 1 AND 2000
);

-- Safe like counter (only increments likes_count; no other columns writable via API)
CREATE OR REPLACE FUNCTION public.increment_article_like(_article_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.newsroom_articles
  SET likes_count = likes_count + 1
  WHERE id = _article_id
  RETURNING likes_count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_article_like(UUID) TO anon, authenticated;
