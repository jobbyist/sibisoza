GRANT SELECT ON public.newsroom_articles TO anon, authenticated;
GRANT ALL ON public.newsroom_articles TO service_role;
GRANT SELECT, INSERT ON public.newsroom_comments TO anon, authenticated;
GRANT ALL ON public.newsroom_comments TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_article_like(uuid) TO anon, authenticated;