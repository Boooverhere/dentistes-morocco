"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Pencil, Trash2, Plus, Search } from "lucide-react";
import { DentistForm } from "./dentist-form";
import { createDentist, updateDentist, deleteDentist, toggleVerified } from "./actions";
import type { Dentist } from "@/lib/types";

export function DentistsTable({ dentists: initial }: { dentists: Dentist[] }) {
  const [dentists, setDentists] = useState(initial);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Dentist | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dentist | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!search.trim()) return dentists;
    const q = search.toLowerCase();
    return dentists.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.neighborhood?.toLowerCase().includes(q) ||
        d.phone?.includes(q)
    );
  }, [dentists, search]);

  function handleToggleVerified(dentist: Dentist) {
    startTransition(async () => {
      await toggleVerified(dentist.id, !dentist.verified);
      setDentists((prev) =>
        prev.map((d) =>
          d.id === dentist.id ? { ...d, verified: !d.verified } : d
        )
      );
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteDentist(deleteTarget.id);
      setDentists((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-zinc-500">
        <span>{dentists.length} dentiste{dentists.length !== 1 ? "s" : ""}</span>
        <span>·</span>
        <span>{dentists.filter((d) => d.verified).length} vérifiés</span>
        {search && (
          <>
            <span>·</span>
            <span>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900">
              <TableHead className="w-[220px]">Nom</TableHead>
              <TableHead>Quartier</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Spécialités</TableHead>
              <TableHead className="text-center">Note</TableHead>
              <TableHead className="text-center">Vérifié</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-zinc-400">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((dentist) => (
              <TableRow key={dentist.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <TableCell className="font-medium">{dentist.name}</TableCell>
                <TableCell className="text-zinc-500">{dentist.neighborhood ?? "—"}</TableCell>
                <TableCell className="text-zinc-500">{dentist.phone ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {dentist.specialties?.slice(0, 2).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                    {(dentist.specialties?.length ?? 0) > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{dentist.specialties!.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {dentist.rating ? dentist.rating.toFixed(1) : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggleVerified(dentist)}
                    disabled={isPending}
                    title={dentist.verified ? "Retirer la vérification" : "Marquer comme vérifié"}
                    className="inline-flex items-center justify-center rounded-full p-1 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <ShieldCheck
                      className={`h-5 w-5 ${
                        dentist.verified
                          ? "text-emerald-600"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditTarget(dentist)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget(dentist)}
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un dentiste</DialogTitle>
          </DialogHeader>
          <DentistForm
            action={createDentist}
            onSuccess={() => {
              setAddOpen(false);
              // Full refresh to get the new row with its generated id/slug
              window.location.reload();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier — {editTarget?.name}</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <DentistForm
              action={updateDentist}
              dentist={editTarget}
              onSuccess={() => {
                setEditTarget(null);
                window.location.reload();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce dentiste ?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> sera définitivement supprimé.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isPending ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
