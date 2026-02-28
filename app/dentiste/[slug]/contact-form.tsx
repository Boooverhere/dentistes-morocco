"use client";

import { useActionState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "./actions";

export function ContactForm({ dentistId }: { dentistId: string }) {
  const [state, formAction, pending] = useActionState(submitLead, null);

  useEffect(() => {
    if (state?.success) toast.success("Message envoyé ! Le dentiste vous contactera bientôt.");
    if (state?.error) toast.error(state.error);
  }, [state]);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <MessageSquare className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Message envoyé avec succès.
        </p>
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          Le cabinet vous répondra dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Envoyer un message
      </p>
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="dentist_id" value={dentistId} />

        <input
          name="patient_name"
          required
          placeholder="Votre nom"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
        <input
          name="email"
          type="email"
          placeholder="Votre email"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Votre téléphone"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
        <textarea
          name="message"
          rows={3}
          placeholder="Votre message ou demande de rendez-vous…"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
