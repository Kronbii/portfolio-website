# GEO and publishing plan

## Recommended architecture

Use the main website as the canonical knowledge graph:

- `/projects/[slug]` for the factual project record.
- `/writing/[slug]` for the human technical narrative.
- `/topics/[slug]` for a curated field-level evidence hub.
- Public repositories and demos as primary evidence destinations.
- Medium and DEV as later syndication channels that point back to the canonical website.

Do not create a separate article subdomain. It would fragment authority, duplicate canonical decisions, complicate analytics, and require another site identity. Use subdomains only for real interactive products or demos, such as `360.ramikronbi.com`.

## What improves generative-engine visibility

- Consistent name, role, and project naming across the website and public profiles.
- A clear plain-language answer near the top of each page.
- Specific architecture, measurements, constraints, limitations, and role descriptions.
- Visible evidence links to repositories, demos, official institutional pages, and reviewed source material.
- Internal links connecting person, project, article, topic, and evidence.
- Valid structured data that matches visible content.
- External corroboration from credible institutions and platforms.
- A steady publishing cadence that earns real links and references.

Structured data alone will not make pages authoritative. It clarifies relationships after the content and evidence establish them.

## Minimal existing-site integration

The current additive-only build deliberately does not change the existing sitemap or navigation.

After user approval, the recommended minimal integration is:

1. Add `/projects`, `/writing`, `/topics`, all ready project slugs, all ready article slugs, and all eligible topic slugs to the generated sitemap.
2. Add one discoverable link from the existing site to `/projects` or `/writing`.
3. Correct or remove inaccurate and `[VERIFY]` homepage claims that conflict with the new canonical pages.
4. Keep every review and hold route out of the sitemap and public navigation.

Do not make broader homepage or visual-system changes as a side effect.

## Syndication workflow

For each approved article:

1. Publish and verify the canonical ramikronbi.com page.
2. Wait until the canonical page is reachable and has correct metadata.
3. Create a Medium version using the platform's canonical import or canonical-link option when available.
4. Create a DEV version with `canonical_url` pointing to the website article.
5. Preserve facts, figures, collaborator credits, limitations, and safety framing.
6. Adapt the opening and formatting to the platform, but do not invent a personal anecdote to make it feel human.
7. Include links to the project record, repository/demo, relevant topic hub, and Rami's main website.
8. Record the external URLs and publication dates.

Recommended first wave:

- Building a 360° panorama stitcher from a phone sweep.
- Designing a PID library for real embedded control.
- Building an autonomous race car in twenty days.
- Adapting super-resolution to thermal imagery.

Publish them over time rather than as a bulk dump.

## Visual strategy

- Lead with authentic project media or an accurate code-native diagram.
- Use comparisons, process stages, architecture diagrams, measurements, and limitations as visual material.
- Create animations only when they explain a transformation or system behavior.
- Avoid stock photography and synthetic images that imply a real deployment.
- Preserve provenance for every shipped raster and video.

## Measurement plan

Track:

- indexed pages and canonical selection;
- impressions and clicks for Rami's name, project names, and field-specific queries;
- crawl errors and structured-data errors;
- backlinks and referring domains to canonical pages;
- repository and demo referral traffic;
- Medium/DEV referral traffic;
- citations or mentions in AI answers when observable;
- conversion signals such as contact clicks, repository visits, and CV views.

Treat ranking and AI-answer visibility as lagging outcomes. The controllable leading indicators are evidence quality, technical specificity, link integrity, crawlability, and credible distribution.
