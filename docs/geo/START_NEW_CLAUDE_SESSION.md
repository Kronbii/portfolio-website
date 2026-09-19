# Start a new Claude Code session

## Workspace

Open Claude Code in:

`/home/kronbii/repos/portfolio-website`

Confirm the active branch is `claude/geo-authority-pages`. Do not switch to or work directly on `main`.

## Copy-paste prompt

> Take over the GEO authority workspace. Read `CLAUDE.md`, the complete private suite beginning at `.claude-private/README.md`, and then `docs/geo/README.md`. Follow the required read order, inspect the branch and working tree, and begin with Phase 0.5 in `docs/geo/TASKS.md`. Discover and classify every accessible project yourself before asking me focused ownership or consent questions. Audit my existing publications and verify the entity timeline. Preserve the additive-only boundary, publication states, evidence rules, private/public separation, and user-owned approval gates. Update `CURRENT_STATE.md`, `TASKS.md`, and `SESSION_LOG.md` after each material milestone. Do not push, merge, deploy, publish, modify external accounts, or modify any file that existed at the base commit without my explicit approval.

## Expected first response from Claude

Claude should report, before editing:

- the repository root and branch it inspected;
- the first actionable task;
- confirmation that it found and will follow the private project and publication discovery protocols;
- the relevant blocker or user-owned gate;
- the files it expects to add or update;
- confirmation that it will not touch `main`, deploy, or publish.

If Claude instead proposes a fresh redesign, repeats repository discovery, or asks for the entire history again, point it back to `docs/geo/README.md`.
