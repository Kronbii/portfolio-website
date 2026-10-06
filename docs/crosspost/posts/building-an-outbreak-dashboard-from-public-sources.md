---
title: "Building an outbreak dashboard from public sources"
description: "Aggregating what agencies and newsrooms already publish into one map is useful only if every claim stays linked to where it came from."
canonical_url: https://ramikronbi.com/writing/building-an-outbreak-dashboard-from-public-sources
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: civictech, ai
published: false
---
When the MV Hondius hantavirus outbreak developed in April and May 2026, the public record was spread across WHO disease-outbreak news, CDC material, a GIS case layer, and news feeds. Hantawatch aggregates those into one live dashboard: a country choropleth, status-colored case events, an event feed, indicators with deltas, a 14-day sparkline, and a news ticker.

## The server does the reading

Aggregation runs in a server component: cases, case events, and news are fetched in parallel, normalized into one event model, and checked for source health. The page shell is static; the live panel renders dynamically inside a Suspense boundary. Getting that split right under Next.js 16’s cache-components mode was most of the framework work.

## State lives in the URL

The view, the search text, and the selected country are URL parameters. Clicking a country polygon or a top-countries row toggles the country filter, so any state of the dashboard can be shared or restored with the back button. That constraint kept the client small.

## Nothing without a link

Every row in the event feed is an anchor to its source page, and the ticker opens each story at its origin. The dashboard is a reading aid for public information, not a new source of it. It holds no patient-level data and makes no epidemiological claim of its own.

What it lacks is also clear: the parsers are specific to this outbreak and its feeds, there is no automated test suite yet, and the repository’s documentation is a handoff note rather than a README. Those are the next things to fix before it is presented as more than a working prototype.

## Links

- [Live dashboard](https://hanta-virus-dashboard.vercel.app)
- [GitHub — hanta-virus-dashboard](https://github.com/Kronbii/hanta-virus-dashboard)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-an-outbreak-dashboard-from-public-sources). The project: [Hantawatch](https://ramikronbi.com/projects/hantawatch-outbreak-dashboard).*
