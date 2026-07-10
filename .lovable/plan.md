## Phase 2 Build Plan — Sibiso Marketing

Large multi-part scope. I'll implement in this order, verifying build after each major group.

### 1. Deployment asset fix (foundation)
- Audit `src/routes/index.tsx`, `__root.tsx`, brand components for any preview-domain or `../` image refs.
- Move/create brand assets in `/public`: `logo-black.svg`, `logo-white.svg`, `favicon.svg`, `og-image.png` (generate via imagegen).
- Update root `head()` to root-relative `/favicon.svg` and `/og-image.png`. Delete stale `public/favicon.ico`.
- Rule going forward: images imported as ES modules or referenced as `/…` root-relative.

### 2. Dark mode
- Add `ThemeProvider` (`src/components/theme-provider.tsx`) — reads `localStorage("theme")`, falls back to `matchMedia("(prefers-color-scheme: dark)")`. Toggles `.dark` on `<html>`.
- Mount provider in `__root.tsx` `RootComponent`. Add pre-hydration inline `<script>` in `RootShell` to set the class before paint (no flash).
- Sun/moon toggle button in `SiteNav` (desktop + mobile).
- Audit each section in `index.tsx` and brand components for `dark:` variants (glass card gets dark tint, borders, text colors).

### 3. Conversion popup system
- `src/components/site/conversion-popup.tsx` — one modal, listens for whichever triggers first:
  - exit-intent (`mouseleave` top edge, desktop only)
  - 60% scroll depth
  - 30s timer
- Guards: sessionStorage flag `sibiso_lead_popup_shown`, skip if pathname starts with `/audit`.
- Glass card with gradient CTA, email input, POSTs to Formspree endpoint (reuse existing site endpoint — search index.tsx for it; if none, use placeholder const `FORMSPREE_ENDPOINT`).
- Dismiss: X / overlay / ESC. Focus trap + `aria-modal`.
- Mount in `__root.tsx` outside `/audit`.

### 4. Footer "Powered by Gravitas"
- Small link in existing footer of `index.tsx`, `target="_blank" rel="noreferrer noopener"`.

### 5. Six Productized Services carousel
- `src/components/site/services-carousel.tsx` — auto-rotating, ~3 visible on desktop, 1 on mobile, 5s interval, pause on hover/focus, respects `prefers-reduced-motion`, prev/next buttons + dot indicators.
- Card design: white bg, gradient border (rotating orange/red/magenta), numbered badge 01–06 top-right, circular outline icon top-left, title, tag pill, description, gradient underline.
- Data array with the 6 services from spec.
- Replace current Solutions section content.

### 6. AI Growth Audit at `/audit`
Files:
- `src/routes/audit.tsx` — full-screen layout (minimal top bar: logo, progress bar, exit ×).
- `src/routes/audit.report.tsx` — stub report page.
- `src/lib/audit/questions.ts` — typed `Question` union + universal questions + industry branches (E-commerce/Retail, Prof Services incl. Legal/Accounting, Healthcare, Real Estate, Tech/SaaS, Hospitality/Restaurants). Others get generic fallback with `// TODO: dedicated branch`.
- `src/lib/audit/context.tsx` — React context, answers state, localStorage autosave (`sibiso_audit_answers`).
- `src/components/audit/*` — QuestionCard, question type renderers (ShortText, SingleSelect, MultiSelect, NumberInput, RangeSlider, EmailInput), WelcomeStep, IndustryStep, CompletionStep (animated "Generating…" then navigate to `/audit/report`).
- Personalization: interpolate `{{firstName}}` / `{{businessName}}` in prompts.
- Motion-safe slide+fade transitions.
- Progress bar + "Step X of ~N" + estimated time remaining.

### 7. Newsroom
- Enable Lovable Cloud (Supabase). Migration creates:
  - `newsroom_articles` (uuid PK, title, summary, source_name, source_url, published_at, likes_count int default 0, created_at)
  - `newsroom_comments` (uuid PK, article_id fk, name, comment, created_at)
  - RLS: public SELECT on both, public INSERT on comments, public UPDATE on `likes_count` only via RPC `increment_article_like(article_id uuid)` (SECURITY DEFINER, updates only that column).
  - GRANTs to anon/authenticated per rules.
- Seed 5 realistic articles via insert tool.
- `src/routes/newsroom.$articleId.tsx` — article detail with like button (guarded by `localStorage("liked_" + id)`), comment form + comment list.
- `src/routes/index.tsx` Newsroom section — grid of latest 4 articles linking to detail route.
- Stub file `supabase/functions/fetch-newsroom-articles/index.ts` with commented description of Firecrawl + pg_cron plan (no logic).

### Verification
- Build/typecheck via harness after each major phase.
- Manual check via preview screenshot for dark mode + carousel + audit flow.

### Technical notes
- Formspree endpoint: I'll grep the codebase; if missing, add a `FORMSPREE_ENDPOINT` constant in `src/lib/config.ts` and reuse.
- All new routes need `head()` metadata (title/desc/og:title/desc); no `og:image` on layout routes.
- Every new route file follows `createFileRoute("/…")` conventions; let plugin regen `routeTree.gen.ts`.
- Audit route is `/audit` (top-level, public, no gate); popup skipped there.

This is ~20+ new files. I'll ship in the order above and keep commits self-consistent.
