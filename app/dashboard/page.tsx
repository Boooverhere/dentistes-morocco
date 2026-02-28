import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { DashboardTabs } from "./dashboard-tabs";
import type { Dentist, PendingDentist } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: dentist }, { data: pendingRows }] = await Promise.all([
    supabase
      .from("dentists")
      .select("*")
      .eq("email", user.email!)
      .maybeSingle(),
    supabase
      .from("pending_dentists")
      .select("*")
      .eq("email", user.email!)
      .order("submitted_at", { ascending: false })
      .limit(1),
  ]);

  const pending = (pendingRows as PendingDentist[] | null)?.[0] ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              DentistesMaroc.ma
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Espace dentiste
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-500 sm:block">
              {user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Mon tableau de bord
        </h1>
        <DashboardTabs
          dentist={dentist as Dentist | null}
          pending={pending}
        />
      </main>
    </div>
  );
}
