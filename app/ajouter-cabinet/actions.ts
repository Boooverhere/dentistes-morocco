"use server";

import { createClient } from "@/lib/supabase/server";

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

  const specialtiesRaw = (formData.get("specialties") as string) ?? "";
  const specialties = specialtiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("pending_dentists").insert({
    name,
    city,
    neighborhood: (formData.get("neighborhood") as string) || null,
    address: (formData.get("address") as string) || null,
    phone,
    email: email || null,
    website: (formData.get("website") as string) || null,
    specialties: specialties.length ? specialties : null,
    status: "pending",
    submitted_by: user?.id ?? null,
  });

  if (error) {
    console.error("[submitCabinet]", error.message);
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  return { success: true };
}
