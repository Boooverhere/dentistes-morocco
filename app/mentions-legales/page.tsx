import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de DentistesMaroc.ma.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="space-y-2 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Mentions légales</h1>
          <p className="mt-2 text-emerald-100">Dernière mise à jour : février 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <Section title="1. Éditeur du site">
          <p>
            Le site <strong className="text-zinc-900 dark:text-zinc-50">DentistesMaroc.ma</strong> est un projet
            indépendant édité à titre personnel, sans structure juridique commerciale.
          </p>
          <p>
            Responsable de la publication : Éditeur de DentistesMaroc.ma
            <br />
            Contact : via le{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">
              formulaire de contact
            </a>
            .
          </p>
        </Section>

        <Section title="2. Hébergement">
          <p>
            Le site est hébergé par <strong className="text-zinc-900 dark:text-zinc-50">Vercel Inc.</strong>
            <br />
            340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.
            <br />
            <a href="https://vercel.com" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://vercel.com
            </a>
          </p>
          <p>
            La base de données est hébergée par <strong className="text-zinc-900 dark:text-zinc-50">Supabase Inc.</strong> (infrastructure AWS, région EU).
          </p>
        </Section>

        <Section title="3. Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu de ce site (textes, design, code source) est la propriété exclusive
            de l&apos;éditeur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
          <p>
            Les informations relatives aux cabinets dentaires (noms, adresses, téléphones) sont des données
            factuelles soumises par les praticiens eux-mêmes ou issues de sources publiques. Leur utilisation
            à des fins commerciales est interdite.
          </p>
        </Section>

        <Section title="4. Responsabilité">
          <p>
            DentistesMaroc.ma s&apos;efforce de maintenir des informations exactes et à jour. Toutefois,
            l&apos;éditeur ne saurait être tenu responsable des erreurs, omissions ou résultats obtenus par
            un usage inadéquat des informations figurant sur ce site.
          </p>
          <p>
            Les fiches dentistes sont vérifiées manuellement mais peuvent contenir des informations
            devenues inexactes. En cas d&apos;erreur, signalez-la via le{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">formulaire de contact</a>.
          </p>
        </Section>

        <Section title="5. Liens hypertextes">
          <p>
            Le site peut contenir des liens vers des sites tiers (sites de cabinets, partenaires). L&apos;éditeur
            n&apos;est pas responsable du contenu de ces sites et ne peut être tenu pour responsable des
            dommages résultant de leur utilisation.
          </p>
        </Section>

        <Section title="6. Droit applicable">
          <p>
            Les présentes mentions légales sont régies par le droit marocain. Tout litige relatif à
            l&apos;utilisation de ce site sera soumis à la compétence exclusive des tribunaux marocains.
          </p>
        </Section>
      </div>
    </SiteLayout>
  );
}
