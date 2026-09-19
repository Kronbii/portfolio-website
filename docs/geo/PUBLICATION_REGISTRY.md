# Publication registry

This registry tracks Rami Kronbi's existing public writing, talks, and profiles and their relationship to future canonical pages on ramikronbi.com.

Live audit performed 2026-09-20 by Claude (read-only). Methods: DEV public API, Medium RSS feed, Hashnode RSS and canonical tag, Substack RSS, YouTube oEmbed, Arduino Library Manager listing page, RHU news pages, GDG and Space Apps pages, and the indexed-link inventory already committed at `public/links/links.md`. No external account was modified.

## Status vocabulary

- `live-verified` — URL and metadata checked during the 2026-09-20 audit.
- `site-declared` — represented in the current portfolio but not rechecked live.
- `needs-reconciliation` — factual, authorship, canonical, or disclosure conflict exists.
- `candidate` — profile or source may contain items not yet inventoried.
- `blocked` — the platform refused automated access; verify manually.
- `archived` — retained as history, not part of the active strategy.

## Articles

### 1. Seeing in the Dark: Real-Time Thermal Super-Resolution (That Actually Runs on Edge Devices)

- Status: `live-verified`, `needs-reconciliation`.
- Displayed author: "Rami kronbi" on Medium; "Rami Kronbi" on DEV, Hashnode, Substack.
- Copies and timestamps (UTC):
  - Medium: `https://medium.com/@ramikronbi/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices-5d95b4bab7b2` — published 2026-02-01 23:58, updated 2026-02-02 10:57.
  - DEV: `https://dev.to/ramikronbi/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices-3nc7` — published 2026-02-02 00:13; `canonical_url` is the DEV page itself (no cross-platform canonical); 1 reaction.
  - Hashnode: `https://ramis-blog.hashnode.dev/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices` — published 2026-02-02 00:33; canonical tag points to itself.
  - Substack: `https://kronbii.substack.com/p/seeing-in-the-dark-real-time-thermal` — published 2026-02-02 00:22. Not represented in the current site configuration.
- Canonical relationship: four self-canonical copies published within about 35 minutes. No copy declares another as canonical. The site's existing structured data treats Medium as the origin (dated 2026-02-01) and DEV as `sameAs`; Hashnode and Substack are not mentioned.
- Claims in the article: 34.2 dB PSNR / 0.840 SSIM; ~130 FPS at ×2 and ~60 FPS at ×4 on an RTX 3070; 20–30 FPS on "Jetson Orin"; ~97% TensorRT conversion accuracy; IMDN architecture; C++ multithreaded TensorRT pipeline.
- Conflicts: the canonical CV states ~45 FPS on Jetson AGX Orin; the repository description states "229+ FPS" and 250–270 FPS per scale. Three different speed stories exist. The website article uses only the CV figures.
- Opening narrative: a first-person account of a drone project needing thermal object detection. Not independently corroborated; do not port into the website article without Rami's confirmation.
- Collaborators named: none.
- Related project: thermal super-resolution. Website article: `/writing/adapting-super-resolution-to-thermal-imagery`.
- Recommended action: preserve. After the website article is live, ask Rami whether DEV and Hashnode should set `canonical_url` to the website article (both platforms support it) and whether the Substack duplicate should stay. Medium cannot be retro-canonicalized without republishing; leave it. The existing homepage structured data that declares Medium as the article origin will need correction in the approved integration change.

### 2. AI Should Serve Society — Not Just Industry and Billionaires

- Status: `live-verified`.
- Copies and timestamps (UTC):
  - Medium: `https://medium.com/@ramikronbi/ai-should-serve-society-not-just-industry-and-billionaires-52d6b685e35d` — published 2026-01-09 21:28, updated 2026-01-09 22:00.
  - DEV: `https://dev.to/ramikronbi/ai-should-serve-society-not-just-industry-and-billionaires-37c9` — published 2026-01-09 22:16; self-canonical; 1 reaction; tags discuss, ai, showdev, software.
  - LinkedIn post exists (indexed as "Rami Kronbi's Post", activity 7416091002844856321).
- Content: opinion essay; cites OmniSign as a "we built" example with a link to `https://laythayache.com/projects/omnisign`. No statistics with sources.
- Related themes: public-interest technology, civic technology, accessibility.
- Recommended action: preserve unchanged. Do not rewrite as a project article. It may be linked from a public-interest topic hub only after Rami confirms the essay still represents his position and after the OmniSign attribution question is settled, because the essay claims the project in the first person plural.

### 3. We Built Sign Language AI for a Language With Almost No Dataset. Here's What That Actually Looks Like.

- Status: `live-verified`, `needs-reconciliation`.
- Copies and timestamps (UTC):
  - DEV: `https://dev.to/ramikronbi/we-built-sign-language-ai-for-a-language-with-almost-no-dataset-heres-what-that-actually-looks-kem` — published 2026-05-05 16:29; self-canonical; tags ai, deeplearning, society.
  - Medium: `https://medium.com/@ramikronbi/we-built-sign-language-ai-for-a-language-with-almost-no-dataset-c4a60df1cf96` — published 2026-05-05 16:23 under the shortened title "We Built Sign Language AI for a Language With Almost No Dataset." Not represented in the current site configuration, which lists only the DEV copy.
- Content: opening anecdote about witnessing a deaf man and a barista in Beirut; MediaPipe hand landmarks; deliberately publishes no accuracy figures. No collaborators, institution, dataset provenance, or award named.
- Conflict: the OmniSign project page on `https://laythayache.com/projects/omnisign` (fetched 2026-09-20) lists the team as Layth Ayache, Nour El Hariri, Tayseer Laz, and Abou Baker Hussien Al Khatib with supervisor Dr. Oussama Mustapha, reports 40,000 collected samples and a Public Choice first prize at the 2025 National FYP Demo Day (2025-05-26), and does not name Rami. An earlier indexed snippet of the same page, recorded in `public/links/links.md`, read "Rami Kronbi — Computer Vision Engineer, OmniSign". The live page no longer contains that line. Rami's exact role, and whether the team consents to his public attribution, must be confirmed before the website article leaves review.
- Related project: OmniSign (review). Website article: `/writing/building-real-time-lebanese-sign-language-translation` (review).
- Recommended action: preserve; do not syndicate or canonicalize until the attribution question is resolved. The barista anecdote is not portable evidence.

## Talks, workshops, and sessions

### GDG DevFest Tripoli 2025 (GDG North Lebanon)

- Status: `needs-reconciliation` (secondary evidence only).
- Event: DevFest Tripoli 2025, 2025-12-20, Beirut Arab University, Tripoli campus. Official pages: `https://north25.gdglebanon.com/` and the GDG community event page.
- Evidence for a speaker role: indexed snippets recorded in `public/links/links.md` ("Rami Kronbi Computer Vision Engineer, Oreyeon … 11:10 AM - 11:50 AM" on the DevFest site; Instagram promos "Meet our DevFest 2025 speaker: Rami Kronbi, Computer Vision Engineer at Oreyeon"; a reel dated 2025-12-20). On 2026-09-20 the live event pages returned no speaker list or agenda, and Instagram blocked automated access.
- Talk title in the current homepage content: "On-Device Multimodal Assistants: Can We Fit GPT-Vision on Small Hardware?" — first-party only. Slide assets, architecture diagrams, and demo recordings exist in Rami's local files outside the repositories (found 2026-09-20); the deck can be published as evidence after Rami confirms the final title. Only diagram and demo assets may be copied; personal documents in the same folder must not be.
- Existing site structured data marks Rami as `performer` of "GDG DevFest North Lebanon 2025" with location "Lebanon" (the venue was Tripoli).
- Recommended action: ask Rami for the slides or recording and the exact title; then publish as a verified talk with the event page as the source. Correct the event location in the approved integration change.

### CodewithSerah Pre-Winter Sprint Bootcamp

- Status: `live-verified` (LinkedIn post by CodewithSerah, January 2026).
- Two sessions delivered by Rami: "Git & GitHub" and "The Long Way into AI (And Why That's Normal)". URL: `https://www.linkedin.com/posts/codewithserah_git-github-the-long-way-into-ai-rami-activity-7421484335364681728-DWk1`.
- Recommended action: candidate for a public speaking or mentoring record; ask Rami whether the host organization and date may be published and whether slides exist.

### LAU Byblos Software Engineering Club — Git and GitHub beginner workshop

- Status: `candidate` (repository evidence only).
- Public repository `Tarek-AL-Saleh/Git_Github_Beginner_Workshop` names the host as the LAU Byblos Software Engineering Club and the coordinator as Rami Kronbi; Tarek AlSaleh authored most of the material; local copy shows the exercises were run in April 2026.
- Recommended action: ask Rami for the workshop date and whether it may be listed as a workshop he coordinated with Tarek AlSaleh.

## Profiles inventory

- Medium `https://medium.com/@ramikronbi` — `live-verified` via RSS: 3 items (the three articles above). Display name "Rami kronbi". Profile HTML blocked automated fetch (403).
- DEV `https://dev.to/ramikronbi` — `live-verified` via API: 3 articles. Profile bio reads "AI Systems Engineer …"; joined 2024-09-13; links to ramikronbi.com and GitHub.
- Hashnode `https://hashnode.com/@kronbii` / `https://ramis-blog.hashnode.dev` — `live-verified`: 1 article (thermal). Bio reads "AI & Computer Vision Engineer".
- Substack `https://kronbii.substack.com` — `live-verified`, newly inventoried: 1 post (thermal). Not in the site configuration; decide whether it belongs in `sameAs`.
- ResearchGate `https://www.researchgate.net/profile/Rami-Kronbi` — `blocked` (403). The indexed inventory lists the profile under Rafik Hariri University. No publication is known; do not claim one.
- GitHub `https://github.com/Kronbii` — `live-verified`: profile README claims authorship of easyPID and contributor status on Betaflight and OpenFront. Verified via the GitHub API on 2026-09-20: Betaflight PR #15706 merged 2026-09-16 and PR #15705 open; OpenFront PR #4868 merged 2026-08-07 and PR #4985 merged 2026-08-13; PX4 PR #28286 closed without merge. The profile claims are accurate.
- Arduino Library Manager `https://www.arduinolibraries.info/libraries/easy-pid` — `live-verified`: easyPID by Rami Kronbi, Device Control, MIT, architectures Any; versions 1.0.0 (2026-01-15) and 1.1.0 (2026-08-09). The registry now supports "version 1.1.0" as the current release.
- PlatformIO registry `https://registry.platformio.org/libraries/kronbii/easyPID` — `candidate`: indexed, but the registry API returned no record during the audit.
- YouTube `https://www.youtube.com/@RamiKronbi` — `live-verified` for one video: "PID Light Tracking Robot" (`https://youtu.be/Ye032oekX0A`), author "Rami Kronbi". Full channel inventory could not be parsed automatically.
- LinkedIn `https://www.linkedin.com/in/rami-kronbi/` — `blocked` for content; search snippets and third-party directories show the headline "Computer Vision Engineer – Oreyeon", which differs from the portfolio title "Embedded Systems & Vision Engineer".
- Printables `https://www.printables.com/@RamiKronbi_1891111` — `candidate`, low relevance (3D-printing collections), from the indexed inventory.
- Facebook and meme-page comments listed in the indexed inventory — `archived`; not part of the strategy.

## Institutional and event sources verified on 2026-09-20

- RHU, 2023-07-25: "RHU engineering students win big in the World Robotics Olympiad" — Rami Kronbi and Wassim Ghaddar, third place, Future Engineers; 95+ teams, 250+ participants; robots developed "from scratch in only 20 days". Coaches Mohamad Al Kaderi and Ibrahim Ghaddar.
- RHU, 2025-06-16: "RHU Commencement 2025" — "graduate Rami Kronbi was named the recipient of the Nazik Rafik Hariri Graduate Studies Award for 2025, receiving a full scholarship to pursue his master's degree at RHU." Commencement date 2025-06-14.
- RHU, 2022-09-26: "RHU team makes it to the final stages of the NASA Space Apps annual international competition" — "Rami Kronbi was the student volunteer from RHU at this event."
- Space Apps 2022 team page: team Climaticos (Beirut, climate-change challenge) lists member "kronbii — Rami Kronbi" with Elie Sebaaly.
- Caritas Lebanon (undated): names Antoine Tannous as Local Lead of NASA Space Apps Lebanon; no mention of Rami.
- RHU, 2025-04-23: "RHU Physics Day 2025" — organized by the RHU Physics and Astronomy Club; no mention of Rami or of a multi-university National Physics Day.
- Space Apps 2025 Beirut event page — fetch failed (certificate error); organizer roles for 2023–2025 remain unverified.

## Required live-audit fields

For every discovered item, record: exact title; platform and content type; live URL; displayed author name; publication and modification date; current availability; canonical URL and canonical-tag behavior; duplicates and syndication relationships; related project, topic, organization, or event; collaborators and quoted people; factual claims and metrics; evidence conflicts; media ownership; current strategic value; recommended action; whether external-account access is required.

## External action boundary

Discovery and analysis are read-only. Claude may not edit, republish, delete, archive, import, canonicalize, or otherwise change a Medium, DEV, Hashnode, Substack, ResearchGate, LinkedIn, GitHub, YouTube, or event-platform item without Rami's explicit authorization.

## Canonicalization strategy

For future approved technical articles:

1. Publish the complete ramikronbi.com version first.
2. Confirm that the canonical page is live, indexable, and technically correct.
3. Adapt the platform version without changing facts or inventing personal narrative.
4. Use the platform's canonical URL mechanism when available (DEV `canonical_url`, Hashnode canonical field, Medium import tool).
5. Link visibly to the canonical article, project record, repository or demo, and relevant topic hub.
6. Record publication dates and external URLs here.
7. Publish to at most two platforms per article, spaced out; the four-platform same-hour pattern used for the thermal article should not be repeated.

## Academic-publication boundary

Do not describe public technical articles, repositories, project reports, or platform essays as peer-reviewed research. The current evidence does not establish academic publications. The ResearchGate profile exists but could not be read; treat it as a profile only.
