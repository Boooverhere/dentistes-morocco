import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, MapPin, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";
import { getFeaturedDentists } from "@/lib/supabase/queries";
import { DentistCard } from "@/components/dentist-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DentistesMaroc.ma – Trouvez le meilleur dentiste au Maroc",
  description:
    "Annuaire des dentistes au Maroc : fiches vérifiées par ville et spécialité. Casablanca, Rabat, Marrakech, Tanger et plus.",
  openGraph: {
    title: "DentistesMaroc.ma",
    description: "Trouvez le meilleur dentiste au Maroc",
    type: "website",
  },
};

async function SearchForm() {
  async function handleSearch(formData: FormData) {
    "use server";
    const q = formData.get("q") as string;
    redirect(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <form action={handleSearch} className="flex w-full max-w-xl gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          name="q"
          type="text"
          placeholder="Quartier, spécialité, nom…"
          className="h-12 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:bg-zinc-800 dark:focus:border-emerald-600 dark:focus:ring-emerald-900"
        />
      </div>
      <button
        type="submit"
        className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
      >
        Rechercher
      </button>
    </form>
  );
}

async function FeaturedDentists() {
  const dentists = await getFeaturedDentists(9);

  if (dentists.length === 0) {
    return (
      <p className="col-span-3 py-12 text-center text-zinc-400">
        Aucun dentiste pour le moment.
      </p>
    );
  }

  return (
    <>
      {dentists.map((d) => (
        <DentistCard key={d.id} dentist={d} />
      ))}
    </>
  );
}

function FeaturedSkeleton() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900"
        >
          <Skeleton className="mb-3 h-5 w-3/4" />
          <Skeleton className="mb-2 h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <header className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            DentistesMaroc.ma
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Annuaire
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-20 text-white">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/20" />
          <div className="absolute -bottom-10 right-0 h-64 w-64 rounded-full bg-red-400/30" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            Maroc
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Trouvez le meilleur{" "}
            <span className="text-emerald-300">dentiste au Maroc</span>
          </h1>
          <p className="mb-8 text-lg text-emerald-100">
            Annuaire complet et vérifié des dentistes dans toutes les villes du Maroc.
            <br className="hidden sm:block" />
            Recherchez par ville, spécialité ou nom.
          </p>
          <SearchForm />

          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            + Ajouter votre cabinet
          </Link>

          {/* Quick filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { label: "Casablanca", url: "/search?city=Casablanca" },
              { label: "Rabat", url: "/search?city=Rabat" },
              { label: "Marrakech", url: "/search?city=Marrakech" },
              { label: "Tanger", url: "/search?city=Tanger" },
              { label: "Implants", url: "/search?specialty=Implants" },
              { label: "Orthodontie", url: "/search?specialty=Orthodontie" },
            ].map(({ label, url }) => (
              <Link
                key={label}
                href={url}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl divide-x divide-border">
          {[
            { icon: ShieldCheck, label: "Fiches vérifiées", value: "100+" },
            { icon: MapPin, label: "Quartiers couverts", value: "10+" },
            { icon: Star, label: "Spécialités", value: "9" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-1 items-center justify-center gap-3 px-4 py-4"
            >
              <Icon className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {value}
                </p>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured dentists */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Dentistes en vedette
          </h2>
          <Link
            href="/search"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedDentists />
          </Suspense>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-emerald-700 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Vous êtes dentiste au Maroc ?
          </h2>
          <p className="mt-3 text-emerald-100">
            Ajoutez votre cabinet gratuitement et soyez visible par des milliers
            de patients dans tout le Maroc.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            + Ajouter votre cabinet
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-400">
          © {new Date().getFullYear()} DentistesMaroc.ma
        </div>
      </footer>
    </div>
  );
}
