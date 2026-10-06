---
title: "Designing election information for verifiability"
description: "In civic technology, the source and history of a fact matter as much as the interface that displays it."
canonical_url: https://ramikronbi.com/writing/designing-election-information-for-verifiability
cover_image: https://ramikronbi.com/images/authority/daleel/hero.jpeg
tags: civictech, webdev
published: false
---
Daleel—Arabic for “guide”—is a Lebanese parliamentary-election information project built around a simple principle: political information should be inspectable. A candidate profile or district record is more useful when a reader can see where it came from and when it changed.

That requirement changes the architecture. An ordinary content system optimizes for the current value. Daleel’s design treats history and sources as first-class data. Its public repository describes archived sources, append-only records, and immutable data models intended to preserve a verifiable trail.

### Neutrality needs mechanisms

Calling a platform independent does not make it neutral. The product has to show its work. Source links, archived evidence, consistent fields, and change history give readers tools to evaluate a record without trusting the publisher blindly.

The platform is multilingual in Arabic, English, and French. That is not a cosmetic translation layer in Lebanon; it affects names, search, layout direction, source availability, and the risk of different language versions drifting apart.

The documented stack pairs a Next.js frontend with an Express backend and Prisma/PostgreSQL. Authentication, CSRF protection, rate limiting, and immutable models support the public information layer. The security work matters for the same reason: a single unauthorized change would undermine the central promise.

### What Daleel is not

Daleel is not an official election authority, and I don’t present its dataset as complete or live. It is an independent civic-technology project: an engineering approach to election information you can check for yourself.

The hard work ahead is institutional as much as technical: source standards, correction workflows, contributor governance, legal review, and a visible policy for disputed information. A database can preserve history, but people still decide what enters it and how errors are handled.

The project is valuable because it makes those decisions explicit. For high-trust public information, a polished profile page is not enough. Provenance is a product feature.

## Links

- [GitHub — daleel](https://github.com/Kronbii/daleel)
- [TECHNICAL.md](https://github.com/Kronbii/daleel/blob/main/TECHNICAL.md)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/designing-election-information-for-verifiability). The project: [Daleel](https://ramikronbi.com/projects/daleel-lebanese-election-information).*
