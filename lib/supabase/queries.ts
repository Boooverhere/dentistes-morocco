import { createClient } from "@/lib/supabase/server";
import type { Dentist, DentistFilters } from "@/lib/types";

/** Top dentists for the homepage: verified OR rating ≥ 4.5 */
export async function getFeaturedDentists(limit = 8): Promise<Dentist[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dentists")
    .select("*")
    .or("verified.eq.true,rating.gte.4.5")
    .order("verified", { ascending: false })
    .order("rating", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedDentists]", error.message);
    return [];
  }
  return (data ?? []) as Dentist[];
}

/** Fallback: all dentists when none match the featured filter */
export async function getDentists({
  limit = 9,
  offset = 0,
}: Pick<DentistFilters, "limit" | "offset"> = {}): Promise<Dentist[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dentists")
    .select("*")
    .order("verified", { ascending: false })
    .order("rating", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[getDentists]", error.message);
    return [];
  }
  return (data ?? []) as Dentist[];
}

export async function getDentistBySlug(slug: string): Promise<Dentist | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dentists")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[getDentistBySlug]", error.message);
    return null;
  }
  return data as Dentist;
}

export async function searchDentists({
  q,
  neighborhood,
  specialty,
  verified,
  limit = 20,
  offset = 0,
}: DentistFilters): Promise<{ dentists: Dentist[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("dentists")
    .select("*", { count: "exact" })
    .order("verified", { ascending: false })
    .order("rating", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,address.ilike.%${q}%,neighborhood.ilike.%${q}%`
    );
  }
  if (neighborhood) query = query.ilike("neighborhood", neighborhood);
  if (specialty) query = query.contains("specialties", [specialty]);
  if (verified) query = query.eq("verified", true);

  const { data, error, count } = await query;

  if (error) {
    console.error("[searchDentists]", error.message);
    return { dentists: [], total: 0 };
  }
  return { dentists: (data ?? []) as Dentist[], total: count ?? 0 };
}
