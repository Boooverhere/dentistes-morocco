"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSpecialties(raw: string | null): string[] | null {
  if (!raw) return null;
  const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return arr.length ? arr : null;
}

function formToDentist(formData: FormData, generateSlug = false) {
  const name = (formData.get("name") as string).trim();
  return {
    name,
    ...(generateSlug && {
      slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 7),
    }),
    address: (formData.get("address") as string) || null,
    city: (formData.get("city") as string) || null,
    neighborhood: (formData.get("neighborhood") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    website: (formData.get("website") as string) || null,
    specialties: parseSpecialties(formData.get("specialties") as string),
    rating: formData.get("rating") ? parseFloat(formData.get("rating") as string) : null,
    review_count: formData.get("review_count") ? parseInt(formData.get("review_count") as string) : null,
    latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
    longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
    photo_url: (formData.get("photo_url") as string) || null,
    verified: formData.get("verified") === "true",
  };
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

export async function createDentist(_: unknown, formData: FormData) {
  const supabase = await requireAdmin();
  const dentist = formToDentist(formData, true);

  const { error } = await supabase.from("dentists").insert(dentist);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/search");
  return { success: true };
}

export async function updateDentist(_: unknown, formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;
  const dentist = formToDentist(formData, false);

  const { error } = await supabase.from("dentists").update(dentist).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/dentiste/${formData.get("slug")}`);
  revalidatePath("/search");
  return { success: true };
}

export async function deleteDentist(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("dentists").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/search");
  return { success: true };
}

export async function toggleVerified(id: string, verified: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("dentists")
    .update({ verified })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/search");
  return { success: true };
}

export async function approvePending(id: string) {
  const supabase = await requireAdmin();

  const { data: sub, error: fetchError } = await supabase
    .from("pending_dentists")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !sub) return { error: fetchError?.message ?? "Introuvable." };

  const slug =
    sub.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 7);

  const { error: insertError } = await supabase.from("dentists").insert({
    name: sub.name,
    slug,
    city: sub.city,
    neighborhood: sub.neighborhood,
    address: sub.address,
    phone: sub.phone,
    email: sub.email,
    website: sub.website,
    specialties: sub.specialties,
    latitude: sub.latitude,
    longitude: sub.longitude,
    photo_url: sub.photo_url,
    verified: false,
  });

  if (insertError) return { error: insertError.message };

  const { error: updateError } = await supabase
    .from("pending_dentists")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/search");
  return { success: true };
}

export async function rejectPending(id: string, reason: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("pending_dentists")
    .update({ status: "rejected", rejection_reason: reason || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
