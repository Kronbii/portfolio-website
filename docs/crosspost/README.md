# Cross-posting the writing

Every post on ramikronbi.com/writing can be republished on DEV, Medium, and Hashnode. Each copy points back to the site as its canonical URL, so search engines credit the original, and each one ends with a link to the post and its project.

There are 25 posts. Two of them already exist on DEV and Medium in older versions ("We Built Sign Language AI…" and "Seeing in the Dark…"), so they are skipped unless you pass `--include-existing`. That leaves 23 to publish.

What's here:

- `posts/` holds one Markdown file per post, with front matter (title, description, canonical URL, cover image, tags). Regenerate them after editing the writing with `node docs/crosspost/crosspost.mjs export`.
- `crosspost.mjs` publishes through each platform's API. It does a dry run unless you pass `--go`, and it records what it posted in `published.json`, so a rerun never posts the same thing twice.
- `https://ramikronbi.com/feed.xml` is a full-text RSS feed of the same posts, and every platform below can import from it.

## DEV (dev.to)

**Option A: the script.** Create a key under dev.to → Settings → Extensions → DEV Community API Keys. Add `DEVTO_API_KEY=...` to the repo's `.env` (it is gitignored), then run:

```sh
node docs/crosspost/crosspost.mjs publish devto          # dry run: lists the 23 posts
node docs/crosspost/crosspost.mjs publish devto --go     # publishes, one every 35 s (DEV's rate limit)
node docs/crosspost/crosspost.mjs publish devto --go --draft   # or post as drafts to review first
```

Before posting, the script checks your existing DEV posts by title and canonical URL and skips any that are already there.

**Option B: RSS, no key.** Go to dev.to → Settings → Extensions → "Publishing to DEV from RSS". Set the feed URL to `https://ramikronbi.com/feed.xml` and tick "Mark the RSS source as canonical URL by default". DEV imports each post as a draft; publish the ones you want. Skip the sign-language and thermal posts, which you already have there.

## Medium

Medium no longer issues API tokens to new accounts. Its import tool keeps the canonical link for you:

1. Open https://medium.com/p/import while signed in.
2. Paste one URL from the list below and click Import.
3. Check the draft (the cover image and headings come through), add up to five tags, and publish.

If you still have a legacy integration token, add `MEDIUM_TOKEN=...` to `.env` and run `node docs/crosspost/crosspost.mjs publish medium --go`, with `--draft` to review first.

Already on Medium, so skip these: the sign-language translation post and the thermal super-resolution post.

```
https://ramikronbi.com/writing/engineering-a-five-inch-fpv-drone-from-first-principles
https://ramikronbi.com/writing/building-a-360-panorama-stitcher-from-a-phone-sweep
https://ramikronbi.com/writing/designing-a-pid-library-for-real-embedded-control
https://ramikronbi.com/writing/building-an-autonomous-race-car-in-twenty-days
https://ramikronbi.com/writing/what-a-two-axis-light-tracker-teaches-about-pid-control
https://ramikronbi.com/writing/turning-segmented-cracks-into-measurable-paths
https://ramikronbi.com/writing/extracting-medicine-names-from-multilingual-prescriptions
https://ramikronbi.com/writing/designing-election-information-for-verifiability
https://ramikronbi.com/writing/building-an-adaptive-motorcycle-theory-trainer-for-lebanon
https://ramikronbi.com/writing/building-a-local-first-ai-support-triage-council
https://ramikronbi.com/writing/designing-an-offline-first-personal-finance-desktop-app
https://ramikronbi.com/writing/rebuilding-my-finance-app-around-local-first-sync
https://ramikronbi.com/writing/connecting-posture-estimation-to-a-motorized-desk
https://ramikronbi.com/writing/what-four-years-of-technical-mentoring-taught-me
https://ramikronbi.com/writing/building-technology-around-crisis-response-operations
https://ramikronbi.com/writing/what-small-upstream-fixes-teach-about-firmware
https://ramikronbi.com/writing/talks-workshops-and-teaching
https://ramikronbi.com/writing/building-an-outbreak-dashboard-from-public-sources
https://ramikronbi.com/writing/designing-a-council-of-models-for-retinal-screening
https://ramikronbi.com/writing/why-color-science-comes-before-the-model
https://ramikronbi.com/writing/making-tenant-isolation-the-only-path
https://ramikronbi.com/writing/what-a-small-vision-venture-taught-me-about-scope
https://ramikronbi.com/writing/a-first-mechatronic-loop-without-a-pump
```

## Hashnode

Since May 2026, Hashnode's API only works for publications on its Pro plan.

- **With Pro:** add `HASHNODE_TOKEN=...` (from hashnode.com → Settings → Developer) and `HASHNODE_PUBLICATION_ID=...` (in your blog dashboard's URL) to `.env`, then run `node docs/crosspost/crosspost.mjs publish hashnode --go`. Each post is sent with the site as its original article URL.
- **Without Pro:** open your blog dashboard → Import and import from the RSS feed `https://ramikronbi.com/feed.xml`. Once the posts are on DEV, Hashnode's DEV importer works too. Either way, set each post's canonical URL to its ramikronbi.com address if the importer doesn't do it for you.

## Pacing

Publishing all 23 at once floods your followers' feeds and sends them a burst of notifications. Two or three posts a week reads better and gets each one more attention. With the script, add `--limit=3` to publish the next three; each run picks up where the last one stopped.
