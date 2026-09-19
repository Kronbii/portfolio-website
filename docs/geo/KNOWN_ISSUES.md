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

## Technical follow-ups

- Validate every JSON-LD payload with current production URLs after deployment.
- Confirm Open Graph previews on the live domain; dedicated social crops may be useful later.
- Re-run mobile overflow, keyboard, focus, reduced-motion, and broken-link checks after any content pruning.
- The runtime header bridge is a compatibility measure. Once the user allows integration changes, prefer explicit durable navigation over relying on DOM rewriting.

None of these issues authorizes changing existing site files, deploying, or publishing without the user-owned gates in `TASKS.md`.
