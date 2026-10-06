---
title: "Building a local-first AI support triage council"
description: "An internal support workflow where an LLM proposes structure, deterministic rules enforce policy, and a human keeps the final say."
canonical_url: https://ramikronbi.com/writing/building-a-local-first-ai-support-triage-council
cover_image: https://ramikronbi.com/images/vneo/rami-kronbi-card.jpg
tags: ai, webdev, localfirst
published: false
---
The AI Customer Support Council is a self-hosted technical-assessment project built for Valsoft Corporation. It is an internal admin console for synthetic B2B support requests, not a customer-facing help desk.

The application takes a submission through intake, machine-assisted triage, deterministic routing and escalation, human review, persistence, and structured export. Its four screens—login, dashboard, submissions, and submission detail—are deliberately narrow because the product has one operator and one job.

### The LLM is one component, not the workflow

An LLM can turn messy text into proposed categories, urgency, and rationale. It should not quietly become the policy engine. The project separates model output from deterministic rules such as confidence thresholds and escalation conditions. A low-confidence response can be sent for review no matter how fluent the explanation sounds.

State is stored in PostgreSQL. Background work runs through Redis and RQ. The backend uses FastAPI, Pydantic, SQLAlchemy, and Alembic; the frontend uses React, TypeScript, Vite, TanStack Query, React Hook Form, and Zod. Ollama with a local model is the default provider, with an optional OpenAI-compatible endpoint.

That local-first default matters for privacy, cost control, and repeatability. It also creates operational responsibilities: model availability, queue state, migrations, auditability, and a clear distinction between a failed inference and a failed support request.

### Human review is a designed state

The reviewer needs to see the original submission, the model’s proposal, confidence, and the rules that changed or escalated it. Accepting or overriding a result should be explicit. The export must reflect the reviewed state, not a hidden intermediate prediction.

The best pattern here is not “replace support staff with AI.” It is to make a noisy intake queue easier to inspect while keeping policy deterministic and decisions attributable. The council metaphor works only when disagreement, uncertainty, and review remain visible.

## Links

- [GitHub — AI-customer-support-council](https://github.com/Kronbii/AI-customer-support-council)
- [Architecture and testing documentation](https://github.com/Kronbii/AI-customer-support-council#readme)

---

*Originally published at [ramikronbi.com](https://ramikronbi.com/writing/building-a-local-first-ai-support-triage-council). The project: [AI Customer Support Council](https://ramikronbi.com/projects/local-first-ai-support-triage).*
