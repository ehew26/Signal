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
 *   2. Smart scripted replies (always) — safety net so the widget never breaks
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

function fallbackReply(messages: ChatMessage[]): string {
  const last = messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() ?? "";
  if (/price|cost|how much|pricing/.test(last)) {
    return "Plans start at $299/mo and setup is done for you — most owners cover it with a single extra booked job. Want to see what missed calls are costing you? Try the free Lead Leak Audit.";
  }
  if (/book|appointment|schedule|quote|estimate/.test(last)) {
    return "Happy to help with that! In a live setup I'd grab your name, number, and the service you need, then book it straight onto the calendar — 24/7, even after hours. Want to book a free call to set this up?";
  }
  if (/hvac|plumb|roof|electric|garage|clean|landscap|pest/.test(last)) {
    return "Perfect — for a business like yours, Vertex answers every call and text instantly, captures the lead, and books the job while you're on-site. You'd never lose another after-hours customer. Want a free audit of what you're missing now?";
  }
  return "Hi! I'm Ava, Vertex AI's demo assistant. Tell me about your business (e.g. \"I run an HVAC company\") and I'll show you how I'd answer your customers and book jobs 24/7.";
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
