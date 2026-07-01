import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Live AI chat demo — lets a prospect talk to a Vertex-style AI receptionist.
 *
 * Backend chain (each step used only if the one before is unavailable/errors):
 *   1. NVIDIA DeepSeek v4 Pro   (NVIDIA_API_KEY)   — primary
 *   2. Anthropic Claude         (ANTHROPIC_API_KEY) — backup
 *   3. Smart scripted replies   (always) — so the widget never breaks
 *
 * Env:
 *   NVIDIA_API_KEY / NVIDIA_MODEL (default deepseek-ai/deepseek-v4-pro)
 *   ANTHROPIC_API_KEY
 *
 * Body: { messages: { role: "user" | "assistant"; content: string }[] }
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const NVIDIA_DEFAULT_BASE = "https://integrate.api.nvidia.com/v1";
const NVIDIA_DEFAULT_MODEL = "deepseek-ai/deepseek-v4-pro";
const CLAUDE_MODEL = "claude-opus-4-8";

/**
 * OpenAI-compatible base URL for the DeepSeek call. Point HEADROOM_PROXY_URL
 * (or NVIDIA_BASE_URL) at a running `headroom proxy` to compress context and
 * cut token cost 60-95%; defaults to NVIDIA direct so nothing breaks unset.
 */
function nvidiaEndpoint(): string {
  const base = (
    process.env.HEADROOM_PROXY_URL ||
    process.env.NVIDIA_BASE_URL ||
    NVIDIA_DEFAULT_BASE
  ).replace(/\/+$/, "");
  return `${base}/chat/completions`;
}

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

/** Primary: NVIDIA DeepSeek. Returns the reply text, or null if unavailable/failed. */
async function tryNvidia(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(nvidiaEndpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || NVIDIA_DEFAULT_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 800,
        chat_template_kwargs: { thinking: false },
        stream: false,
      }),
    });
    if (!res.ok) {
      console.error("[chat] nvidia error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const reply = (data?.choices?.[0]?.message?.content ?? "").trim();
    return reply || null;
  } catch (err) {
    console.error("[chat] nvidia request failed:", err);
    return null;
  }
}

/** Backup: Anthropic Claude. Returns the reply text, or null if unavailable/failed. */
async function tryClaude(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    // Optionally route Claude through Headroom too (ANTHROPIC_BASE_URL → proxy).
    const client = new Anthropic({
      apiKey,
      baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
    });
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
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

  // NVIDIA first, then Claude, then scripted.
  const nvidia = await tryNvidia(messages);
  if (nvidia) return NextResponse.json({ ok: true, reply: nvidia, model: "nvidia" });

  const claude = await tryClaude(messages);
  if (claude) return NextResponse.json({ ok: true, reply: claude, model: "claude" });

  return NextResponse.json({ ok: true, reply: fallbackReply(messages), demo: true });
}
