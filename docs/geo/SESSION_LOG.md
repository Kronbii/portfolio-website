# Session log

## 2026-09-19 — Strategy and audit

- Confirmed the goal: improve Rami Kronbi's generative-engine visibility through canonical project and article pages, topic hubs, and later Medium/DEV syndication.
- Confirmed that Claude Code alone should write website source code; Codex would direct, research, edit, and review.
- Confirmed additive-only scope: no existing website changes without later explicit approval.
- Audited the live site and repository. The existing build passed; the existing global lint had a known vendored Draco decoder error unrelated to this initiative.
- Audited local repositories and separated owned public work from private, team, forked, external, and ambiguous repositories.
- Read the canonical `2026-general` research CV from Google Docs without editing it.
- Verified the 2023 WRO third-place result through Rafik Hariri University and easyPID through Arduino Library Manager.
- Selected 360° Spherical Panorama Stitching as the benchmark because it had the strongest combination of public code, demo, media, metrics, tests, and limitations.

## 2026-09-19 — Editorial system

- Created `PRODUCT.md`, `CLAUDE.md`, the editorial policy, full content registry, ready and review author copy, topic briefs, and route surface brief.
- Classified 11 public project/article pairs as ready, 8 articles and 5 projects as review, and confidential/private/ambiguous work as hold.
- Locked conservative factual corrections for the race-car and thermal projects.

## 2026-09-19 — Claude implementation

- Claude Code created the typed content layer, route families, shared components, structured data, media provenance, real-media assets, and code-native diagrams.
- Initial build generated 63 pages and kept the diff additive-only.

## 2026-09-19 — Acceptance corrections

- Live browser testing found that Next.js 16 dynamic params were asynchronous even though the production build succeeded. Claude updated all dynamic page and metadata functions.
- Dead topic labels were changed from broken links to plain labels.
- A new authority-route client bridge repairs the incumbent header's fragment-only links on subpages without editing the header source.
- Eyebrow labels, decorative project numbering, and Unicode arrow glyphs were removed from the new surfaces.
- Live 390 px testing found shared stage/source overflow. Claude corrected the responsive grid and wrapping rules and verified zero document-level overflow on the flagship ready project, OmniSign review project, and flagship article.

## 2026-09-19 — Durable handoff

- The user requested that Claude fully take over from a fresh session because of usage limits.
- Added this structured workspace, fresh-session continuation protocol, decision log, knowledge transfer, task board, current-state record, and GEO/publishing plan.
- Recorded deployment blockers, including the public provenance manifest's local-path disclosure, so a fresh session cannot mistake the local build for deployment-ready work.
- Prepared a 65-file additive-only Git checkpoint; no file from the base commit was modified.
- At the user's request, removed the auxiliary worktree and checked out `claude/geo-authority-pages` directly at `/home/kronbii/repos/portfolio-website`. The `main` branch itself remains unchanged.
- Added a private, Git-excluded digital-replica brief for Claude covering Rami's identity, interests, career direction, values, public positioning, known portfolio, and publication boundaries. The tracked continuation protocol reads it when present but forbids copying private material into public output without approval.
- Expanded the private context into a structured knowledge suite with Claude-led project discovery, career chronology, organization and role mapping, publication discovery, and voice extraction. Added public-safe entity facts and a publication registry, made Space² explicit, and inserted a comprehensive Phase 0.5 before editorial pruning.
- The next session should begin with the bounded Phase 0.5 repository and publication discovery protocols, then present proposed classifications before user pruning. It should not restart implementation discovery or redesign the existing system.

## 2026-09-20 — Phase 0.5 discovery (Claude, fresh session)

- Verified Git state: branch `claude/geo-authority-pages` at `ca38e9d`, clean tree, 67 additive files versus the base commit, `main` unchanged, `.claude-private/` excluded.
- Read the complete private suite and tracked workspace in the required order.
- Ran an automated Git census over every direct child of `/home/kronbii/repos` and six read-only inspection passes; listed all 70 GitHub repositories with visibility; inspected the Space² repository.
- Audited publications through the DEV API, Medium RSS, Hashnode RSS, Substack RSS, YouTube oEmbed, Arduino Library Manager, RHU news pages, GDG pages, Space Apps 2022 pages, and the indexed link inventory. ResearchGate, LinkedIn content, Instagram, and the Space Apps 2025 page were not readable.
- Wrote the private `PROJECT_CENSUS.md`; rewrote the private `CAREER_TIMELINE.md` and `ORGANIZATIONS_AND_ROLES.md`; updated the tracked `PUBLICATION_REGISTRY.md`, `ENTITY_FACTS.md`, `KNOWN_ISSUES.md`, `TASKS.md`, and `CURRENT_STATE.md`.
- Did not change `CONTENT_REGISTRY.md`, any typed content, any base-commit file, or any external account. No push, merge, deploy, or publication.
- Presented an 18-item decision list to Rami.

## 2026-09-20 — Decisions applied

- Rami answered the 18-item list: OmniSign team consents; NASNA co-founder from 2024; Space Apps lead technical organizer 2021–2024 with physical certificates; Oreyeon since August 2024 as embedded systems engineer; thermal figure left to Claude's judgment; BEMO team credit approved with photos kept; upstream PRs to be verified via GitHub; co-founder of Evoid, PadelEye, and Bsheel; blanket permission to discuss his own projects; talk assets available locally; hanta dashboard and prescription images approved.
- Verified via GitHub: Betaflight #15706 merged, #15705 open; OpenFront #4868 and #4985 merged; PX4 #28286 closed unmerged.
- Read a local April 2026 CV PDF copy (Drive still unauthenticated); new conflicts recorded: CV title "Applied AI & Computer Vision Engineer", WRO "National 2nd Place 2024", Physics & Astronomy Club society lead 2021–2024.
- Applied edits to `src/content/authority/projects.ts`, `articles.ts`, `AUTHOR_COPY_READY.md`, `CONTENT_REGISTRY.md`, `ENTITY_FACTS.md`, and `TASKS.md`. `npm run build` passed (63 pages); new-file ESLint clean; diff versus base commit remains additive-only. No commit, push, deploy, or external change.

## 2026-09-20 — First discovery-driven drafts

- Added two code-native diagrams and three review records: upstream open-source contributions (project and article, facts from the GitHub pull requests), talks and teaching (article), and an expanded NASNA article drawn from the public README. All `review`, noindex, absent from indexes.
- Third-party diagram files found in the local DevFest folder were not copied; the talks record uses a code-native diagram.
- Build: 66 static pages; new-file ESLint clean; diff versus base commit additive-only.

## 2026-09-20 — Remaining discovery drafts

- Added six diagrams and seven project/article pairs (Hantawatch, Basira, Imagen, Lumiscan, Evoid, water-shooting robot) plus the OmniSign figure disclosure and an image-led BEMO record with two rasters copied from the public desk repository and recorded in the provenance manifest.
- Build: 78 static pages; new-file ESLint clean; diff versus base commit additive-only; all new routes noindex and excluded from indexes. The Zalando Sans font-override warning during build is pre-existing and unrelated.
- Consolidated question list handed to Rami; no commit, push, deploy, or external change.

## 2026-09-20 — Promotions after Rami's answers

- Answers: WRO re-ranked to second after another team's disqualification (no source; kept third place publicly with disclosure); title "Embedded Systems Engineer"; OmniSign dataset collected by the team; Space Apps cited to the CV per instruction; NASNA 2024–2025; Physics Day and INJAZ documents to follow; DevFest title confirmed; CodewithSerah date decoded from the LinkedIn activity id (post 2026-01-26), LAU workshop April 2026; Evoid clients may be described and placeholder testimonials should be removed; Imagen throughput figure approved; Basira public without model names; BEMO is an FYP; prescription images consented; hygiene sweep requested.
- Promoted twelve records to `ready`; four remain `review`. Topic hub review mentions updated. Build 78 pages; lint clean; additive-only diff preserved.
- Tracked-file sweep across all repositories: no tracked `.env` files in any repository; committed videos in 360-spherical-stitching (1), thermal-super-resolution (2), PID-light-tracker (1), smart-interactive-desk (3), portfolio-website (21 stock clips); `users.json` tracked twice in smart-interactive-desk; `testing/SEED-CREDENTIALS.md` tracked in hr-app. Everything else flagged by name was ordinary password-UI code or vendor test keys.

## 2026-09-20 — Integration applied

- Rami approved the two-file integration diff; applied and committed as b12c32b. Sitemap now generated from the typed content (56 URLs, no review slugs); header gains Projects and Writing.
- Provenance manifest moved under docs; review routes gated out of production (commit 4cfe4bc). Production build 71 pages, no workstation paths in output.
- Physics Day search of the RHU newsroom: 2019 and 2025 articles only, neither naming Rami; article stays review.
- Preview deployment attempt (`vercel --yes` from the repository root, linked to project kronbiis-projects/ramikronbi) was denied by the session permission classifier as a deploy action. Rami can run it directly or allow it.
