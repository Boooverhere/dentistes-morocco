"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dentist } from "@/lib/types";

const NEIGHBORHOODS = [
  "Agdal", "Hay Ryad", "CYM", "Souissi", "Yacoub El Mansour",
  "Hassan", "Océan", "Aviation", "Diour Jamaa", "Centre-Ville",
];

type ActionFn = (
  prev: unknown,
  formData: FormData
) => Promise<{ error?: string; success?: boolean }>;

interface DentistFormProps {
  action: ActionFn;
  dentist?: Dentist;
  onSuccess: () => void;
}

export function DentistForm({ action, dentist, onSuccess }: DentistFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state && "success" in state && state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Hidden fields for edit */}
      {dentist && (
        <>
          <input type="hidden" name="id" value={dentist.id} />
          <input type="hidden" name="slug" value={dentist.slug} />
        </>
      )}

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" name="name" required defaultValue={dentist?.name} placeholder="Dr. Mohammed Alami" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="neighborhood">Quartier</Label>
          <Select name="neighborhood" defaultValue={dentist?.neighborhood ?? ""}>
            <SelectTrigger id="neighborhood">
              <SelectValue placeholder="Choisir…" />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOODS.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={dentist?.address ?? ""} placeholder="12 Rue Ibn Sina, Agdal" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={dentist?.phone ?? ""} placeholder="+212 6 00 00 00 00" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={dentist?.email ?? ""} placeholder="contact@cabinet.ma" />
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Site web</Label>
        <Input id="website" name="website" defaultValue={dentist?.website ?? ""} placeholder="https://cabinet-dentaire.ma" />
      </div>

      {/* Row 5 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="specialties">Spécialités <span className="text-xs text-zinc-400">(séparées par virgule)</span></Label>
        <Input
          id="specialties"
          name="specialties"
          defaultValue={dentist?.specialties?.join(", ") ?? ""}
          placeholder="Implants, Orthodontie, Esthétique"
        />
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rating">Note (0–5)</Label>
          <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={dentist?.rating ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review_count">Nb avis</Label>
          <Input id="review_count" name="review_count" type="number" min="0" defaultValue={dentist?.review_count ?? ""} />
        </div>
      </div>

      {/* Row 7 – coords */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" defaultValue={dentist?.latitude ?? ""} placeholder="33.9716" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" defaultValue={dentist?.longitude ?? ""} placeholder="-6.8498" />
        </div>
      </div>

      {/* Row 8 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="photo_url">URL photo</Label>
        <Input id="photo_url" name="photo_url" defaultValue={dentist?.photo_url ?? ""} placeholder="https://..." />
      </div>

      {/* Row 9 – verified */}
      <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
        <input
          type="checkbox"
          id="verified"
          name="verified"
          value="true"
          defaultChecked={dentist?.verified ?? false}
          className="h-4 w-4 accent-emerald-600"
        />
        <Label htmlFor="verified" className="cursor-pointer">
          Marquer comme vérifié
        </Label>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement…" : dentist ? "Mettre à jour" : "Ajouter le dentiste"}
      </Button>
    </form>
  );
}
