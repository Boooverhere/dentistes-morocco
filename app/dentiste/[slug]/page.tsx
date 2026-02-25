import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { getDentistBySlug } from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClaimDialog } from "@/components/claim-dialog";
import { DentistMap } from "@/components/map-wrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dentist = await getDentistBySlug(slug);
  if (!dentist) return { title: "Dentiste introuvable" };
  return {
    title: `${dentist.name} – Dentiste à Rabat | Dentistes Rabat`,
    description: `Fiche complète de ${dentist.name}, dentiste${dentist.neighborhood ? ` à ${dentist.neighborhood}` : ""} à Rabat. Téléphone, adresse, spécialités.`,
    openGraph: {
      title: dentist.name,
      description: `Dentiste à Rabat${dentist.neighborhood ? ` – ${dentist.neighborhood}` : ""}`,
      images: dentist.photo_url ? [dentist.photo_url] : [],
    },
  };
}

export default async function DentistePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dentist = await getDentistBySlug(slug);
  if (!dentist) notFound();

  const whatsappUrl = dentist.phone
    ? `https://wa.me/${dentist.phone.replace(/\D/g, "")}`
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-sm font-medium truncate">{dentist.name}</span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column – main info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Hero card */}
            <div className="rounded-2xl border border-border bg-white p-6 dark:bg-zinc-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {dentist.photo_url && (
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dentist.photo_url}
                      alt={dentist.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {dentist.name}
                    </h1>
                    {dentist.verified && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Vérifié
                      </Badge>
                    )}
                  </div>

                  {dentist.rating && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(dentist.rating!)
                                ? "fill-amber-400 stroke-amber-500"
                                : "stroke-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-zinc-500">
                        {dentist.rating.toFixed(1)}
                        {dentist.review_count
                          ? ` (${dentist.review_count} avis)`
                          : ""}
                      </span>
                    </div>
                  )}

                  {dentist.neighborhood && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {dentist.neighborhood}, Rabat
                    </p>
                  )}
                </div>
              </div>

              {/* Specialties */}
              {dentist.specialties && dentist.specialties.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Spécialités
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dentist.specialties.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Map */}
            {dentist.latitude && dentist.longitude && (
              <div className="rounded-2xl border border-border bg-white p-4 dark:bg-zinc-900">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Localisation
                </p>
                {dentist.address && (
                  <p className="mb-3 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                    {dentist.address}
                  </p>
                )}
                <div className="h-64 overflow-hidden rounded-xl">
                  <DentistMap
                    lat={dentist.latitude}
                    lng={dentist.longitude}
                    name={dentist.name}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column – contact + claim */}
          <div className="flex flex-col gap-4">
            {/* Contact card */}
            <div className="rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Contact
              </p>
              <div className="flex flex-col gap-3">
                {dentist.phone && (
                  <>
                    <a
                      href={`tel:${dentist.phone}`}
                      className="flex items-center gap-2.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      <Phone className="h-4 w-4" />
                      {dentist.phone}
                    </a>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </>
                )}
                {dentist.email && (
                  <a
                    href={`mailto:${dentist.email}`}
                    className="flex items-center gap-2.5 rounded-lg border border-border px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-accent dark:text-zinc-300"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{dentist.email}</span>
                  </a>
                )}
                {dentist.website && (
                  <a
                    href={dentist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-lg border border-border px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-accent dark:text-zinc-300"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {dentist.website.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Claim card */}
            {!dentist.verified && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
                <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vous êtes ce dentiste ?
                </p>
                <p className="mb-4 text-xs text-zinc-400">
                  Réclamez cette fiche pour la mettre à jour.
                </p>
                <ClaimDialog dentistId={dentist.id} dentistName={dentist.name} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
