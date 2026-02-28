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
