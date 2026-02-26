import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de DentistesMaroc.ma — collecte et traitement des données personnelles.",
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

export default function PolitiqueConfidentialitePage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Politique de confidentialité</h1>
          <p className="mt-2 text-emerald-100">Dernière mise à jour : février 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <Section title="1. Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles collectées sur{" "}
            <strong className="text-zinc-900 dark:text-zinc-50">DentistesMaroc.ma</strong> est l&apos;éditeur
            du site, joignable via le{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">formulaire de contact</a>.
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes :</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>
              <strong className="text-zinc-700 dark:text-zinc-300">Soumission de cabinet</strong> : nom du praticien, ville, téléphone, email (optionnel), site web (optionnel), spécialités.
            </li>
            <li>
              <strong className="text-zinc-700 dark:text-zinc-300">Formulaire de contact</strong> : nom, adresse email, contenu du message.
            </li>
            <li>
              <strong className="text-zinc-700 dark:text-zinc-300">Données de navigation</strong> : aucun cookie tiers ni outil de tracking n&apos;est utilisé. Des logs serveur standard (adresse IP, user-agent) peuvent être conservés par notre hébergeur Vercel.
            </li>
          </ul>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Les données collectées sont utilisées pour :</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>Constituer et mettre à jour l&apos;annuaire des dentistes au Maroc.</li>
            <li>Modérer les fiches soumises avant publication.</li>
            <li>Répondre aux demandes envoyées via le formulaire de contact.</li>
          </ul>
          <p className="mt-2">
            Nous ne vendons, ne partageons et ne louons aucune donnée personnelle à des tiers.
          </p>
        </Section>

        <Section title="4. Durée de conservation">
          <p>
            Les données des fiches approuvées sont conservées tant que la fiche est active sur l&apos;annuaire.
            Les demandes de contact sont conservées le temps nécessaire au traitement de la demande.
            Les soumissions rejetées sont conservées à des fins de traçabilité pendant une durée maximale de 12 mois.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            DentistesMaroc.ma n&apos;utilise pas de cookies publicitaires ou de tracking. Des cookies
            techniques strictement nécessaires peuvent être déposés lors de la connexion à un compte
            (authentification Supabase). Ces cookies ne sont pas partagés avec des tiers.
          </p>
        </Section>

        <Section title="6. Vos droits">
          <p>Conformément aux lois en vigueur, vous disposez des droits suivants :</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>Droit d&apos;accès à vos données personnelles.</li>
            <li>Droit de rectification des données inexactes.</li>
            <li>Droit à l&apos;effacement (« droit à l&apos;oubli »).</li>
            <li>Droit d&apos;opposition au traitement.</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous via le{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">formulaire de contact</a>{" "}
            en précisant votre demande. Nous nous engageons à y répondre dans un délai de 30 jours.
          </p>
        </Section>

        <Section title="7. Sécurité">
          <p>
            Les données sont stockées dans une base Supabase hébergée sur infrastructure AWS (région EU),
            avec chiffrement en transit (HTTPS/TLS) et au repos. L&apos;accès en écriture est restreint
            aux administrateurs authentifiés.
          </p>
        </Section>

        <Section title="8. Modifications">
          <p>
            Cette politique peut être mise à jour à tout moment. La date de dernière modification est
            indiquée en haut de cette page. Nous vous encourageons à la consulter régulièrement.
          </p>
        </Section>
      </div>
    </SiteLayout>
  );
}
