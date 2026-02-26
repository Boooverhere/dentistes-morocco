import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description:
    "Réponses aux questions fréquentes sur DentistesMaroc.ma : ajout de cabinet, vérification, contact, recherche de dentiste.",
};

const FAQ = [
  {
    q: "Comment ajouter mon cabinet sur DentistesMaroc.ma ?",
    a: "Rendez-vous sur la page « Ajouter votre cabinet » et remplissez le formulaire avec les informations de votre cabinet (nom, ville, téléphone, spécialités…). Votre fiche sera examinée et publiée sous 24h après vérification.",
  },
  {
    q: "L'inscription est-elle payante ?",
    a: "Non. L'ajout d'une fiche cabinet est entièrement gratuit pour les dentistes, et la consultation de l'annuaire est gratuite pour les patients. Il n'y a aucune carte bancaire requise.",
  },
  {
    q: "Comment fonctionne la vérification des fiches ?",
    a: "Chaque demande d'ajout est examinée manuellement par notre équipe. Nous vérifions l'exactitude des coordonnées (téléphone, adresse) et l'existence du praticien avant toute publication.",
  },
  {
    q: "Combien de temps faut-il pour que ma fiche soit publiée ?",
    a: "En général, les fiches sont publiées dans les 24 heures suivant la soumission. En cas d'affluence, ce délai peut être légèrement plus long. Vous ne recevez pas de notification par email pour le moment — vérifiez directement l'annuaire en recherchant votre nom.",
  },
  {
    q: "Comment modifier ou supprimer les informations de ma fiche ?",
    a: "Utilisez le formulaire de contact en indiquant le nom de votre cabinet et les modifications souhaitées. Notre équipe effectuera la mise à jour dans les meilleurs délais.",
  },
  {
    q: "Comment contacter un dentiste via l'annuaire ?",
    a: "Chaque fiche affiche le numéro de téléphone du cabinet. Cliquez sur la fiche pour accéder aux détails complets (adresse, spécialités, site web si disponible) et contactez directement le cabinet.",
  },
  {
    q: "Quelles informations figurent sur les fiches dentistes ?",
    a: "Une fiche peut contenir : nom du praticien ou du cabinet, ville, quartier, adresse complète, numéro de téléphone, email, site web, spécialités, note et nombre d'avis, statut de vérification.",
  },
  {
    q: "Comment les notes et avis sont-ils attribués ?",
    a: "Les notes présentes dans l'annuaire sont issues de données publiques ou saisies par l'équipe. Nous travaillons à l'intégration d'un système d'avis patients — restez connectés.",
  },
  {
    q: "Mon cabinet n'apparaît pas dans les résultats de recherche, que faire ?",
    a: "Vérifiez d'abord si votre fiche a été soumise et est en attente de validation. Si vous ne l'avez pas encore soumise, rendez-vous sur « Ajouter votre cabinet ». Si vous pensez qu'il s'agit d'une erreur, contactez-nous via la page Contact.",
  },
  {
    q: "DentistesMaroc.ma est-il disponible dans toutes les villes du Maroc ?",
    a: "Oui, l'annuaire couvre l'ensemble du Maroc — des grandes villes (Casablanca, Rabat, Marrakech, Tanger…) aux villes moyennes (Beni Mellal, Kénitra, Errachidia…). La couverture s'améliore au fur et à mesure des soumissions.",
  },
];

export default function FaqPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Questions fréquentes
          </h1>
          <p className="mt-4 text-lg text-emerald-100">
            Tout ce que vous devez savoir sur DentistesMaroc.ma.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-white px-5 dark:bg-zinc-900"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-zinc-900 hover:no-underline dark:text-zinc-50">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-10 text-center text-sm text-zinc-400">
          Vous ne trouvez pas de réponse ?{" "}
          <Link href="/contact" className="text-emerald-600 hover:underline">
            Contactez-nous
          </Link>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
