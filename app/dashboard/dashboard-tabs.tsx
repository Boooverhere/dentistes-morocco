"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  Check,
  X,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProfileCard } from "./profile-card";
import { changePassword, markLeadRead } from "./actions";
import type { Dentist, Lead, PendingDentist } from "@/lib/types";

interface Props {
  dentist: Dentist | null;
  pending: PendingDentist | null;
  leads: Lead[];
}

export function DashboardTabs({ dentist, pending, leads }: Props) {
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
          {leads.filter((l) => l.status === "new").length > 0 && (
            <span className="ml-1.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {leads.filter((l) => l.status === "new").length}
            </span>
          )}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Vues</span>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {dentist.views_count}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Contacts</span>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {dentist.leads_count}
                  </p>
                </div>
              </div>

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
        {dentist ? <ProfileCard dentist={dentist} /> : <EmptyListingCTA />}
      </TabsContent>

      {/* ── Demandes ── */}
      <TabsContent value="demandes">
        <LeadsTable leads={leads} hasDentist={!!dentist} pending={pending} />
      </TabsContent>

      {/* ── Abonnements ── */}
      <TabsContent value="abonnements">
        <PlanTab dentist={dentist} />
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

/* ── Leads table ── */
function LeadsTable({
  leads,
  hasDentist,
  pending,
}: {
  leads: Lead[];
  hasDentist: boolean;
  pending: PendingDentist | null;
}) {
  const router = useRouter();
  const [transitioning, startTransition] = useTransition();

  async function handleMarkRead(id: string) {
    const result = await markLeadRead(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Demande marquée comme lue.");
      startTransition(() => router.refresh());
    }
  }

  if (!hasDentist) {
    return (
      <div className="space-y-4">
        {pending && <PendingCard pending={pending} />}
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <Inbox className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-500">
            Les demandes de patients apparaîtront ici une fois votre fiche publiée.
          </p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <Inbox className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          Aucune demande pour l&apos;instant
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Les messages de patients envoyés depuis votre fiche apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Demandes patients{" "}
          <span className="text-sm font-normal text-zinc-500">({leads.length})</span>
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead className="hidden sm:table-cell">Message</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className={lead.status === "new" ? "font-medium" : ""}>
              <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                {new Date(lead.created_at).toLocaleDateString("fr-MA", {
                  day: "numeric",
                  month: "short",
                })}
              </TableCell>
              <TableCell>
                <p className="text-sm">{lead.patient_name ?? "—"}</p>
                {lead.email && (
                  <p className="text-xs text-zinc-500 truncate max-w-[140px]">{lead.email}</p>
                )}
                {lead.phone && (
                  <p className="text-xs text-zinc-500">{lead.phone}</p>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell max-w-[200px]">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {lead.message ?? "—"}
                </p>
              </TableCell>
              <TableCell>
                {lead.status === "new" ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Nouveau
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                    Lu
                  </span>
                )}
              </TableCell>
              <TableCell>
                {lead.status === "new" && (
                  <button
                    onClick={() => handleMarkRead(lead.id)}
                    disabled={transitioning}
                    className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    <Check className="h-3 w-3" />
                    Marquer lu
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ── Plan tab ── */
function PlanTab({ dentist }: { dentist: Dentist | null }) {
  const isPremium =
    dentist?.premium_until != null && new Date(dentist.premium_until) > new Date();

  const features = [
    { label: "Fiche de base", free: true, premium: true },
    { label: "Mise en avant dans les résultats", free: false, premium: true },
    { label: "Badge vérifié prioritaire", free: false, premium: true },
    { label: "Photos multiples", free: true, premium: true },
    { label: "Statistiques de visibilité", free: false, premium: true },
    { label: "Support prioritaire", free: false, premium: true },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Current plan badge */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Votre abonnement actuel
        </p>
        {isPremium ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Crown className="h-4 w-4" />
              Premium
            </span>
            <span className="text-sm text-zinc-500">
              jusqu&apos;au{" "}
              {new Date(dentist!.premium_until!).toLocaleDateString("fr-MA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Gratuit
          </span>
        )}
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-4" />
          <div className="p-4 text-center text-sm font-semibold text-zinc-500">Gratuit</div>
          <div className="p-4 text-center text-sm font-bold text-amber-600">Premium</div>
        </div>
        {features.map(({ label, free, premium }) => (
          <div
            key={label}
            className="grid grid-cols-3 border-b border-zinc-50 last:border-0 dark:border-zinc-800/50"
          >
            <div className="p-3 pl-4 text-sm text-zinc-700 dark:text-zinc-300">{label}</div>
            <div className="flex items-center justify-center p-3">
              {free ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <X className="h-4 w-4 text-zinc-300" />
              )}
            </div>
            <div className="flex items-center justify-center p-3">
              {premium ? (
                <Check className="h-4 w-4 text-amber-500" />
              ) : (
                <X className="h-4 w-4 text-zinc-300" />
              )}
            </div>
          </div>
        ))}
      </div>

      {!isPremium && (
        <Link
          href="/premium"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Crown className="h-4 w-4" />
          Passer Premium
        </Link>
      )}
    </div>
  );
}

/* ── Password form ── */
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

/* ── Pending card (shown in Demandes when no listing yet) ── */
function PendingCard({ pending }: { pending: PendingDentist }) {
  const submittedDate = new Date(pending.submitted_at).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{pending.name}</h2>
      <p className="mt-1 text-sm text-zinc-500">Soumis le {submittedDate}</p>
      {isRejected && pending.rejection_reason && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <span className="font-medium">Motif : </span>
          {pending.rejection_reason}
        </div>
      )}
      {!isRejected && (
        <p className="mt-3 text-sm text-zinc-500">
          Notre équipe examine votre demande. Vous recevrez un email une fois votre fiche publiée.
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

/* ── Empty CTA ── */
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
        Créez votre profil sur DentistesMaroc.ma pour attirer de nouveaux patients.
        C&apos;est gratuit.
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
