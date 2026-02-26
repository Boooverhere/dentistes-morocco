import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export function SiteLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-border bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            DentistesMaroc.ma
          </Link>
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

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-white py-10 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <p className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                DentistesMaroc.ma
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Annuaire des dentistes au Maroc. Fiches vérifiées, gratuites pour les patients.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Navigation
              </p>
              <ul className="flex flex-col gap-2 text-sm text-zinc-500">
                <li><Link href="/search" className="hover:text-zinc-900 dark:hover:text-zinc-50">Annuaire</Link></li>
                <li><Link href="/ajouter-cabinet" className="hover:text-zinc-900 dark:hover:text-zinc-50">Ajouter votre cabinet</Link></li>
                <li><Link href="/a-propos" className="hover:text-zinc-900 dark:hover:text-zinc-50">À propos</Link></li>
                <li><Link href="/faq" className="hover:text-zinc-900 dark:hover:text-zinc-50">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-50">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Légal
              </p>
              <ul className="flex flex-col gap-2 text-sm text-zinc-500">
                <li><Link href="/mentions-legales" className="hover:text-zinc-900 dark:hover:text-zinc-50">Mentions légales</Link></li>
                <li><Link href="/politique-confidentialite" className="hover:text-zinc-900 dark:hover:text-zinc-50">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} DentistesMaroc.ma — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
