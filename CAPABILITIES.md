# Vertex AI — Capabilities Roadmap

*What the world's top AI-automation companies actually run on, mapped to what
Vertex can implement to look and operate like the best. Grounded in the leading
open-source projects on GitHub (stars as of June 2026).*

The goal: make Vertex's product and site credible enough that cold prospects
believe you're a serious AI-automation firm before you send a single email.

---

## How the best are built (the reference architecture)

Top AI-automation companies (think Vapi/Bland-powered agencies, Synthflow,
Air.ai-style shops, and SMB automation firms) are assembled from a small number
of proven building blocks:

1. **A voice/chat AI layer** that answers calls, texts, and web chats.
2. **A workflow/automation engine** that connects everything (the "glue").
3. **A knowledge layer (RAG)** so the AI answers from the client's real info.
4. **A CRM + pipeline** to track leads and revenue.
5. **Scheduling + comms** (calendar, SMS, email).
6. **An analytics/reporting dashboard** the client logs into.
7. **Trust & polish**: case studies, local SEO, security, fast site.

---

## The building blocks, grounded in GitHub

| Capability | Leading open-source / tool | Stars | Why it matters for Vertex |
|---|---|---:|---|
| **Realtime voice AI agents** | [livekit/agents](https://github.com/livekit/agents) | 111k | The engine behind AI phone receptionists — answer/transcribe/respond in real time |
| | [TEN-framework](https://github.com/TEN-framework/ten-framework) | 107k | Conversational voice AI, low-latency |
| **Workflow automation ("the glue")** | [n8n](https://github.com/n8n-io/n8n) | 1937k | 400+ integrations; how agencies wire CRM↔calendar↔SMS without custom code |
| | [Dify](https://github.com/langgenius/dify) | 1463k | Production agentic workflows + RAG, low/no-code |
| | [Activepieces / Automatisch](https://github.com/automatisch/automatisch) | 139k | Self-hosted Zapier alternative |
| **Agent orchestration** | [LangGraph](https://github.com/langchain-ai/langgraph) | 355k | Reliable, stateful multi-step agents (booking, follow-up logic) |
| | [LangChain](https://github.com/langchain-ai/langchain) | 1400k | Tooling, model routing, integrations |
| **Knowledge / RAG** | [LlamaIndex](https://github.com/run-llama/llama_index) | 503k | Answer from the client's FAQs, pricing, docs |
| | [Haystack](https://github.com/deepset-ai/haystack) | 256k | Production RAG pipelines, retrieval + memory |
| **CRM** | **HubSpot** (you have a live connector!) | — | Pipeline, contacts, deal tracking — no build needed |
| **Scheduling** | Cal.com | 30k+ | Self-serve booking, calendar sync, reminders |
| **SMS / voice telephony** | Twilio (API) | — | Missed-call text-back, reminders, the actual phone number |
| **Support / live chat** | Chatwoot | 20k+ | Omnichannel inbox if you add managed support |

---

## What Vertex already has ✅

- Marketing site + productized offers (Next.js on Vercel)
- **Self-serve Stripe subscriptions** + automated onboarding + billing portal
- **Lead capture → Supabase** + Slack alerts + Resend email
- **`/audit` Lead Leak Audit** calculator (top-of-funnel)
- Internal dashboard with live leads + active-subscription counts

This is already further than most agencies get. The gap is **proof, polish, and
the live AI demo** — the things a cold prospect checks before replying.

---

## Prioritized roadmap (what to implement, in order)

Scored for **"perfect before emails"** credibility × revenue impact × effort.

### Tier 1 — Do before any outbound (credibility & trust)
1. **Tampa local-SEO + LocalBusiness schema** — JSON-LD with your Tampa address
   + phone so you show as a real local business in search. *(Quick, high trust.)*
2. **Niche the homepage** to one Tampa vertical (e.g. "AI receptionist for Tampa
   home-services / med spas"). Specific beats generic for SMB trust.
3. **Real-feeling case studies** with concrete local numbers + (when you have
   them) named testimonials. Swap the "illustrative" labels as pilots close.
4. **HubSpot CRM wiring** — every `/contact` + `/audit` lead flows into HubSpot
   automatically (you have the connector). Looks and operates like a real firm.

### Tier 2 — The "wow" demo that closes deals
5. **Live AI voice/chat demo** on the site — a prospect talks to your AI
   receptionist and hears it book a job. (LiveKit/Vapi/Retell.) This is the
   single biggest credibility upgrade.
6. **Automation engine (n8n) behind the scenes** — standardized client
   workflows (missed-call → text-back → CRM → calendar) you reuse per client.
7. **Booking integration (Cal.com)** so the AI actually books onto a calendar.

### Tier 3 — Scale & retention
8. **Client analytics dashboard** (per-client): leads captured, calls answered,
   $ recovered — the monthly report that kills churn.
9. **RAG knowledge base per client** (LlamaIndex) so the AI answers from their
   real pricing/FAQs.
10. **Automated monthly results email** to each client (compounds retention).

---

## My recommendation for "perfect before emails"
You don't need all ten before outbound — you need to look **credible, local, and
real**. The four highest-leverage moves I can implement now, in-repo:

- **Tier 1.1 — Local SEO + LocalBusiness schema (Tampa + your number)**
- **Tier 1.2 — Niche the homepage to Tampa + one vertical**
- **Tier 1.4 — HubSpot CRM auto-sync of leads** (uses your live connector)
- **Tier 2.5 — A live AI chat demo widget** on the site

The voice-call demo and n8n/Cal.com require external accounts/keys (yours), so
those are guided setups; everything else I can build and deploy directly.
