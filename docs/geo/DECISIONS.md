# Decision log

These decisions are settled unless the user explicitly changes them.

## Ownership and collaboration

- Claude Code is the only AI that writes website source code for this initiative.
- Codex established the editorial strategy, evidence rules, content inventory, copy, and acceptance criteria.
- Future Claude sessions may maintain both implementation and handoff documents, but must keep factual claims grounded in the editorial sources.

## Repository safety

- Work happens on `claude/geo-authority-pages` in the isolated worktree.
- Never modify, merge into, or push `main` without explicit user approval.
- The current phase is additive-only relative to base commit `c2246d65e526bf821359b035251ca00ce50a6005`.
- Existing website files are read-only. New routes, components, content, media, and workspace documents are allowed.
- Minimal integration changes to the existing sitemap, navigation, or homepage require a separate explicit approval.

## Canonical publishing model

- `ramikronbi.com` is the canonical origin for every article and project page.
- Medium and DEV are distribution channels after the canonical page is live.
- Syndicated copies must link prominently to the canonical page and project evidence. Use platform canonical-import features when available.
- Do not host duplicate “canonical” copies on project subdomains. Use subdomains for interactive demos or standalone tools, not duplicate articles.

## Content states

- `ready`: indexable, visible in indexes, and eligible for syndication after final approval.
- `review`: rendered for local editorial work, always `noindex, nofollow`, absent from indexes and ready recommendations.
- `hold`: registry only; no route, source record, structured data, or media exposure.
- State changes require evidence and, for collaborator/safety-sensitive work, explicit user approval.

## Evidence and claims

- The canonical CV can establish Rami's reviewed role and metrics, but confidential details remain non-public.
- Public repositories establish documented architecture, features, limitations, tests, and reusable assets.
- Institutional sources are preferred for awards and competition placements.
- When sources conflict, publish the narrower claim or omit it.
- Performance numbers always name hardware, scale, or protocol when those affect interpretation.
- Do not convert team achievements into sole-author claims.

## Design

- New pages extend the incumbent dark, typographic, cinematic visual system.
- They do not redesign the homepage or create a second identity.
- Project pages are artifact-led; articles are readable editorial spreads; topic hubs connect evidence.
- Real media outranks generated decoration.
- Generated visuals must never look like documentary evidence of a prototype, result, partner, deployment, or user.
- Code-first was used for this session and was not stored as a permanent Impeccable workflow preference.

## Privacy and disclosure

- Employer-confidential, defense, landmine, private-repository, beneficiary-sensitive, or uncertain-partner material stays on hold.
- Medical and accessibility projects require stronger safety, consent, dataset-governance, and collaborator-credit review before promotion.
- Private repository visibility is not publication consent.

## Voice

- Write like an engineer explaining real constraints and decisions.
- Do not invent origin stories, quotations, users, deployments, customers, emotions, awards, or outcomes.
- Avoid generic AI prose, motivational openings, inflated superlatives, and keyword stuffing.
