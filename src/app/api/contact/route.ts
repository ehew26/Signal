import { NextResponse } from "next/server";

/**
 * Lead capture endpoint.
 *
 * Validates the payload and persists the lead. In production this would write
 * to a database (e.g. Supabase) and/or notify the team via email/Slack. To keep
 * the project front-end-only and dependency-light, persistence is best-effort:
 *  - In local dev we append to a gitignored JSON file (real persistence).
 *  - On serverless (read-only FS) we log and accept gracefully.
 * Swap the `persistLead` body for a Supabase insert when a backend is wired up.
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

async function persistLead(lead: Lead) {
  const record = { ...lead, receivedAt: new Date().toISOString() };
  try {
    // Local dev persistence — harmless no-op on read-only serverless FS.
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
    // Serverless / read-only environment: log so it shows up in platform logs.
    console.log("[lead]", JSON.stringify(record));
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
