"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePhotoUrl(
  photoUrl: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("dentists")
    .update({ photo_url: photoUrl })
    .eq("email", user.email);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function changePassword(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (password.length < 8)
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm)
    return { error: "Les mots de passe ne correspondent pas." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateMyListing(
  _: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Non authentifié." };
  }

  const specialtiesRaw = (formData.get("specialties") as string) ?? "";
  const specialties = specialtiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    name: (formData.get("name") as string)?.trim() || undefined,
    address: (formData.get("address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    neighborhood: (formData.get("neighborhood") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    website: (formData.get("website") as string)?.trim() || null,
    specialties: specialties.length ? specialties : null,
  };

  const { data: updated, error } = await supabase
    .from("dentists")
    .update(payload)
    .eq("email", user.email)
    .select("slug");

  if (error) {
    console.error("[updateMyListing]", error.message);
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath("/dashboard");
  updated?.forEach((row) => {
    if (row.slug) revalidatePath(`/dentiste/${row.slug}`);
  });

  return { success: true };
}
