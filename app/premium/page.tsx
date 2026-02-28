import Link from "next/link";
import { ArrowLeft, Star, BarChart2, ShieldCheck, Phone, Crown } from "lucide-react";

export default function PremiumPage() {
  const benefits = [
    {
      icon: Star,
      title: "Mise en avant",
      description: "Votre fiche apparaît en tête des résultats de recherche pour votre ville et vos spécialités.",
    },
    {
      icon: BarChart2,
      title: "Statistiques avancées",
      description: "Consultez le nombre de vues, de contacts et l'évolution de votre visibilité.",
    },
    {
      icon: ShieldCheck,
      title: "Badge vérifié prioritaire",
      description: "Un badge premium attire la confiance des patients et vous différencie.",
    },
    {
      icon: Phone,
      title: "Support prioritaire",
      description: "Une équipe dédiée répond à vos questions par téléphone ou email.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <Crown className="h-7 w-7 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Offre Premium
          </h1>
          <p className="mt-3 text-zinc-500 max-w-sm mx-auto">
            Maximisez votre visibilité et attirez plus de patients avec DentistesMaroc.ma Premium.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <Icon className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </h2>
              <p className="text-sm text-zinc-500">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800/40 dark:bg-amber-950/20">
          <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
            Intéressé par l&apos;offre Premium ?
          </p>
          <p className="mb-6 text-sm text-zinc-500">
            Contactez-nous pour connaître les tarifs et activer votre abonnement.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Nous contacter
          </Link>
        </div>
      </main>
    </div>
  );
}
