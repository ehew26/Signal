/**
 * n8n webhook dispatch for Vertex AI.
 *
 * When N8N_WEBHOOK_URL is set, key events (new leads, new paying customers) are
 * POSTed to your n8n workflow so you can automate everything downstream — SMS
 * follow-up, CRM enrichment, calendar booking, Slack/Sheets, etc. — visually,
 * with no code changes here. With no URL configured this is a no-op, so the
 * site works unchanged until you connect n8n.
 *
 * Setup: in n8n, add a "Webhook" trigger node, copy its Production URL into
 * N8N_WEBHOOK_URL in Vercel, and redeploy. Optionally set N8N_WEBHOOK_SECRET —
 * it's sent as the `x-vertex-signature` header so your workflow can verify the
 * request came from this site.
 *
 * Fire-and-forget: never blocks the response or throws into the caller.
 */

export type N8nEvent =
  | "lead.created"
  | "customer.subscribed"
  | (string & {});

export async function notifyN8n(
  event: N8nEvent,
  data: Record<string, unknown>
): Promise<boolean> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return false;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) headers["x-vertex-signature"] = secret;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        event,
        data,
        source: "getvertex.ai",
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error("[n8n] webhook returned", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[n8n] webhook failed:", err);
    return false;
  }
}
