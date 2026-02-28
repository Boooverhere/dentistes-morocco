"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementView(dentistId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_dentist_views", { dentist_id: dentistId });
}

export async function incrementLead(dentistId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_dentist_leads", { dentist_id: dentistId });
}

export async function submitLead(
  _: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const dentistId = formData.get("dentist_id") as string;
  if (!dentistId) return { error: "Dentiste introuvable." };

  const { error } = await supabase.from("leads").insert({
    dentist_id: dentistId,
    patient_name: (formData.get("patient_name") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    message: (formData.get("message") as string)?.trim() || null,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function claimListing(formData: FormData) {
  const payload = {
    dentistId: formData.get("dentistId"),
    dentistName: formData.get("dentistName"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    submittedAt: new Date().toISOString(),
  };

  // TODO: replace with email (Resend/Nodemailer) or save to Supabase claims table
  console.log("[claim-listing]", payload);
}
