"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Veuillez entrer votre nom (min. 2 caractères)."),
  email: z.string().email("Adresse email invalide."),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});

export type ContactState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
} | null;

export async function sendContact(
  _: ContactState,
  formData: FormData
): Promise<ContactState> {
  const result = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.success) {
    const flat = result.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  // Log submission — swap in Resend / nodemailer when ready
  console.log("[contact]", {
    name: result.data.name,
    email: result.data.email,
    message: result.data.message,
    at: new Date().toISOString(),
  });

  return { success: true };
}
