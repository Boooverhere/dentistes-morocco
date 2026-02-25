import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { searchDentists } from "@/lib/supabase/queries";
import { DentistCard } from "@/components/dentist-card";
import { SearchFilters } from "@/components/search-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Rechercher un dentiste à Rabat | Dentistes Rabat",
  description:
    "Trouvez un dentiste à Rabat par quartier, spécialité ou nom. Résultats filtrables et mis à jour régulièrement.",
};

const PAGE_SIZE = 20;

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900">
          <Skeleton className="mb-3 h-5 w-3/4" />
          <Skeleton className="mb-2 h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    neighborhood?: string;
    specialty?: string;
    verified?: string;
    offset?: string;
  }>;
}) {
  const params = await searchParams;
  const offset = Number(params.offset ?? 0);

  const { dentists, total } = await searchDentists({
    q: params.q,
    neighborhood: params.neighborhood,
    specialty: params.specialty,
    verified: params.verified === "true",
    limit: PAGE_SIZE,
    offset,
  });

  const hasFilters = !!(params.q || params.neighborhood || params.specialty || params.verified);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  function buildPageUrl(newOffset: number) {
    const p = new URLSearchParams();
    if (params.q) p.set("q", params.q);
    if (params.neighborhood) p.set("neighborhood", params.neighborhood);
    if (params.specialty) p.set("specialty", params.specialty);
    if (params.verified) p.set("verified", params.verified);
    if (newOffset > 0) p.set("offset", String(newOffset));
    return `/search?${p.toString()}`;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-emerald-700 dark:text-emerald-400"
          >
            Dentistes Rabat
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Sidebar filters */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900">
              <p className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Filtres
              </p>
              <Suspense>
                <SearchFilters />
              </Suspense>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {total === 0
                  ? "Aucun résultat"
                  : `${total} dentiste${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}${hasFilters ? " pour votre recherche" : ""}`}
              </p>
            </div>

            <Suspense fallback={<ResultsSkeleton />}>
              {dentists.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center dark:bg-zinc-900">
                  <p className="text-zinc-500">Aucun dentiste trouvé.</p>
                  <Link
                    href="/search"
                    className="mt-3 inline-block text-sm text-emerald-600 hover:underline"
                  >
                    Voir tous les dentistes
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {dentists.map((d) => (
                    <DentistCard key={d.id} dentist={d} />
                  ))}
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {currentPage > 1 && (
                  <Link href={buildPageUrl(offset - PAGE_SIZE)}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-zinc-500">
                  Page {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link href={buildPageUrl(offset + PAGE_SIZE)}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
