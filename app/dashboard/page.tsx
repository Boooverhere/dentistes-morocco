import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { ProfileCard } from "./profile-card";
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

        {dentist ? (
          <ProfileCard dentist={dentist as Dentist} />
        ) : pending ? (
          <PendingCard pending={pending} />
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Premium teaser */}
      <div className="border-t border-amber-100 bg-amber-50 px-6 py-4 dark:border-amber-900/30 dark:bg-amber-950/20">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Passez en Premium</span> —
            Apparaissez en tête des résultats et gagnez plus de patients.
          </p>
          <Link
            href="/contact"
            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </div>
  );
}

function PendingCard({ pending }: { pending: PendingDentist }) {
  const submittedDate = new Date(pending.submitted_at).toLocaleDateString(
    "fr-MA",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const isRejected = pending.status === "rejected";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        {isRejected ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
            Demande refusée
          </span>
        ) : (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            En cours de vérification
          </span>
        )}
      </div>

      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        {pending.name}
      </h2>
      <p className="mt-1 text-sm text-zinc-500">Soumis le {submittedDate}</p>

      {isRejected && pending.rejection_reason && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <span className="font-medium">Motif : </span>
          {pending.rejection_reason}
        </div>
      )}

      {!isRejected && (
        <p className="mt-3 text-sm text-zinc-500">
          Notre équipe examine votre demande. Vous recevrez une notification
          une fois votre fiche publiée.
        </p>
      )}

      {isRejected && (
        <Link
          href="/ajouter-cabinet"
          className="mt-5 inline-flex items-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Soumettre à nouveau
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <span className="text-2xl">🦷</span>
      </div>
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        Vous n&apos;avez pas encore de fiche
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
        Créez votre profil sur DentistesMaroc.ma pour attirer de nouveaux
        patients. C&apos;est gratuit.
      </p>
      <Link
        href="/ajouter-cabinet"
        className="mt-6 inline-flex items-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Ajouter mon cabinet
      </Link>
    </div>
  );
}
