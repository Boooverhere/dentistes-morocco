"use server";

import { createClient } from "@/lib/supabase/server";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function submitCabinet(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = (formData.get("name") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  if (!name || !city || !phone) {
    return { error: "Nom, ville et téléphone sont obligatoires." };
  }

  const slug =
    slugify(name) + "-" + Math.random().toString(36).slice(2, 7);

  const specialtiesRaw = (formData.get("specialties") as string) ?? "";
  const specialties = specialtiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();

  const { error } = await supabase.from("dentists").insert({
    name,
    slug,
    city,
    neighborhood: (formData.get("neighborhood") as string) || null,
    address: (formData.get("address") as string) || null,
    phone,
    email: email || null,
    website: (formData.get("website") as string) || null,
    specialties: specialties.length ? specialties : null,
    verified: false,
  });

  if (error) {
    console.error("[submitCabinet]", error.message);
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  return { success: true };
}
