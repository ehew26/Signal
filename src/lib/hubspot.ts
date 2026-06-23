/**
 * HubSpot CRM sync for Vertex AI leads.
 *
 * When HUBSPOT_TOKEN is set (a HubSpot Private App token with crm.objects.
 * contacts write scope), every lead from /contact and /audit is upserted as a
 * HubSpot contact so it lands in a real pipeline — not just Supabase. With no
 * token configured this is a no-op, so the site works unchanged until you
 * connect HubSpot.
 *
 * Setup: HubSpot → Settings → Integrations → Private Apps → create an app with
 * the `crm.objects.contacts.write` scope, copy the token into HUBSPOT_TOKEN in
 * Vercel, and redeploy.
 */

export type HubspotLead = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  reason?: string;
  message: string;
};

export async function syncLeadToHubspot(lead: HubspotLead): Promise<boolean> {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return false;

  const [firstname, ...rest] = lead.name.trim().split(/\s+/);
  const lastname = rest.join(" ");

  const properties: Record<string, string> = {
    email: lead.email,
    firstname: firstname || lead.name,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
  };
  if (lastname) properties.lastname = lastname;
  if (lead.phone) properties.phone = lead.phone;
  if (lead.company) properties.company = lead.company;
  // Source/context into a standard notes field so it's visible on the contact.
  properties.message = `[${lead.reason || "Website lead"}] ${lead.message}`.slice(0, 65000);

  try {
    // Upsert by email so repeat submissions update the same contact.
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(lead.email)}?idProperty=email`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      }
    );

    if (res.status === 404) {
      // No existing contact — create one.
      const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      });
      if (!createRes.ok) {
        console.error("[hubspot] create failed:", createRes.status, await createRes.text());
        return false;
      }
      return true;
    }

    if (!res.ok) {
      console.error("[hubspot] upsert failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[hubspot] sync error:", err);
    return false;
  }
}
