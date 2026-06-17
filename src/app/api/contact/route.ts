import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Lead capture endpoint.
 *
 * Persists submissions to the Supabase `leads` table (anon INSERT is allowed by
 * RLS; SELECT is not, so submissions stay private). If the Supabase write fails
 * for any reason, we fall back to a local file (dev) or a log line (serverless)
 * so a lead is never silently dropped.
 */

export type Lead = {
  name: string;
  email: string;
  company?: string;
  reason?: string;
  budget?: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<Lead>): { ok: true; lead: Lead } | { ok: false; error: string } {
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (message.length < 10) return { ok: false, error: "Tell us a little more (at least 10 characters)." };

  return {
    ok: true,
    lead: {
      name,
      email,
      company: (body.company ?? "").trim() || undefined,
      reason: (body.reason ?? "").trim() || undefined,
      budget: (body.budget ?? "").trim() || undefined,
      message,
    },
  };
}

async function persistToFileOrLog(lead: Lead) {
  const record = { ...lead, receivedAt: new Date().toISOString() };
  try {
    const { writeFile, mkdir, readFile } = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), ".data");
    const file = path.join(dir, "leads.json");
    await mkdir(dir, { recursive: true });
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await readFile(file, "utf8"));
    } catch {
      existing = [];
    }
    existing.push(record);
    await writeFile(file, JSON.stringify(existing, null, 2));
  } catch {
    console.log("[lead]", JSON.stringify(record));
  }
}

async function persistLead(lead: Lead) {
  try {
    const { error } = await getSupabase().from("leads").insert(lead);
    if (error) throw error;
  } catch (err) {
    console.error("[lead] supabase insert failed, falling back:", err);
    await persistToFileOrLog(lead);
  }
}

export async function POST(request: Request) {
  let body: Partial<Lead>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  }

  await persistLead(result.lead);

  return NextResponse.json({
    ok: true,
    message: "Thanks — we'll be in touch within one business day.",
  });
}
