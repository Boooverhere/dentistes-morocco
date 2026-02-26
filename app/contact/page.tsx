"use client";

import { useActionState } from "react";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { sendContact } from "./actions";
import type { ContactState } from "./actions";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

export default function ContactPage() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContact,
    null
  );

  if (state?.success) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-10 text-center dark:bg-zinc-900">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Message envoyé !
            </h2>
            <p className="mt-2 text-zinc-500">
              Merci de nous avoir contactés. Nous vous répondrons dans les meilleurs délais.
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Contactez-nous
          </h1>
          <p className="mt-4 text-lg text-emerald-100">
            Une question, une suggestion ou une erreur à signaler ? Écrivez-nous.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-14">
        <div className="grid gap-8 sm:grid-cols-[1fr,2fr]">
          {/* Info column */}
          <div className="flex flex-col gap-5 pt-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <Mail className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Réponse rapide</p>
                <p className="text-sm text-zinc-500">Généralement sous 48h.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <MessageSquare className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Sujets traités</p>
                <p className="text-sm text-zinc-500">
                  Modification de fiche, signalement d&apos;erreur, question générale, partenariat.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-white p-6 dark:bg-zinc-900">
            <form action={formAction} className="flex flex-col gap-4">
              {state?.error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                  {state.error}
                </p>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nom *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:text-zinc-50"
                />
                <FieldError msg={state?.fieldErrors?.name} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:text-zinc-50"
                />
                <FieldError msg={state?.fieldErrors?.email} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Décrivez votre demande…"
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:text-zinc-50"
                />
                <FieldError msg={state?.fieldErrors?.message} />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                {pending ? "Envoi en cours…" : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
