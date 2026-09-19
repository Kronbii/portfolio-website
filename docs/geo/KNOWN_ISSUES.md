# Known issues and deployment blockers

Read this file before changing or publishing the implementation.

## Deployment blockers

### Public provenance manifest exposes local absolute paths

`public/images/authority/PROVENANCE.txt` currently records source assets using paths such as `/home/kronbii/repos/...`. Because the file is under `public/`, a production deployment would make those local workstation paths publicly reachable.

Before any preview intended for sharing or any production deployment, Claude must replace the public file with a disclosure-safe form or move the detailed internal provenance record under `docs/geo/`. Keep enough public attribution to establish ownership and origin without exposing workstation paths. Re-run the build and scan the deployable output for `/home/kronbii` afterward.

### New routes are not discoverable from the incumbent site

The additive-only boundary prevents changes to the existing navigation and sitemap. The pages can be visited directly but are not yet properly discoverable. Do not deploy them as a finished GEO system until the user approves the minimal integration diff in Phase 3 of `TASKS.md`.

### Review routes are still buildable routes

Review routes use `noindex, nofollow` and are absent from public indexes, but anyone who knows a deployed URL could still request it. Before production, the user must decide whether review routes should remain in the build, require a preview-only gate, or be removed until promoted.

## Editorial risks

- The existing homepage contains older inaccurate or `[VERIFY]` claims. It remains unchanged by design. The new pages avoid those claims, but the contradiction should be addressed in an explicitly approved integration change.
- Every ready page still needs the user's personal voice, collaborator-credit, date, naming, and media-rights review.
- Review projects require the evidence listed in `TASKS.md`; `noindex` is not permission to disclose sensitive information.

## Evidence conflicts found on 2026-09-20

- OmniSign: the live team page on laythayache.com lists five people and does not name Rami; the review article and two live platform articles claim the project in the first person plural. Keep review until resolved.
- NASNA: public repository credit ("AI Engineer & Developer", started October 2024) conflicts with the CV role and dates used in the review article. Keep review.
- Thermal super-resolution: the ready page's "~45 FPS on Jetson AGX Orin" has no artifact in the public repository, which reports 229.6 FPS on an unnamed GPU; the platform article says 20–30 FPS on "Jetson Orin". The quality metrics are supported by the repository report. Narrow or corroborate before deployment.
- Daleel: the ready page under-credits Layth Ayache (frontend contributions and the separate ingestion backend).
- easyPID: the ready page cites version 1.0.0; 1.1.0 was released 2026-08-09.
- Oreyeon title: third-party public sources say "Computer Vision Engineer"; the site says "Embedded Systems & Vision Engineer".
- Existing homepage structured data dates the thermal article as a Medium original and places DevFest 2025 in "Lebanon" rather than Tripoli; both need the approved integration change.

## Public-repository hygiene risks (Rami's repositories, outside this site)

Sweep result 2026-09-20 (`git ls-files` across every local repository): no `.env` file is tracked anywhere; the earlier concern was about untracked working-tree files only. Tracked items that still deserve a decision: `users.json` (twice) and three videos in smart-interactive-desk; one raw video in 360-spherical-stitching; two demo videos in thermal-super-resolution; `testing/SEED-CREDENTIALS.md` in hr-app (collaborator's repository). Rami confirmed the prescription-OCR test images are consented.

- Public repositories contain files that should be checked before their project pages are promoted: a committed user database and people photos in the smart-desk repository, 66 prescription images in the prescription-OCR repository, raw home videos in the 360 stitching repository, and the Valsoft take-home brief in the support-council repository. These are not website defects but they affect what the website can safely point to.

## Technical follow-ups

- Validate every JSON-LD payload with current production URLs after deployment.
- Confirm Open Graph previews on the live domain; dedicated social crops may be useful later.
- Re-run mobile overflow, keyboard, focus, reduced-motion, and broken-link checks after any content pruning.
- The runtime header bridge is a compatibility measure. Once the user allows integration changes, prefer explicit durable navigation over relying on DOM rewriting.

None of these issues authorizes changing existing site files, deploying, or publishing without the user-owned gates in `TASKS.md`.
