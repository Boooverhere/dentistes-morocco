"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ExternalLink,
  Eye,
  Phone,
  Star,
  ShieldCheck,
  Crown,
  Settings,
  BarChart2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileCard } from "./profile-card";
import { changePassword } from "./actions";
import type { Dentist, PendingDentist } from "@/lib/types";

interface Props {
  dentist: Dentist | null;
  pending: PendingDentist | null;
}

export function DashboardTabs({ dentist, pending }: Props) {
  return (
    <Tabs defaultValue="accueil" className="w-full">
      <TabsList className="mb-6 flex w-full h-auto flex-wrap gap-1 bg-zinc-100 p-1 dark:bg-zinc-800">
        <TabsTrigger value="accueil" className="flex-1 text-xs sm:text-sm">
          Accueil
        </TabsTrigger>
        <TabsTrigger value="fiche" className="flex-1 text-xs sm:text-sm">
          Ma Fiche
        </TabsTrigger>
        <TabsTrigger value="demandes" className="flex-1 text-xs sm:text-sm">
          Demandes
        </TabsTrigger>
        <TabsTrigger value="abonnements" className="flex-1 text-xs sm:text-sm">
          Abonnements
        </TabsTrigger>
        <TabsTrigger value="parametres" className="flex-1 text-xs sm:text-sm">
          Paramètres
        </TabsTrigger>
      </TabsList>

      {/* ── Accueil ── */}
      <TabsContent value="accueil">
        <div className="flex flex-col gap-6">
          {dentist ? (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Vues
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {dentist.views_count}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Contacts
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {dentist.leads_count}
                  </p>
                </div>
              </div>

              {/* Listing status */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Fiche publiée
                  </span>
                  <Link
                    href={`/dentiste/${dentist.slug}`}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    Voir ma fiche
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <h2 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {dentist.name}
                </h2>
                <p className="text-sm text-zinc-500">
                  {[dentist.city, dentist.neighborhood].filter(Boolean).join(" · ")}
                </p>
              </div>
            </>
          ) : (
            <EmptyListingCTA />
          )}
        </div>
      </TabsContent>

      {/* ── Ma Fiche ── */}
      <TabsContent value="fiche">
        {dentist ? (
          <ProfileCard dentist={dentist} />
        ) : (
          <EmptyListingCTA />
        )}
      </TabsContent>

      {/* ── Demandes ── */}
      <TabsContent value="demandes">
        {pending ? (
          <PendingCard pending={pending} />
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">
              Aucune demande en cours.
            </p>
          </div>
        )}
      </TabsContent>

      {/* ── Abonnements ── */}
      <TabsContent value="abonnements">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Offre Premium
            </h2>
          </div>
          <ul className="space-y-2.5 mb-6">
            {[
              { icon: Star, text: "Mise en avant en tête des résultats de recherche" },
              { icon: BarChart2, text: "Statistiques détaillées de visibilité" },
              { icon: ShieldCheck, text: "Badge vérifié prioritaire" },
              { icon: Phone, text: "Support prioritaire par téléphone" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {text}
              </li>
            ))}
          </ul>
          <Link
            href="/premium"
            className="inline-flex items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Découvrir l&apos;offre Premium
          </Link>
        </div>
      </TabsContent>

      {/* ── Paramètres ── */}
      <TabsContent value="parametres">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Paramètres du compte
            </h2>
          </div>
          <PasswordForm />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Changer le mot de passe
      </h3>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Mot de passe mis à jour avec succès.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Nouveau mot de passe
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Confirmer le mot de passe
        </label>
        <input
          name="confirm"
          type="password"
          required
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Mise à jour…" : "Mettre à jour"}
      </button>
    </form>
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

function EmptyListingCTA() {
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
