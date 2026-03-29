# SEO Handoff For Claude (Based On This Site + Previous Release)

This document captures the SEO implementation patterns already used in:

- Current version: `src/`
- Previous release: `tmp/portfolio-website/`

Use this as a direct handoff prompt/checklist for your friend to give to Claude.

## 1) Copy-Paste Prompt For Claude

```md
You are a senior SEO-focused web engineer. Implement production-grade SEO in my website by replicating this blueprint (in spirit, not branding copy).

Goal:
- Match the technical SEO level of a Next.js portfolio that already implements strong metadata, structured data, robots/sitemap, social cards, and semantic content patterns.
- Make concrete code changes, not just recommendations.

Required outputs:
1. Implement all relevant SEO changes in code.
2. Show a file-by-file diff summary.
3. Provide a validation checklist with pass/fail status.
4. Flag any items you could not implement.

Implementation requirements:

1) Canonical metadata foundation (App Router style if using Next.js)
- Add `metadataBase`, title template, description, canonical URL.
- Add Open Graph (`type`, `url`, `siteName`, `title`, `description`, 1200x630 image).
- Add Twitter card (`summary_large_image`, title, description, image, creator if available).
- Add icons/favicons and `manifest`.
- Add site verification token support (Google Search Console).
- Include `authors`, `creator`, `publisher`, and `keywords` where appropriate.
- Set robots meta directives (`index`, `follow`) and Googlebot preview limits.

2) Robots + sitemap
- Implement `/robots.txt` and `/sitemap.xml` generation (metadata routes or equivalent).
- Disallow private/system endpoints (ex: `/api/`).
- Include absolute sitemap URL in robots.
- Add sensible `changeFrequency`, `priority`, and `lastModified`.
- If the project already uses `next-sitemap`, keep it and wire postbuild generation correctly; otherwise use framework-native metadata routes.

3) Structured data (JSON-LD)
- Inject JSON-LD scripts for:
  - `WebSite`
  - `Person`
  - `Organization`
  - `ProfilePage` (if site is personal profile style)
  - `BreadcrumbList`
  - `FAQPage` (only when FAQ content exists and is visible on page)
- Use stable `@id` links between entities.
- Include `sameAs` social profiles.
- Keep schema data aligned with visible page content.

4) Semantic content and crawlability
- Ensure one clear `<h1>` and proper heading hierarchy.
- Ensure descriptive image `alt` text on meaningful visuals.
- Ensure internal anchor links/navigation to key sections/pages.
- Keep important content server-rendered and visible (no hidden keyword stuffing).

5) Performance-supportive SEO details
- Use optimized image formats (`avif`/`webp`) and responsive sizes.
- Keep font loading efficient (`display: swap`).
- Preserve mobile viewport correctness.

6) Quality gates
- Run build + lint.
- Verify robots/sitemap endpoints.
- Validate schema syntax.
- Report exact URLs/endpoints checked.

Constraints:
- Do not copy someone else’s personal identity, brand copy, or social links.
- Replace all personal fields with mine.
- Avoid spammy tactics (hidden text, keyword stuffing, fake FAQ markup).
```

## 2) SEO Tricks Inventory (What Is Already Implemented)

### A) Metadata and social cards

- [Current] Root metadata with `metadataBase`, title template, description, canonical, Open Graph, Twitter card, icons, manifest, Google verification.
  - `src/app/layout.tsx`
- [Previous] Additional metadata depth: `keywords`, `authors`, `creator`, `publisher`, `robots` + `googleBot` preview controls, OG locale.
  - `tmp/portfolio-website/app/layout.tsx`

### B) Robots and sitemap

- [Current] Metadata routes for robots + sitemap; includes disallow `/api/`.
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
- [Previous] Metadata routes + `next-sitemap` automation (`postbuild`) + static generated files.
  - `tmp/portfolio-website/app/robots.ts`
  - `tmp/portfolio-website/app/sitemap.ts`
  - `tmp/portfolio-website/next-sitemap.config.js`
  - `tmp/portfolio-website/public/robots.txt`
  - `tmp/portfolio-website/public/sitemap.xml`

### C) Structured data coverage

- [Current] `WebSite`, `Person`, `Organization` with linked `@id`.
  - `src/components/structured-data.tsx`
- [Previous] Broader schema set: `Person`, `ProfilePage`, `Organization`, `BreadcrumbList`, `FAQPage`, plus additional inline schema in layout `<head>`.
  - `tmp/portfolio-website/components/StructuredData.tsx`
  - `tmp/portfolio-website/app/layout.tsx`

### D) Content semantics and accessibility signals

- [Current] Clear semantic sections and heading usage (`h1` hero, `h2/h3` sections/cards), descriptive image alts, explicit nav/CTA `aria-label`s.
  - `src/components/sections/home-hero.tsx`
  - `src/components/blocks/section-heading.tsx`
  - `src/components/sections/home-projects.tsx`
  - `src/components/blocks/project-card.tsx`
- [Previous] Dedicated FAQ section content aligned with FAQ schema.
  - `tmp/portfolio-website/components/FAQ.tsx`
  - `tmp/portfolio-website/data/faq.json`

### E) Performance details that support SEO

- [Both] Next image optimization config for modern formats and responsive sizing.
  - `next.config.js`
  - `tmp/portfolio-website/next.config.js`
- [Both] Font loading with `display: swap`.
  - `src/app/layout.tsx`
  - `tmp/portfolio-website/app/layout.tsx`
- [Current] Footer links to `sitemap.xml` and `robots.txt` (crawl discoverability).
  - `src/components/sections/site-footer.tsx`

## 3) Recommended “Best Of Both” Target

Ask Claude to keep current architecture but merge back the strongest previous-release SEO pieces:

1. Keep current clean `siteConfig`-driven metadata pattern.
2. Re-add rich metadata fields from previous release:
   - `keywords`
   - `authors`, `creator`, `publisher`
   - `robots` + `googleBot` preview controls
   - OG locale
   - Twitter creator handle
3. Keep metadata routes for robots/sitemap (or use `next-sitemap`, but avoid duplicate/conflicting pipelines).
4. Expand current JSON-LD to include `ProfilePage`, `BreadcrumbList`, and `FAQPage` if FAQ section exists and is visible.
5. Ensure FAQ schema entries exactly match visible FAQ content.
6. Keep strict semantic heading hierarchy and descriptive image alts.
7. Keep image/font performance settings.

## 4) Fields Your Friend Must Replace (No Blind Copy)

- Site/brand name
- Site URL/domain
- Description and keywords
- Email
- Social links (`GitHub`, `LinkedIn`, `X/Twitter`, etc.)
- Organization/company names
- Awards/credentials
- FAQ content
- Search Console verification token
- OG image and profile image paths

## 5) Acceptance Checklist

- [ ] Build passes
- [ ] Lint passes
- [ ] `/robots.txt` returns expected rules + sitemap URL
- [ ] `/sitemap.xml` returns canonical URLs
- [ ] Canonical tag is correct and absolute
- [ ] OG/Twitter tags render correctly
- [ ] JSON-LD has valid syntax and matches visible content
- [ ] No hidden SEO text or keyword stuffing
- [ ] Mobile viewport and page performance are not regressed

