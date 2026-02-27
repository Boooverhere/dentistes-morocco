"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;

  // Admin credentials check — bypasses Supabase auth
  console.log("[login] admin check", {
    emailMatch: email === process.env.ADMIN_EMAIL,
    passwordMatch: password === process.env.ADMIN_PASSWORD,
    envEmailSet: !!process.env.ADMIN_EMAIL,
    envPasswordSet: !!process.env.ADMIN_PASSWORD,
    envSecretSet: !!process.env.ADMIN_SECRET,
  });
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    redirect("/admin");
  }

  // Regular dentist login via Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/signup?message=Vérifiez+votre+email+pour+confirmer+votre+compte.");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
