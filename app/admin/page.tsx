import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { DentistsTable } from "./dentists-table";
import type { Dentist } from "@/lib/types";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false },
};

async function getAllDentists(): Promise<Dentist[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dentists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/getAllDentists]", error.message);
    return [];
  }
  return (data ?? []) as Dentist[];
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dentists = await getAllDentists();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold text-emerald-700 dark:text-emerald-400"
            >
              Dentistes Rabat
            </Link>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-500 sm:block">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Gestion des dentistes
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Ajoutez, modifiez ou supprimez des fiches. Les modifications sont
            répercutées immédiatement sur le site.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 dark:bg-zinc-900">
          <DentistsTable dentists={dentists} />
        </div>
      </main>
    </div>
  );
}
