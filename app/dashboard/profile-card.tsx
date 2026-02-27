"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle, ExternalLink, Pencil, Shield, X } from "lucide-react";
import { updateMyListing } from "./actions";
import type { Dentist } from "@/lib/types";
import { CITIES, NEIGHBORHOODS_BY_CITY, SPECIALTIES } from "@/lib/constants";

export function ProfileCard({ dentist }: { dentist: Dentist }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateMyListing, null);
  const [selectedCity, setSelectedCity] = useState(dentist.city ?? "");

  // Close edit form after successful save
  useEffect(() => {
    if (state?.success) {
      setEditing(false);
    }
  }, [state]);

  const neighborhoods = selectedCity
    ? (NEIGHBORHOODS_BY_CITY[selectedCity] ?? [])
    : [];

  function openEditForm() {
    // Sync selectedCity to current dentist city when opening
    setSelectedCity(dentist.city ?? "");
    setEditing(true);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Status bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle className="h-3.5 w-3.5" />
            Fiche publiée
          </span>
          {dentist.verified && (
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Shield className="h-3.5 w-3.5" />
              Vérifié
            </span>
          )}
        </div>
        <Link
          href={`/dentiste/${dentist.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Voir ma fiche
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Profile info */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {dentist.name}
        </h2>
        <p className="text-sm text-zinc-500">
          {[dentist.city, dentist.neighborhood].filter(Boolean).join(" · ")}
        </p>
        {dentist.specialties && dentist.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dentist.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        {dentist.phone && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {dentist.phone}
          </p>
        )}
        {dentist.website && (
          <a
            href={dentist.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            {dentist.website}
          </a>
        )}
      </div>

      {/* Edit toggle */}
      <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <button
          onClick={editing ? () => setEditing(false) : openEditForm}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {editing ? (
            <>
              <X className="h-4 w-4" />
              Annuler
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Modifier ma fiche
            </>
          )}
        </button>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Modifier les informations
          </h3>
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </p>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nom du cabinet / dentiste
              </label>
              <input
                name="name"
                defaultValue={dentist.name}
                required
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* City + Neighborhood */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Ville
                </label>
                <select
                  name="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Choisir…</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Quartier
                </label>
                <select
                  name="neighborhood"
                  defaultValue={dentist.neighborhood ?? ""}
                  disabled={!selectedCity}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50"
                >
                  <option value="">Choisir…</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Téléphone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={dentist.phone ?? ""}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Site web
                </label>
                <input
                  name="website"
                  defaultValue={dentist.website ?? ""}
                  placeholder="https://..."
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Adresse complète
              </label>
              <input
                name="address"
                defaultValue={dentist.address ?? ""}
                placeholder="12 Rue Ibn Sina, Agdal, Rabat"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Specialties */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Spécialités{" "}
                <span className="font-normal text-zinc-400">
                  (séparées par virgule)
                </span>
              </label>
              <input
                name="specialties"
                defaultValue={dentist.specialties?.join(", ") ?? ""}
                placeholder="Implants, Orthodontie, Esthétique"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
              <div className="flex flex-wrap gap-1.5">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      const input = (
                        e.currentTarget.closest("div") as HTMLElement
                      )?.previousElementSibling as HTMLInputElement;
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

            {/* Photo URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                URL de la photo
              </label>
              <input
                name="photo_url"
                defaultValue={dentist.photo_url ?? ""}
                placeholder="https://..."
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                {pending ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
