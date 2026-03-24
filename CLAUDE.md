# AGENTS.md

This document is the working contract for future chats and agents touching this repo.
Treat it as the default project brief unless the user explicitly overrides something.

## Project Goal

Build a high-quality personal portfolio for Rami Kronbi on top of a clean, scalable Next.js codebase.

The project has already been reset once. Do not drift back into the old “many random sections and helpers” structure.

Current product direction:
- Start with a strong `home` experience first.
- Add other domains one by one only when explicitly requested.
- Future project detail pages should live under `/projects/[slug]`, but they are not the current focus unless the user asks for them.

## Current Architecture

The active app uses:
- Next.js App Router
- `src/` source layout
- Tailwind CSS + CSS variables
- strict TypeScript
- shadcn-style local UI primitives
- content-driven homepage sections
- GSAP for motion
- Lenis for cinematic scrolling

Important folders:
- `src/app` for routes, layout, metadata routes, and API routes
- `src/components/ui` for local UI primitives and wrapped vendor components
- `src/components/blocks` for reusable composed building blocks
- `src/components/sections` for page sections
- `src/content` for typed site content
- `src/lib` for utilities, site config, motion presets, and shared logic
- `src/styles` for global tokenized styling
- `public/images/*` and `public/icons/*` for organized assets

Do not reintroduce root-level `app/`, `components/`, `data/`, `hooks/`, or `lib/` source trees.

## Non-Negotiable Engineering Rules

1. Keep the import boundaries strict.
- Route files may import sections, content helpers, and shared non-UI logic.
- `sections` may import `blocks`, `ui`, content, and local utilities.
- `blocks` may import `ui`.
- Only `src/components/ui` should import third-party UI primitives directly.

2. Keep content out of JSX when possible.
- Homepage copy, labels, metrics, nav items, and structured section content should live in `src/content`.
- Layout and visual composition stay in components.

3. Do not add raw design values casually.
- Use the token system in `src/styles/globals.css` and `tailwind.config.ts`.
- If a new repeated color, radius, shadow, or motion value appears, promote it to a token.

4. Do not add new domains unless requested.
- The reset intentionally narrowed scope.
- Blog, FAQ, testimonials, certifications, and community sections are not first-class product domains right now.

5. Do not import random vendor components directly into sections or pages.
- If a library is adopted, wrap it locally under `src/components/ui` first.
- If the user provides a specific third-party component and its code, preserve that implementation closely instead of prematurely abstracting it away.

6. Do not weaken TypeScript to move faster.
- Avoid `any`.
- Keep content models typed.
- Keep route and component contracts explicit.

7. Motion stack default:
- Prefer GSAP for motion and sequencing.
- Prefer Lenis for cinematic scrolling behavior.
- Do not default to Framer Motion for new work unless the user explicitly asks for it.
- Keep motion orchestration centralized rather than scattering one-off effects through sections.

## Design Direction

The intended UI direction is:
- visually strong, not generic SaaS
- creative-first, not corporate
- dark-first and highly controlled
- bold, minimal, and typographic
- one strong theme, not dark/light theme complexity
- shadcn-compatible, but not visually “default shadcn”
- refined cinematic motion, not noisy motion
- polished typography, spacing, hierarchy, and transitions

Design guidance:
- Avoid default-looking layouts and safe filler designs.
- Prefer a clear art direction per page or section.
- Motion should be built with GSAP timelines and reusable local patterns, not scattered one-off effects.
- Cinematic scrolling should use Lenis when scroll treatment is part of the experience.
- The site should feel authored and premium, not template-generated.

### Design Defaults

Unless the user explicitly overrides them, future agents should assume:
- Primary/base color: `#0c0c0c`
- Secondary/accent color: `#9d201a`
- When primary or secondary colors are needed in code, use global CSS variables/tokens rather than hardcoded hex literals in components.
- Use only those two colors plus neutral values derived from them when absolutely necessary.
- Do not use the secondary color as a large page background.
- Use the secondary color for emphasis, active states, accents, interactive components, and controlled highlights.
- Default typography should center on `Zalando Sans` from Google Fonts.
- Typography is a major part of the brand language: large titles, bold hierarchy, minimal supporting copy.
- The less text with more impact, the better.
- Headline and section-title quality matters more than decorative effects.
- Imagery should be a major visual anchor when used.
- Layouts should feel airy and intentional, not crowded.
- UI geometry should be mixed but lean sharp, with only slight roundness where it improves polish.
- Future chats should infer missing decisions from this file, the existing repo, and any references the user provides.
- When motion is needed, default to GSAP + Lenis before considering other animation libraries.

### Homepage Defaults

Unless the user says otherwise, the default homepage structure is:
`hero -> about/value -> selected work -> community -> contact`

Homepage priorities:
- Lead with name and statement.
- Keep the hero high-impact and low-clutter.
- Keep section copy short.
- Use bigger, bolder titles for each section.
- Favor distinctive identity over safe clarity when both are acceptable.

### Reference Handling

If the user provides a reference:
- Follow the reference closely.
- Match its composition, tone, hierarchy, and feel before improvising.
- Adapt the reference into this brand system only where necessary.

If the user provides component code from a library or external source:
- Implement it as closely as possible to the provided code.
- Install the required packages and dependencies needed for it to work.
- Keep the structure, behavior, and visual treatment intact unless the user explicitly asks for changes.
- Only make the minimum compatibility edits needed for this repo, TypeScript, Next.js, GSAP/Lenis usage, or styling-token integration.
- Apply only the requested edits; do not redesign or reinterpret the component unless asked.
- If adapting is necessary, preserve the original feel and behavior first, then make repo-specific adjustments second.

### Banned Defaults

Treat these as banned unless the user explicitly asks for them:
- generic centered hero layouts
- generic SaaS page structures
- small weak subtitles
- boring repeated card grids
- overly corporate icon sections
- too many rounded corners
- spacing that feels too loose or too cramped
- heavy blur
- heavy gradients
- extra colors outside the primary/secondary system
- soft, hazy, embellished UI that weakens the typography

## Current Product State

These are already in place:
- `src/app/layout.tsx` is the app shell
- `src/app/page.tsx` composes the homepage from section components
- `src/content/home.ts` contains homepage content
- `src/content/projects.ts` contains typed project summaries for future detail pages
- `src/app/api/contact/route.ts` preserves the contact backend
- `src/app/robots.ts` and `src/app/sitemap.ts` are the canonical metadata routes

These are intentionally deferred:
- full project detail page implementation
- final contact form UI/UX
- additional site domains beyond `home`

## Workflow Expectations For Future Chats

When asked to build something:
- inspect existing `src/` code first
- preserve the current architecture
- implement the request directly unless the user is clearly asking to discuss first
- prefer editing existing section/content layers over inventing parallel structures

When asked to add a new component:
- decide whether it belongs in `ui`, `blocks`, or `sections`
- if it uses an external UI library, wrap it in `src/components/ui`
- if it introduces reusable content, add it to `src/content`
- if the user provides exact component code, implement it faithfully first and only then layer the requested edits on top
- install any required packages for the provided component instead of replacing it with a different local approximation
- do not swap in a “similar” component when the user asked for a specific one from React Bits, Lightswind, shadcn, or another library

When asked to redesign the homepage:
- update `src/content/home.ts`
- update the relevant components in `src/components/sections`
- keep `src/app/page.tsx` as a clean composition layer
- if motion/scrolling is involved, use GSAP and Lenis as the default stack

When asked to add project pages:
- use `src/content/projects.ts`
- keep the route under `src/app/projects/[slug]`
- prefer a shared case-study template over custom ad hoc pages

## Quality Bar

Before considering work complete:
- run `npm run build`
- run `npm run lint`
- keep vendor imports out of route files and sections
- keep the diff focused; do not introduce unrelated churn
- keep motion implementations coherent and centralized instead of mixing animation paradigms

## Immediate Priority

The next meaningful product work is:
1. Design and implement the real homepage experience.
2. Replace placeholder homepage content and section styling with the actual visual direction.
3. After home is solid, implement the first real `/projects/[slug]` page.

## Notes For Future Agents

- If the IDE shows deleted files from the old architecture, ignore them. The active codebase is under `src/`.
- If the user references old components, map the intent into the new structure rather than reviving the old tree.
- If a future chat wants a library component from shadcn or elsewhere, keep the wrapper rule intact.
- For motion and scrolling, GSAP + Lenis is the intended default stack.
- If the user gives a component name plus its code from an external library, the expected behavior is: install what it needs, implement it exactly, and only modify what the user explicitly requested.
