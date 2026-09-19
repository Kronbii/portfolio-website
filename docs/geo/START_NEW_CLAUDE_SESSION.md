# Start a new Claude Code session

## Workspace

Open Claude Code in:

`/home/kronbii/repos/portfolio-website`

Confirm the active branch is `claude/geo-authority-pages`. Do not switch to or work directly on `main`.

## Copy-paste prompt

> Take over the GEO authority workspace. Read `CLAUDE.md` and then `docs/geo/README.md` completely. Follow the required read order, inspect the branch and working tree, and resume the first actionable unchecked task in `docs/geo/TASKS.md`. Preserve the additive-only boundary, publication states, evidence rules, and user-owned approval gates. Update `CURRENT_STATE.md`, `TASKS.md`, and `SESSION_LOG.md` after each material milestone. Do not push, merge, deploy, publish, or modify any file that existed at the base commit without my explicit approval.

## Expected first response from Claude

Claude should report, before editing:

- the repository root and branch it inspected;
- the first actionable task;
- the relevant blocker or user-owned gate;
- the files it expects to add or update;
- confirmation that it will not touch `main`, deploy, or publish.

If Claude instead proposes a fresh redesign, repeats repository discovery, or asks for the entire history again, point it back to `docs/geo/README.md`.
