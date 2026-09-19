# Task board

Work from top to bottom. Do not skip a user-owned gate.

## Phase 0 — Handoff and checkpoint

- [x] Create an isolated feature branch; after the initial implementation, check it out directly in the portfolio repository root for Claude handoff.
- [x] Capture product truth, editorial policy, content registry, author copy, topic hubs, and surface brief.
- [x] Implement the additive authority-page system with Claude Code.
- [x] Fix Next.js 16 asynchronous route params.
- [x] Fix dead topic links and subpage header anchors.
- [x] Remove banned eyebrow, numbering, and glyph patterns.
- [x] Fix 390 px horizontal overflow in stage and evidence components.
- [x] Create a durable fresh-Claude-session handoff.
- [x] Create a Git checkpoint commit containing the current implementation and handoff documents.

## Phase 0.5 — Claude-led comprehensive discovery

This is the immediate next phase. Claude performs the research; Rami answers only unresolved ownership, consent, or classification questions after the evidence pass.

- [x] Read the complete private knowledge suite from `.claude-private/README.md`. (2026-09-20)
- [x] Follow `.claude-private/PROJECT_DISCOVERY_PROTOCOL.md` and inspect every direct child under `/home/kronbii/repos` plus the current Space² sources under `/home/kronbii/space2`. (2026-09-20; 66 entries, 59 Git repositories, plus 42 GitHub-only repositories)
- [x] Create the private `.claude-private/PROJECT_CENSUS.md` with one evidence-backed classification for every accessible directory, duplicate/lineage mappings, counts, open questions, and newly discovered GEO candidates. (2026-09-20)
- [x] Reconcile `smart-interactive-desk` with the narrower posture-aware record and identify other renamed, split, duplicated, or superseded projects. (2026-09-20: BEMO, five-person graduation team, demo video; lineage map in the census)
- [x] Follow `.claude-private/PUBLICATIONS_AND_VOICE.md` and audit all accessible Medium, DEV, Hashnode, ResearchGate, GitHub, LinkedIn, YouTube, and event-page publications or talks. (2026-09-20; ResearchGate, LinkedIn content, and Instagram blocked automated access; Substack copy discovered)
- [x] Update `PUBLICATION_REGISTRY.md` with live URLs, dates, canonical relationships, conflicts, and recommended actions. Discovery is read-only; do not modify external accounts. (2026-09-20)
- [x] Validate the public identity facts in `ENTITY_FACTS.md` against current first-party and institutional sources. (2026-09-20; the live CV was unreachable because the Google Drive connector is unauthenticated, so CV-only facts keep their `reviewed` label)
- [x] Update the private career timeline and organization map with verified dates, roles, collaborators, and disclosure boundaries. (2026-09-20)
- [x] Present Rami with a concise decision list covering only unresolved ownership, collaborator, consent, privacy, and publication questions. (2026-09-20; list recorded below; awaiting answers)
- [x] Propose additions, removals, merges, and state changes to `CONTENT_REGISTRY.md`; apply them only after Rami approves. (2026-09-20: approved and applied — thermal figure narrowed, easyPID 1.1.0, Daleel credit, OmniSign/BEMO/NASNA/Space Apps records updated, discovery additions section added.)
- [x] Draft upstream contributions (project + article), talks and teaching (article), and the NASNA article expansion. (2026-09-20; all `review`.)
- [x] Draft the remaining approved records: OmniSign figure disclosure, BEMO image-led record, hanta dashboard, Basira, Evoid, imagen, lumiscan, water-shooting robot. (2026-09-20; all `review`.)
- [x] Rami answered the consolidated question list (2026-09-20); twelve records promoted to `ready`, four remain `review`.
- [ ] Collect from Rami: Physics Day and INJAZ documents; Space Apps organizer photos or certificates; DevFest slide exports; the WRO re-ranking source if one exists.
- [ ] Public-repository hygiene follow-ups for Rami (outside this repo): remove `users.json` from smart-interactive-desk; review committed videos in 360-spherical-stitching and thermal-super-resolution; hr-app seed-credentials file; evoid.dev placeholder testimonials.
- [ ] Voice extraction from the three live articles; interview questions for the flagship articles.
- [ ] Ask Rami to digitize the 2021–2024 Space Apps organizer certificates into `public/images/authority/` as evidence before the mentoring article is promoted.
- [ ] Reconcile the OmniSign figure sets (CV vs team page) with Rami before promotion.
- [ ] Resolve the CV's "WRO National 2nd Place 2024" line against RHU's 2023 third-place record before any awards list.
- [ ] Voice extraction: build the private voice sample bank from the three live articles and ask the flagship interview questions (deferred until Rami answers the decision list).

## Phase 1 — User pruning and editorial approval

Begin only after Phase 0.5 produces the complete census and proposal.

- [ ] Start the local preview and give the user a simple review path for `/projects`, `/writing`, and `/topics`.
- [ ] Let the user mark each of the 11 ready project/article pairs as keep, revise, demote to review, or remove.
- [ ] Let the user inspect the 8 review articles and 5 review projects privately.
- [ ] Record every decision directly in `CONTENT_REGISTRY.md` and the typed content state.
- [ ] Confirm naming, collaborator credits, dates, ownership, and media rights for every page the user keeps.
- [ ] Review the ready prose for voice: remove any line that feels generic, inflated, impersonal, or unlike Rami.
- [ ] Resolve the public provenance-file path disclosure described in `KNOWN_ISSUES.md` using Claude-authored implementation changes.
- [ ] Re-run build, new-file lint, route checks, responsive checks, and structured-data checks after pruning.

Do not integrate or deploy before the user completes this phase.

## Phase 2 — Evidence completion for review items

- [ ] OmniSign: confirm team roles, collaborator credits, dataset governance/consent, pilots, evaluation protocol, and award language.
- [ ] Posture-aware desk: confirm final name, public repository, team, role, tests, and outcomes.
- [ ] Runway-inspection UAV: confirm repository, model/input size, dataset rights, evaluation definition, authorship, and employer boundary.
- [ ] FPV drone: identify media, bill of materials, calculations, logs, dates, and safe GNSS-jamming framing.
- [ ] Emotion-recognition prototype: confirm team, licenses, class definitions, evaluation, acquisition wording, clinical framing, and intended users.
- [ ] NASA mentoring: attach official event years, team pages, organizer credits, and placement sources.
- [ ] NASNA: obtain collaborator approval and resolve beneficiary privacy, scale, timeline, and disclosure boundaries.
- [ ] Physics outreach: confirm dates, institutions, collaborators, scale, public references, and reusable media.

Promote a record only after its checklist is resolved and the user approves the public version.

## Phase 3 — Existing-site integration gate

User-owned approval required before this phase.

- [ ] Present the smallest integration diff: add ready routes to `src/app/sitemap.ts` and add one discoverable entry point from the existing site.
- [ ] Ask the user to approve the exact existing files that may change.
- [ ] After approval, update only those files.
- [ ] Decide whether homepage project summaries with inaccurate or `[VERIFY]` claims should be corrected in the same approved change.
- [ ] Verify that no review or hold route enters the sitemap or public navigation.

## Phase 4 — Final visual and technical review

- [ ] Review one image-led project, one diagram-led project, one article, one topic hub, one review page, and both indexes at desktop and mobile sizes.
- [ ] Run keyboard and visible-focus checks.
- [ ] Validate heading order, alt text, link purpose, reduced motion, contrast, and text measure.
- [ ] Validate canonical URLs, robots metadata, Open Graph images, and every JSON-LD payload.
- [ ] Confirm there are no broken internal links or orphaned ready pages.
- [ ] Run the Impeccable detector once on the final changed targets and resolve mechanical findings.
- [ ] Update the implementation report with the final verdict.

## Phase 5 — Preview, merge, and deployment

Each external state change requires the user's authorization.

- [ ] Commit any post-pruning changes on the feature branch.
- [ ] Create a preview deployment if the user asks.
- [ ] Obtain final approval against the preview.
- [ ] Push the feature branch only if authorized.
- [ ] Merge into `main` only if explicitly authorized.
- [ ] Deploy production only if explicitly authorized.
- [ ] Verify the live routes, metadata, media, JSON-LD, robots behavior, sitemap, redirects, performance, and mobile layout.

## Phase 6 — Syndication

- [ ] Select the first 3–5 strongest articles. Recommended starting set: 360° stitching, easyPID, autonomous race car, thermal super-resolution, and one public-interest system after review.
- [ ] Publish the canonical website page first.
- [ ] Prepare Medium and DEV variants without changing facts or adding invented first-person narrative.
- [ ] Use canonical import/link support where available.
- [ ] Link to the project page, repository/demo, Rami's website, and relevant topic hub.
- [ ] Record publication URL and date in a new syndication registry.
- [ ] Do not mass-publish all articles on the same day.

## Phase 7 — Discovery and maintenance

- [ ] Submit the updated sitemap through Google Search Console and Bing Webmaster Tools after deployment.
- [ ] Request indexing for the main indexes, topic hubs, and the first priority pages.
- [ ] Confirm canonical selection and structured-data parsing after crawlers revisit.
- [ ] Track search impressions, referring domains, branded queries, project-name queries, and AI-answer citations.
- [ ] Review stale facts, broken links, and publication states quarterly.
- [ ] Add each future project through the same evidence → draft → review → ready workflow.

## User-owned decisions currently open

Decision list presented 2026-09-20 after the Phase 0.5 evidence pass. Rami answered the same day; answers are recorded in `CONTENT_REGISTRY.md`, `ENTITY_FACTS.md`, and the private suite. Items 1–12 below are resolved; remaining follow-ups are listed after them.

1. OmniSign: what exactly did you build, and does the team (Layth Ayache, Nour El Hariri, Tayseer Laz, Abou Baker Al Khatib, supervisor Dr. Oussama Mustapha) agree to public attribution of that contribution? The live team page no longer names you.
2. NASNA: correct the role and dates. The public README says "AI Engineer & Developer" and the repository starts October 2024; the CV says co-founder/operations lead 2021–2024. Do Mohamad Homsi, Abed El-Fattah Amouneh, and Lynn El Solh approve a website article?
3. NASA Space Apps: public sources support a 2022 student-volunteer and participant role only. Which years were you on the organizing team, under what title, and is there an official page or organizer listing per year?
4. National Physics Day and INJAZ MENA: is there any public source? If not, both stay withheld.
5. Oreyeon: is your current title "Computer Vision Engineer" or "Embedded Systems & Vision Engineer", and what is the start month?
6. Thermal super-resolution: does a Jetson AGX Orin benchmark exist (the repository holds only a 229.6 FPS report on an unnamed GPU, the article says 20–30 FPS on Jetson Orin, the CV says ~45 FPS)? If not, should the page drop the edge figure?
7. Daleel: approve crediting Layth Ayache on the ready page.
8. BEMO smart desk: approve the five-person team credit and graduation-project framing; confirm each teammate's role; agree to remove the committed user database and people photos from the public repository before promotion.
9. Upstream contributions (Betaflight, PX4 EKF2, OpenFront): have any PRs been opened or merged? If yes, approve an aggregated "open-source contributions" record.
10. Talks: do you have slides or a recording for DevFest Tripoli 2025, and may the CodewithSerah bootcamp sessions and the LAU Byblos Git workshop be listed?
11. Evoid, PadelEye, Bsheel: what is your role in each, and what may be said publicly and when?
12. Client work: may imagen (photographer pipeline) and lumiscan (dermatology dashboard) be described publicly with the client anonymized? CV-aim-assist is recommended for permanent exclusion.
13. Basira: it is already live on basira.ramikronbi.com. Public record, review, or hold?
14. impact-dashboard: is the "USJ Testotheque" Oreyeon-seat author identity your own work, and is the USJ engagement disclosable?
15. Hanta virus OSINT dashboard: add as a review candidate?
16. Medical prescription OCR: are the 66 prescription images in the public repository synthetic or safe to keep public?
17. Point-of-sale lineage (epos, epos-software, gravi): any version publishable, and was there a real client?
18. Profiles: add Substack and YouTube to the site's verified profile list?

Items 1–15 of the 2026-09-20 list were answered the same day and applied. Earlier open decisions remain:

- Which of the 11 ready pairs should remain public after pruning?
- Should review routes remain buildable locally after pruning, or should rejected drafts be removed entirely?
- Which existing file(s) may change for sitemap and navigation integration?
- Which article should be syndicated first?
- Which publishing accounts and credentials may Claude use, and when?
- Whether a preview, push, merge, production deployment, or third-party publication is authorized.
