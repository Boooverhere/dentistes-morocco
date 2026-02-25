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

export async function getStats(): Promise<{
  total: number;
  verified: number;
  cities: number;
}> {
  const supabase = await createClient();

  const [{ count: total }, { count: verified }, { data: cityRows }] =
    await Promise.all([
      supabase.from("dentists").select("*", { count: "exact", head: true }),
      supabase
        .from("dentists")
        .select("*", { count: "exact", head: true })
        .eq("verified", true),
      supabase.from("dentists").select("city").not("city", "is", null),
    ]);

  const cities = new Set(cityRows?.map((r) => r.city).filter(Boolean)).size;
  return { total: total ?? 0, verified: verified ?? 0, cities };
}

export async function getTopCities(limit = 6): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dentists")
    .select("city")
    .not("city", "is", null);

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    if (row.city) counts[row.city] = (counts[row.city] ?? 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([city]) => city);
}

export async function searchDentists({
  q,
  city,
  neighborhood,
  specialty,
  verified,
  minRating,
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
      `name.ilike.%${q}%,address.ilike.%${q}%,neighborhood.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  if (city) query = query.ilike("city", city);
  if (neighborhood) query = query.ilike("neighborhood", neighborhood);
  if (specialty) query = query.contains("specialties", [specialty]);
  if (verified) query = query.eq("verified", true);
  if (minRating) query = query.gte("rating", minRating);

  const { data, error, count } = await query;

  if (error) {
    console.error("[searchDentists]", error.message);
    return { dentists: [], total: 0 };
  }
  return { dentists: (data ?? []) as Dentist[], total: count ?? 0 };
}
