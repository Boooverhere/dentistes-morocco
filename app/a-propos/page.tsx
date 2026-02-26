import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Heart, Users, Globe } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "À propos de DentistesMaroc.ma",
  description:
    "Découvrez la mission de DentistesMaroc.ma : aider les patients à trouver un dentiste fiable partout au Maroc.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Fiches vérifiées",
    description:
      "Chaque cabinet soumis est examiné manuellement avant publication. Nous vérifions les coordonnées et l'existence du praticien pour vous garantir des informations fiables.",
  },
  {
    icon: Heart,
    title: "Gratuit pour les patients",
    description:
      "La consultation de l'annuaire est et restera entièrement gratuite pour les patients. Notre mission est de faciliter l'accès aux soins dentaires, pas de le facturer.",
  },
  {
    icon: Users,
    title: "Ouvert à tous les dentistes",
    description:
      "Qu'il soit généraliste ou spécialiste, libéral ou en clinique, tout dentiste exerçant au Maroc peut soumettre sa fiche gratuitement.",
  },
  {
    icon: Globe,
    title: "Couverture nationale",
    description:
      "De Tanger à Dakhla, nous référençons des cabinets dans toutes les villes du Maroc, avec un effort particulier pour les zones moins couvertes.",
  },
];

export default function AProposPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            À propos de DentistesMaroc.ma
          </h1>
          <p className="mt-4 text-lg text-emerald-100">
            Un annuaire indépendant pour aider chaque Marocain à trouver un dentiste de confiance, partout au Maroc.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Notre mission
        </h2>
        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p>
            DentistesMaroc.ma est né d&apos;un constat simple : trouver un dentiste fiable au Maroc n&apos;est pas toujours facile, surtout dans les villes secondaires ou pour les personnes peu habituées à chercher en ligne. Les recommandations de bouche-à-oreille restent la norme, mais elles ont leurs limites.
          </p>
          <p>
            Notre objectif est de centraliser, vérifier et rendre accessible l&apos;information sur les dentistes à travers tout le Royaume — ville, quartier, spécialité, coordonnées — en un seul endroit, gratuitement et sans compte requis pour les patients.
          </p>
          <p>
            Nous croyons que l&apos;accès à l&apos;information de santé est un droit. Ce projet est notre contribution modeste à la santé bucco-dentaire au Maroc.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-white px-4 py-14 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Nos valeurs
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-zinc-50 p-6 dark:bg-zinc-800"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900">
                  <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          L&apos;équipe
        </h2>
        <div className="rounded-2xl border border-border bg-white p-8 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            DentistesMaroc.ma est un <strong className="text-zinc-900 dark:text-zinc-50">projet indépendant pour la santé bucco-dentaire au Maroc</strong>, développé et maintenu de façon autonome, sans financement extérieur ni actionnaire.
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Les fiches sont modérées manuellement pour garantir la qualité des informations. Si vous souhaitez contribuer, signaler une erreur ou nous contacter, rendez-vous sur la page{" "}
            <Link href="/contact" className="text-emerald-600 hover:underline">
              Contact
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-emerald-700 px-4 py-12 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">Vous êtes dentiste ?</h2>
          <p className="mt-2 text-emerald-100">
            Ajoutez votre cabinet gratuitement et rejoignez l&apos;annuaire.
          </p>
          <Link
            href="/ajouter-cabinet"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            + Ajouter votre cabinet
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
