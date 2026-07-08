import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Live AI chat demo — lets a prospect talk to a Vertex-style AI receptionist.
 *
 * Backend chain (each step used only if the one before is unavailable/errors):
 *   1. Anthropic Claude       (ANTHROPIC_API_KEY) — the AI
 *   2. Smart scripted replies (always) — broad intent engine with rotating
 *      phrasings, so the widget is useful and never repeats even with no key
 *
 * Env:
 *   ANTHROPIC_API_KEY            (required for real AI replies)
 *   ANTHROPIC_MODEL              (optional, default claude-opus-4-8)
 *   ANTHROPIC_BASE_URL           (optional, e.g. a proxy)
 *
 * Body: { messages: { role: "user" | "assistant"; content: string }[] }
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const CLAUDE_DEFAULT_MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `You are "Ava", the AI receptionist demo for Vertex AI — a company that sets up AI phone/text answering, lead capture, booking, and follow-up for small businesses across the USA (home services, clinics, salons, trades, and more).

You are talking to a small-business owner who is trying out the demo on the Vertex AI website. Your job is to show how a Vertex AI assistant would answer their customers and book jobs — and to gently show the owner why this is valuable.

Rules:
- Be warm, concise, and helpful. 1-3 short sentences per reply. Sound human, not robotic.
- If they describe their business, acknowledge it and explain specifically how Vertex would capture and book their leads 24/7.
- If they ask to "book" something or describe a service need (like a customer would), play the receptionist role: collect name, phone, service needed, and preferred time, then confirm the booking enthusiastically.
- Encourage them to start a free Lead Leak Audit (/audit) or book a free call (/contact) when it fits naturally. Don't be pushy.
- Never invent specific prices. Plans start at $299/mo; say setup is done for them and they can go live in days.
- Keep it focused on Vertex AI and small-business automation. Politely redirect off-topic questions.`;

/**
 * Smart scripted engine — used when no ANTHROPIC_API_KEY is set (or Claude errors).
 * Matches the caller's intent across many topics and rotates between phrasings
 * so repeated or unmatched messages never return the same line twice.
 */
function fallbackReply(messages: ChatMessage[]): string {
  const userMsgs = messages.filter((m) => m.role === "user");
  const last = (userMsgs[userMsgs.length - 1]?.content ?? "").toLowerCase();
  const words = last.trim().split(/\s+/).filter(Boolean);
  // Seed rotates as the conversation grows, so variants cycle instead of repeat.
  const seed = userMsgs.length;
  const pick = (pool: string[]): string => pool[seed % pool.length];

  const has = (re: RegExp) => re.test(last);
  const hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(last);

  // Booking with contact details shared → play receptionist and confirm.
  if (hasPhone && has(/book|appoint|schedul|call|quote|estimate|come|fix|repair|install|service|help|need/)) {
    return pick([
      "Perfect, thank you — I've noted your number. In a live setup I'd confirm your name, the service you need, and your preferred time, then text you a booking confirmation right away. Want this running for your own business? Book a free setup call at /contact.",
      "Got it, thanks for the details! Normally I'd lock in your name, service, and a time slot, then send a confirmation text on the spot — 24/7. This is exactly what Vertex would do for your customers. Grab a free call at /contact to set it up.",
    ]);
  }

  // Greetings (only when the message is short so it can't hijack real questions).
  if (words.length <= 4 && has(/\b(hi|hey|hello|yo|howdy|good (morning|afternoon|evening)|sup)\b/)) {
    return pick([
      "Hey there — I'm Ava, Vertex AI's virtual receptionist. Tell me what kind of business you run and I'll show you how I'd answer your calls and texts and book jobs 24/7.",
      "Hi! I'm Ava. Ask me anything about how Vertex answers your phones, captures leads, and books jobs around the clock — or just tell me about your business.",
    ]);
  }

  // Thanks / sign-off.
  if (has(/\b(thanks|thank you|thx|cheers|appreciate)\b/)) {
    return pick([
      "Anytime! Tell me about your business and I'll show you how I'd handle your customers — or book a free call whenever you're ready.",
      "You're welcome! Happy to keep going — ask me anything about how Vertex would work for your business.",
    ]);
  }

  // Pricing.
  if (has(/price|pricing|cost|how much|per month|monthly|fee|charge|expensive|afford/)) {
    return pick([
      "Plans start at $299/mo and setup is done for you — most owners cover it with a single extra booked job. Want to see what missed calls are costing you with a free Lead Leak Audit?",
      "It's $299/mo to start, month-to-month, and we set the whole thing up for you. Most customers make it back on one recovered job. Want to book a quick call to see your exact setup?",
      "Pricing starts at $299/mo with setup included. A free audit shows what after-hours misses are costing you — want me to point you to it?",
    ]);
  }

  // Booking / scheduling intent (no details yet).
  if (has(/book|appoint|schedul|reserve|quote|estimate|set up a call|demo|come out/)) {
    return pick([
      "Love it — in a live setup I'd take your name, number, the service you need, and a preferred time, then drop it straight onto your calendar. Want to book a free setup call to turn this on?",
      "Happy to! Normally I'd grab a few details — name, number, service, best time — and confirm the booking on the spot, 24/7. Want me to point you to book a free call?",
    ]);
  }

  // What is Vertex / how does it work.
  if (has(/what (is|do|are)|how (do|does|would)|explain|tell me (about|more)|what'?s vertex|who are you|what can you/)) {
    return pick([
      "Vertex AI is an AI receptionist for small businesses — it answers every call and text instantly, handles customer questions, captures the lead, and books the job onto your calendar, 24/7. What kind of business do you run?",
      "Here's the gist: when a customer calls or texts, I pick up right away, answer their questions, get their details, and book the appointment — even after hours. Tell me your industry and I'll show you how it'd look.",
    ]);
  }

  // Setup / onboarding / time to go live.
  if (has(/set ?up|onboard|get started|how long|go live|install|implement|training|takes to/)) {
    return pick([
      "Setup is done for you — we build and train your assistant, connect your calendar, and you're usually live in a few days. Want to book a free call to get started?",
      "You don't lift a finger — we handle configuration and go live in days, not weeks. Want the free-call link to kick it off?",
    ]);
  }

  // Integrations / channels / tools.
  if (has(/integrat|calendar|google|outlook|crm|hubspot|zapier|software|tool|sync|phone|number|text|sms|whatsapp|website/)) {
    return pick([
      "Yes — Vertex works over both calls and texts and syncs bookings to your calendar so they land where you already work. Tell me what tools you use and I'll note it for your setup.",
      "It answers phone and text and connects to your calendar and common tools; the team wires up your specific software during setup. What do you use day to day?",
    ]);
  }

  // After-hours / missed calls / value.
  if (has(/after ?hours|24|miss|voicemail|night|weekend|busy|on a job|on-site|lose|losing|leads?/)) {
    return pick([
      "That's exactly the point — Vertex answers nights, weekends, and while you're on a job, so after-hours callers become booked jobs instead of voicemails. Want a free audit of what you're missing now?",
      "Most owners lose real money to missed and after-hours calls. Vertex catches every one, texts back instantly, and books it. Want to see your number with a free Lead Leak Audit?",
    ]);
  }

  // Human / replace staff / is it a robot.
  if (has(/human|real person|replace|staff|employee|receptionist|robot|bot|sound|natural|hand ?off/)) {
    return pick([
      "Vertex doesn't replace your team — it backs them up, catching calls you can't get to and handing off to you when it matters. Customers get a fast, natural response every time. Want to see it work for your business?",
      "It sounds human, stays polite, and knows when to route something to you — a tireless front-desk teammate, not a robot. What kind of business are you running?",
    ]);
  }

  // Contracts / cancellation / commitment.
  if (has(/cancel|contract|commit|lock|obligat|month to month|month-to-month|trial period|refund/)) {
    return pick([
      "No long lock-in — plans are month-to-month. The idea is it pays for itself in booked jobs, not that it traps you. Want to book a call to go over the details?",
      "It's month-to-month, cancel anytime. Most owners stay because it keeps booking jobs. Want the free-call link?",
    ]);
  }

  // Security / privacy / data.
  if (has(/secur|privacy|private|data|safe|gdpr|compliance|confidential/)) {
    return "Good question — customer details are handled securely and only used to answer and book for your business. The team can walk you through the specifics on a quick call. Want the link to /contact?";
  }

  // Free audit / try it.
  if (has(/audit|free|try|trial|test|sample|see it/)) {
    return "The free Lead Leak Audit shows what missed and after-hours calls are costing you — no commitment. Want me to point you to it, or book a quick call?";
  }

  // Contact / talk to a human / sales.
  if (has(/contact|talk to|speak (to|with)|sales|book a call|reach|email|get in touch/)) {
    return "Easiest next step is a free call — the team sets everything up with you. You can book it at /contact. Anything else you'd like to know in the meantime?";
  }

  // Industry mention.
  if (has(/hvac|plumb|roof|electric|garage|clean|landscap|pest|salon|spa|clinic|dental|medical|law|legal|contractor|trades?|repair|auto|mechanic|realtor|real estate|restaurant|business/)) {
    return pick([
      "Perfect — for a business like yours, Vertex answers every call and text, captures the lead, and books the job while you're on-site. You'd never lose another after-hours customer. Want a free audit of what you're missing?",
      "Great fit — service businesses are exactly who this is for. I'd answer your calls, qualify the lead, and book it straight to your calendar. Want to book a free setup call?",
    ]);
  }

  // Catch-all — rotate so an unmatched message never repeats the same line.
  return pick([
    "I'm Ava, Vertex AI's demo assistant — I answer calls and texts and book jobs for small businesses. Tell me what you'd like to know, or what kind of business you run.",
    "Happy to help with that! I'm best at showing how Vertex answers your customers, captures leads, and books jobs 24/7. What would you like to see — pricing, setup, or how it works?",
    "Good question! I focus on how Vertex handles your calls, texts, and bookings. Ask me about pricing, setup, or integrations — or describe your business and I'll tailor it.",
    "Let me point you the right way — I can explain pricing, how setup works, or how Vertex books jobs after hours. Which would help most? You can also tell me your industry.",
  ]);
}

/** The AI: Anthropic Claude. Returns the reply text, or null if unavailable/failed. */
async function tryClaude(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    // Optionally route Claude through a proxy (ANTHROPIC_BASE_URL).
    const client = new Anthropic({
      apiKey,
      baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
    });
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || CLAUDE_DEFAULT_MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages,
    });
    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return reply || null;
  } catch (err) {
    console.error("[chat] claude request failed:", err);
    return null;
  }
}

export async function POST(request: Request) {
  const rate = await checkRateLimit("chat", clientIp(request), { requests: 30, window: "5 m" });
  if (!rate.success) return tooManyRequests(rate.retryAfterSeconds);

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-12);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ ok: false, error: "Send a message to start." }, { status: 422 });
  }

  // Claude, then scripted safety net.
  const claude = await tryClaude(messages);
  if (claude) return NextResponse.json({ ok: true, reply: claude, model: "claude" });

  return NextResponse.json({ ok: true, reply: fallbackReply(messages), demo: true });
}
