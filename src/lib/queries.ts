/**
 * Server-side data access. Reads from Supabase when available and falls back to
 * the mock data in data.ts, so the app always renders — live in production,
 * static in local dev without env.
 */
import { getSupabase } from "@/lib/supabase";
import { projects as mockProjects, type Project, type ProjectStatus } from "@/lib/data";

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await getSupabase()
      .from("projects")
      .select("id, client, engagement, status, progress, owner, value, due")
      .order("sort", { ascending: true });
    if (error || !data || data.length === 0) return mockProjects;
    return data.map((p) => ({
      id: p.id,
      client: p.client,
      engagement: p.engagement,
      status: p.status as ProjectStatus,
      progress: p.progress,
      owner: p.owner,
      value: p.value,
      due: p.due,
    }));
  } catch {
    return mockProjects;
  }
}

/** Live count of leads in the last 30 days, or null if unavailable. */
export async function getNewLeadsCount(): Promise<number | null> {
  try {
    const { data, error } = await getSupabase().rpc("new_leads_count");
    if (error || typeof data !== "number") return null;
    return data;
  } catch {
    return null;
  }
}
