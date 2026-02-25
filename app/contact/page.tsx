import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter votre cabinet",
  description:
    "Ajoutez votre cabinet dentaire sur DentistesMaroc.ma et soyez visible par des milliers de patients dans tout le Maroc.",
};

async function handleSubmit(formData: FormData) {
  "use server";
  const payload = {
    name: formData.get("name"),
    cabinet: formData.get("cabinet"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    neighborhood: formData.get("neighborhood"),
    message: formData.get("message"),
    submittedAt: new Date().toISOString(),
  };
  console.log("[contact/ajouter-cabinet]", payload);
  // TODO: save to Supabase "leads" table or send via Resend
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            DentistesMaroc.ma
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Ajouter votre cabinet
          </h1>
          <p className="mt-2 text-zinc-500">
            Remplissez ce formulaire et nous créerons votre fiche sous 24h.
            C&apos;est gratuit.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 dark:bg-zinc-900">
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Votre prénom & nom *
                </label>
                <input
                  name="name"
                  required
                  placeholder="Dr. Mohamed Alami"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nom du cabinet *
                </label>
                <input
                  name="cabinet"
                  required
                  placeholder="Cabinet Dentaire Alami"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Téléphone *
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+212 6 00 00 00 00"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="contact@cabinet.ma"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Quartier
              </label>
              <input
                name="neighborhood"
                placeholder="Agdal, Hay Ryad, Souissi…"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Message (optionnel)
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Spécialités, horaires, informations complémentaires…"
                className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Envoyer la demande
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Nous vous contacterons sous 24h pour finaliser votre fiche.
        </p>
      </main>
    </div>
  );
}
