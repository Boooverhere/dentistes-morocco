"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, NEIGHBORHOODS_BY_CITY, SPECIALTIES } from "@/lib/constants";

const RATING_OPTIONS = [
  { label: "3+ étoiles", value: "3" },
  { label: "4+ étoiles", value: "4" },
  { label: "4.5+ étoiles", value: "4.5" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const city = searchParams.get("city") ?? "";
  const neighborhood = searchParams.get("neighborhood") ?? "";
  const specialty = searchParams.get("specialty") ?? "";
  const verified = searchParams.get("verified") === "true";
  const minRating = searchParams.get("minRating") ?? "";

  const neighborhoods = city
    ? (NEIGHBORHOODS_BY_CITY[city] ?? [])
    : Object.values(NEIGHBORHOODS_BY_CITY).flat();

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("offset");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleCityChange(val: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("city", val);
    } else {
      params.delete("city");
    }
    params.delete("neighborhood");
    params.delete("offset");
    router.push(`/search?${params.toString()}`);
  }

  const hasFilters = !!(q || city || neighborhood || specialty || verified || minRating);

  return (
    <div className="flex flex-col gap-3">
      {/* Name search */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">Nom</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            defaultValue={q}
            placeholder="Nom du dentiste…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter")
                update("q", (e.target as HTMLInputElement).value || null);
            }}
            onBlur={(e) => update("q", e.target.value || null)}
          />
        </div>
      </div>

      {/* City */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">Ville</p>
        <Select value={city || "all"} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">Quartier</p>
        <Select
          value={neighborhood || "all"}
          onValueChange={(v) => update("neighborhood", v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les quartiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les quartiers</SelectItem>
            {neighborhoods.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Specialty */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">Spécialité</p>
        <Select
          value={specialty || "all"}
          onValueChange={(v) => update("specialty", v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les spécialités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les spécialités</SelectItem>
            {SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Min rating */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">Note minimale</p>
        <Select
          value={minRating || "all"}
          onValueChange={(v) => update("minRating", v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            {RATING_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Verified toggle */}
      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => update("verified", e.target.checked ? "true" : null)}
          className="h-4 w-4 accent-emerald-600"
        />
        <span>Vérifiés seulement</span>
      </label>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/search")}
          className="w-full text-zinc-500"
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
