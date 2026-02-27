"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Link2, Search, X } from "lucide-react";
import { approvePending, rejectPending, linkPendingToDentist } from "./actions";
import type { Dentist, PendingDentist } from "@/lib/types";

interface Props {
  submissions: PendingDentist[];
  dentists: Dentist[];
}

export function PendingTable({ submissions: initial, dentists }: Props) {
  const [submissions, setSubmissions] = useState(initial);
  const [isPending, startTransition] = useTransition();

  // Approve
  const [approveError, setApproveError] = useState<string | null>(null);

  // Reject dialog
  const [rejectTarget, setRejectTarget] = useState<PendingDentist | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Link dialog
  const [linkTarget, setLinkTarget] = useState<PendingDentist | null>(null);
  const [linkSearch, setLinkSearch] = useState("");
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const filteredDentists = useMemo(() => {
    if (!linkSearch.trim()) return dentists;
    const q = linkSearch.toLowerCase();
    return dentists.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q) ||
        d.neighborhood?.toLowerCase().includes(q)
    );
  }, [dentists, linkSearch]);

  function handleApprove(sub: PendingDentist) {
    setApproveError(null);
    startTransition(async () => {
      const result = await approvePending(sub.id);
      if (!result.error) {
        setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
      } else {
        setApproveError(result.error);
      }
    });
  }

  function handleReject() {
    if (!rejectTarget) return;
    startTransition(async () => {
      const result = await rejectPending(rejectTarget.id, rejectReason);
      if (!result.error) {
        setSubmissions((prev) => prev.filter((s) => s.id !== rejectTarget.id));
        setRejectTarget(null);
        setRejectReason("");
      }
    });
  }

  function handleLinkConfirm() {
    if (!linkTarget || !selectedDentist) return;
    setLinkError(null);
    startTransition(async () => {
      const result = await linkPendingToDentist(linkTarget.id, selectedDentist.id);
      if (!result.error) {
        setSubmissions((prev) => prev.filter((s) => s.id !== linkTarget.id));
        setLinkTarget(null);
        setSelectedDentist(null);
        setLinkSearch("");
      } else {
        setLinkError(result.error);
      }
    });
  }

  function openLinkDialog(sub: PendingDentist) {
    setLinkTarget(sub);
    setSelectedDentist(null);
    setLinkSearch("");
    setLinkError(null);
  }

  if (submissions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-400">
        Aucune fiche en attente de modération.
      </p>
    );
  }

  return (
    <>
      {approveError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          Erreur lors de l&apos;approbation : {approveError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900">
              <TableHead className="w-[200px]">Nom</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Quartier</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Spécialités</TableHead>
              <TableHead>Soumis le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <TableCell className="font-medium">{sub.name}</TableCell>
                <TableCell className="text-zinc-500">{sub.city}</TableCell>
                <TableCell className="text-zinc-500">{sub.neighborhood ?? "—"}</TableCell>
                <TableCell className="text-zinc-500">{sub.phone}</TableCell>
                <TableCell className="text-zinc-500">{sub.email ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {sub.specialties?.slice(0, 2).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                    {(sub.specialties?.length ?? 0) > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{sub.specialties!.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {new Date(sub.submitted_at).toLocaleDateString("fr-MA")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {/* Approve — creates new listing */}
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => handleApprove(sub)}
                      title="Approuver (créer une nouvelle fiche)"
                      className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    {/* Link — attach to existing listing */}
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => openLinkDialog(sub)}
                      title="Lier à une fiche existante"
                      className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                    {/* Reject */}
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => { setRejectTarget(sub); setRejectReason(""); }}
                      title="Rejeter"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reject dialog */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => { if (!open) { setRejectTarget(null); setRejectReason(""); } }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter — {rejectTarget?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Label htmlFor="reject-reason">
              Motif du rejet <span className="text-zinc-400">(optionnel)</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Ex : informations incomplètes, cabinet introuvable…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Annuler
            </Button>
            <Button
              disabled={isPending}
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Rejet en cours…" : "Rejeter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link to existing dentist dialog */}
      <Dialog
        open={!!linkTarget}
        onOpenChange={(open) => {
          if (!open) {
            setLinkTarget(null);
            setSelectedDentist(null);
            setLinkSearch("");
            setLinkError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lier à une fiche existante</DialogTitle>
          </DialogHeader>

          {/* Submission summary */}
          <div className="rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-800">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              {linkTarget?.name}
            </p>
            <div className="mt-1 flex flex-wrap gap-3 text-zinc-500">
              {linkTarget?.email && <span>{linkTarget.email}</span>}
              {linkTarget?.phone && <span>{linkTarget.phone}</span>}
              {linkTarget?.city && <span>{linkTarget.city}</span>}
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              L&apos;email ci-dessus sera associé à la fiche choisie — le
              dentiste pourra alors accéder à son tableau de bord.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Rechercher par nom, ville…"
              className="pl-9"
              value={linkSearch}
              onChange={(e) => setLinkSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Dentist list */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
            {filteredDentists.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-400">
                Aucun résultat.
              </p>
            ) : (
              filteredDentists.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDentist(d)}
                  className={`flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    selectedDentist?.id === d.id
                      ? "bg-emerald-50 dark:bg-emerald-950/30"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {d.name}
                    </p>
                    <p className="text-zinc-500">
                      {[d.city, d.neighborhood].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  {d.email && (
                    <span className="ml-3 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      email lié
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Warning if selected dentist already has email */}
          {selectedDentist?.email && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              ⚠ Cette fiche est déjà associée à{" "}
              <strong>{selectedDentist.email}</strong>. Elle sera remplacée
              par <strong>{linkTarget?.email ?? "—"}</strong>.
            </p>
          )}

          {linkError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {linkError}
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkTarget(null)}>
              Annuler
            </Button>
            <Button
              disabled={!selectedDentist || isPending}
              onClick={handleLinkConfirm}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isPending ? "Liaison en cours…" : "Confirmer le lien"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
