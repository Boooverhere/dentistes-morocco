"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "notifications@dentistesmaroc.ma";

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
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");
  if (!adminAuth || adminAuth.value !== process.env.ADMIN_SECRET) {
    redirect("/login");
  }
  return createAdminClient();
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
    slugify(sub.name) + "-" + Math.random().toString(36).slice(2, 7);

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

  // Send approval email (non-blocking)
  if (sub.email) {
    try {
      await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject: "Votre fiche est publiée sur DentistesMaroc.ma",
        html: `
          <p>Bonjour ${sub.name},</p>
          <p>Félicitations ! Votre fiche est maintenant publiée sur <strong>DentistesMaroc.ma</strong>.</p>
          <p>Vous pouvez la consulter et la gérer depuis votre tableau de bord.</p>
          <p><a href="https://dentistesmaroc.ma/dashboard">Accéder à mon tableau de bord</a></p>
          <p>Cordialement,<br/>L'équipe DentistesMaroc.ma</p>
        `,
      });
    } catch {
      // Non-blocking — do not fail the action if email fails
    }
  }

  return { success: true };
}

export async function linkPendingToDentist(pendingId: string, dentistId: string) {
  const supabase = await requireAdmin();

  const { data: sub, error: fetchError } = await supabase
    .from("pending_dentists")
    .select("email, name")
    .eq("id", pendingId)
    .single();

  if (fetchError || !sub) return { error: fetchError?.message ?? "Soumission introuvable." };
  if (!sub.email) return { error: "La soumission n'a pas d'email. Impossible de lier." };

  const { error: dentistError } = await supabase
    .from("dentists")
    .update({ email: sub.email })
    .eq("id", dentistId);

  if (dentistError) return { error: dentistError.message };

  const { error: pendingError } = await supabase
    .from("pending_dentists")
    .update({ status: "approved" })
    .eq("id", pendingId);

  if (pendingError) return { error: pendingError.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectPending(id: string, reason: string) {
  const supabase = await requireAdmin();

  const { data: sub, error: fetchError } = await supabase
    .from("pending_dentists")
    .select("email, name")
    .eq("id", id)
    .single();

  if (fetchError) return { error: fetchError.message };

  const { error } = await supabase
    .from("pending_dentists")
    .update({ status: "rejected", rejection_reason: reason || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");

  // Send rejection email (non-blocking)
  if (sub?.email) {
    try {
      await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject: "Mise à jour de votre demande – DentistesMaroc.ma",
        html: `
          <p>Bonjour ${sub.name},</p>
          <p>Nous avons examiné votre demande de publication sur <strong>DentistesMaroc.ma</strong>.</p>
          ${reason ? `<p><strong>Motif :</strong> ${reason}</p>` : ""}
          <p>Vous pouvez soumettre une nouvelle demande en corrigeant les informations.</p>
          <p><a href="https://dentistesmaroc.ma/ajouter-cabinet">Soumettre à nouveau</a></p>
          <p>Cordialement,<br/>L'équipe DentistesMaroc.ma</p>
        `,
      });
    } catch {
      // Non-blocking — do not fail the action if email fails
    }
  }

  return { success: true };
}
