/**
 * Transactional email for Vertex AI (welcome / onboarding messages).
 *
 * Uses Resend (https://resend.com) when RESEND_API_KEY is configured. With no
 * key set it degrades gracefully: the message is logged and the caller
 * continues — a missing email provider must never break a paid signup.
 *
 * Required env when enabling:
 *   RESEND_API_KEY   — your Resend API key
 *   EMAIL_FROM       — verified sender, e.g. "Vertex AI <hello@yourdomain.com>"
 */

export type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(args: SendEmailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.log(
      `[email] (not sent — RESEND_API_KEY/EMAIL_FROM unset) to=${args.to} subject="${args.subject}"`
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      console.error("[email] resend error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** Branded welcome email sent automatically the moment a subscription starts. */
export function welcomeEmail(opts: { name?: string; plan: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const first = (opts.name || "there").split(" ")[0];
  const plan = opts.plan;
  const subject = `Welcome to Vertex AI — your ${plan} plan is live 🎉`;

  const steps = [
    "Reply to this email with your business name, website, and the phone number you want your AI assistant to use.",
    "We'll configure your AI receptionist + lead capture and send you a quick link to confirm the details.",
    "You go live — usually within a couple of business days. Every lead gets captured and followed up, 24/7.",
  ];

  const text = [
    `Hi ${first},`,
    "",
    `Thanks for subscribing to Vertex AI (${plan}). Your account is active.`,
    "",
    "Here's what happens next:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "You can manage or cancel your subscription anytime here:",
    `${siteBilling()}`,
    "",
    "— The Vertex AI team",
  ].join("\n");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <h1 style="font-size:22px;margin:0 0 4px">Welcome to Vertex AI 🎉</h1>
    <p style="color:#475569;margin:0 0 20px">Your <strong>${plan}</strong> plan is active.</p>
    <p style="margin:0 0 12px">Hi ${first}, thanks for joining. Here's what happens next:</p>
    <ol style="color:#334155;line-height:1.6;padding-left:18px;margin:0 0 20px">
      ${steps.map((s) => `<li style="margin-bottom:8px">${s}</li>`).join("")}
    </ol>
    <p style="margin:0 0 8px">Just reply to this email to get started — a real person reads it.</p>
    <p style="color:#64748b;font-size:13px;margin:24px 0 0">
      Manage or cancel anytime:
      <a href="${siteBilling()}" style="color:#2563eb">${siteBilling()}</a>
    </p>
  </div>`;

  return { subject, html, text };
}

function siteBilling(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://getvertex.vercel.app";
  return `${base}/billing`;
}
