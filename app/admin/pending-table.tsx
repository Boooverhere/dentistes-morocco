"use client";

import { useState, useTransition } from "react";
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
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { approvePending, rejectPending } from "./actions";
import type { PendingDentist } from "@/lib/types";

export function PendingTable({ submissions: initial }: { submissions: PendingDentist[] }) {
  const [submissions, setSubmissions] = useState(initial);
  const [rejectTarget, setRejectTarget] = useState<PendingDentist | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approveError, setApproveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => handleApprove(sub)}
                      title="Approuver"
                      className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
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
            <Label htmlFor="reject-reason">Motif du rejet <span className="text-zinc-400">(optionnel)</span></Label>
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
    </>
  );
}
