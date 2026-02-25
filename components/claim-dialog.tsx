"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { claimListing } from "@/app/dentiste/[slug]/actions";

export function ClaimDialog({ dentistId, dentistName }: { dentistId: string; dentistName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("dentistId", dentistId);
    formData.set("dentistName", dentistName);
    await claimListing(formData);
    setPending(false);
    setDone(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          Réclamer cette fiche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réclamer cette fiche</DialogTitle>
          <DialogDescription>
            Vous êtes {dentistName} ? Remplissez ce formulaire et nous vous
            contacterons sous 24h.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              Demande envoyée !
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Nous vous contacterons très bientôt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Votre nom complet</label>
              <Input name="name" placeholder="Dr. Mohamed Benali" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Téléphone</label>
              <Input name="phone" type="tel" placeholder="+212 6 00 00 00 00" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Message (optionnel)</label>
              <textarea
                name="message"
                rows={3}
                placeholder="Précisez votre demande…"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Envoi…" : "Envoyer la demande"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
