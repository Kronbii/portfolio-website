---
title: "Rebuilding my finance app around local-first sync"
description: "Juno keeps the data on the device first and syncs only if you ask. Most of the work went into making that boring and safe."
canonical_url: https://ramikronbi.com/writing/rebuilding-my-finance-app-around-local-first-sync
cover_image: https://ramikronbi.com/images/authority/juno/insights.webp
tags: localfirst, flutter, product
published: false
---
Juno is the new version of my finance app. The first one, REE, was a Flutter desktop app with local storage. Juno keeps that local-first core and adds an iPhone app, optional sync between the phone and the Linux desktop, and ways to log an expense without opening the app.

Every entry is marked Personal or Household, so a shared household can see how much goes to each. Without any configuration Juno runs local-only; sync is something you switch on.

## Sync that converges

Sync runs through Supabase, and its rules are deliberately simple. Every row carries an updated-at time and a soft-delete marker, so a deletion is a change like any other rather than a row that silently vanishes. Each round pushes the device’s local changes, then pulls everything the server has changed since a per-table cursor that the server itself stamps. Conflicts resolve last-write-wins.

Seeded data needs one more rule. Default categories and the occurrences of recurring entries are created on each device, and if each device gave them random ids, the first sync would produce two of everything. They get deterministic ids instead, so two devices that create the same category or the same rent payment converge on one row rather than duplicating it. The sync engine itself is written so it can run against a fake remote in tests.

## Logging without opening the app

A finance tracker is only as good as the entries that actually make it in. On iPhone, Juno exposes App Intents, so Siri, Shortcuts, Back Tap, and the Action Button can all log an entry, and a home-screen widget logs with one tap. Those entries land in a shared inbox, and Juno imports them the next time it launches. On the desktop, N opens a new entry and Enter saves it.

## Imports that remember

Juno guesses the columns of a bank CSV, learns your categories, skips rows it has already seen, and lets you undo an import. Excel workbooks and Notion exports come in the same way, with any Category column matched to your own categories, and everything exports back out to CSV.

Currencies matter in Lebanon, where accounts can be in Lebanese pounds or dollars. An account can hold LBP, EUR, or another currency at a rate you set, totals stay in USD, and each entry keeps the USD value it was logged at, so a later change in the rate does not rewrite the past.

## Checked like CI, on every push

One script runs exactly what CI runs: generated code, formatting, analysis with infos counted as failures, and every test, and a git hook can run it on each push. A screenshot test renders every screen at phone and desktop sizes, light and dark; the screenshots on the project page come from it, using the app’s demo data.

The look borrows from three earlier projects: the instrument-style frame of Bikey, with structure drawn in hairlines and every figure set in mono; the type system of Lazpress; and the warm dark palette of Tayseer, burgundy on near-black with cream ink.

## Links

- [GitHub — juno](https://github.com/Kronbii/juno)
- [iPhone setup: widget, Siri, and Shortcuts](https://github.com/Kronbii/juno/blob/main/docs/ios-setup.md)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/rebuilding-my-finance-app-around-local-first-sync). The project: [Juno](https://ramikronbi.com/projects/juno).*
