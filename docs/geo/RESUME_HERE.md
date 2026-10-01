# Resume here

Updated: 2026-10-01. Latest commit on this branch: `a3d350f`.

Open this file first when you come back. It names the next three moves and points at the state that proves them.

## Branch layout (2026-10-01)

- `main` — production. ramikronbi.com serves this.
- `geo` — this branch. GEO context, task board, syndication drafts, Phase-4 review, and the sandbox UI exploration from the design pass. Resume GEO work here.
- `ui` — parallel branch for ongoing homepage UI edits. Started from `main`; carries a copy of the sandbox pairings as the starting point.

Keep merges one-way: finish an open loop here, merge `geo` → `main`; finish a UI edit on `ui`, merge `ui` → `main`. Do not merge `geo` ↔ `ui` directly.

## What is live on `main`

Production at ramikronbi.com (origin/main at `8161a4d`) serves the full authority system: 19 ready projects, 23 ready articles, 9 topic hubs, 56-URL sitemap, Projects and Writing in the header, review routes 404 in production. Verification record: `claude/IMPLEMENTATION_REPORT.md`. The homepage sections `home-projects.tsx` and `home-community.tsx` are still the mirrored sticky lineups; the sandbox exploration under `src/app/sandbox/work/` is on this branch, not on main.

## What is on this branch and not on `main`

Three commits ahead of production (`git log --oneline main..`):
- `6a8f700` docs: production verification record and the first-wave syndication drafts
- `e7dede4` sandbox: three pairings for the homepage work and community sections (A chapters + film strip, B spreads + ledger, C evidence wall + chapters)
- `a3d350f` sandbox: apply finish-review fixes to the pairings

The syndication drafts live under `docs/geo/syndication/`. The sandbox UI work also lives on the `ui` branch for parallel iteration; promoting it to real sections happens there, not here.

## Open loops for GEO (next three moves)

1. **Search Console submission.** Submit `https://ramikronbi.com/sitemap.xml` in Google Search Console under the ramikronbi.com property (verified via the meta tag in `src/app/layout.tsx`), then request indexing on `/`, `/projects`, `/writing`, and `/projects/360-spherical-panorama-stitching`. Bing Webmaster Tools imports the same property.
2. **First syndication wave.** Four drafts are ready under `docs/geo/syndication/`: 360 stitching, easyPID, race car, thermal. Publish spaced days apart. DEV accepts the `canonical_url` front matter already present in each file. Medium needs its import feature (paste the ramikronbi.com URL in Import a story) so Medium sets the canonical itself. Record each publication in `docs/geo/syndication/README.md`.
3. **Documents from Rami.** Still outstanding: INJAZ MENA evidence, National Physics Day evidence, Space Apps organizer certificates or photos (2021–2024), DevFest 2025 slide exports. When any arrive, the matching review record can leave review.

Remaining review items: runway UAV, FPV drone, emotion recognition, physics outreach (`docs/geo/CONTENT_REGISTRY.md`).

## Where context lives

- `docs/geo/CURRENT_STATE.md` — latest state snapshot.
- `docs/geo/TASKS.md` — task board with user-owned decisions.
- `docs/geo/SESSION_LOG.md` — chronology; the last entry is 2026-09-20 "Promotions after Rami's answers".
- `docs/geo/CONTENT_REGISTRY.md` — complete content inventory with per-record decisions.
- `docs/geo/ENTITY_FACTS.md` — public-safe identity record.
- `docs/geo/PUBLICATION_REGISTRY.md` — Medium/DEV/Hashnode/Substack audit.
- `docs/geo/KNOWN_ISSUES.md` — resolved and open blockers.
- `docs/geo/DECISIONS.md` — settled decisions not to be reopened.
- `.claude-private/README.md` — private reasoning suite (git-ignored). Entry point for the digital replica, project census, career timeline, organizations, and voice model.
- `CLAUDE.md` (repo root) — hard write boundary and fresh-session continuation protocol. The `continue` phrase re-enters this workspace.

## Protocol when resuming

Say `continue` to the next Claude session in this repo. The fresh-session protocol in root `CLAUDE.md` tells it to read this file first, then the private suite, then `docs/geo/README.md`, then this branch's three-move list above.

Do not merge this branch into `main` until the open loops are satisfied. The sandbox pairings on this branch exist as a reference for the parallel `ui` branch; promotion of a pairing happens on `ui`.
