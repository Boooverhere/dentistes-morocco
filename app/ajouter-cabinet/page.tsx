"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { submitCabinet } from "./actions";
import { CITIES, NEIGHBORHOODS_BY_CITY, SPECIALTIES } from "@/lib/constants";
import { useState } from "react";

export default function AjouterCabinetPage() {
  const [state, formAction, pending] = useActionState(submitCabinet, null);
  const [selectedCity, setSelectedCity] = useState("");

  const neighborhoods = selectedCity
    ? (NEIGHBORHOODS_BY_CITY[selectedCity] ?? [])
    : [];

  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-10 text-center dark:bg-zinc-900">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Demande envoyée !
          </h2>
          <p className="mt-2 text-zinc-500">
            Votre cabinet a été ajouté et sera vérifié par notre équipe sous
            24h.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

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
            Remplissez ce formulaire. Votre fiche sera publiée après
            vérification — c&apos;est gratuit.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 dark:bg-zinc-900">
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </p>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nom du dentiste / cabinet *
              </label>
              <input
                name="name"
                required
                placeholder="Dr. Mohammed Alami"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* City + Neighborhood */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ville *
                </label>
                <select
                  name="city"
                  required
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Choisir…</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Quartier
                </label>
                <select
                  name="neighborhood"
                  disabled={!selectedCity}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50"
                >
                  <option value="">Choisir…</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Adresse complète
              </label>
              <input
                name="address"
                placeholder="12 Rue Ibn Sina, Agdal, Rabat"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Phone + Email */}
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
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="contact@cabinet.ma"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Site web
              </label>
              <input
                name="website"
                placeholder="https://cabinet-dentaire.ma"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Specialties */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Spécialités{" "}
                <span className="text-xs font-normal text-zinc-400">
                  (séparées par virgule)
                </span>
              </label>
              <input
                name="specialties"
                placeholder="Implants, Orthodontie, Esthétique"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .closest("div")
                        ?.previousElementSibling as HTMLInputElement;
                      if (!input) return;
                      const current = input.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean);
                      if (!current.includes(s)) {
                        input.value = [...current, s].join(", ");
                      }
                    }}
                    className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 hover:border-emerald-400 hover:text-emerald-700"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending ? "Envoi en cours…" : "Soumettre mon cabinet"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Votre fiche sera examinée et publiée sous 24h. Aucune carte bancaire
          requise.
        </p>
      </main>
    </div>
  );
}
