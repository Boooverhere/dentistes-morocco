"use client";

import { useState } from "react";
import { DentistsTable } from "./dentists-table";
import { PendingTable } from "./pending-table";
import type { Dentist, PendingDentist } from "@/lib/types";

interface Props {
  dentists: Dentist[];
  pending: PendingDentist[];
}

export function AdminTabs({ dentists, pending }: Props) {
  const [tab, setTab] = useState<"pending" | "published">(
    pending.length > 0 ? "pending" : "published"
  );

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-zinc-100 p-1 dark:bg-zinc-800 w-fit">
        <button
          onClick={() => setTab("pending")}
          className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "pending"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Fiches en attente
          {pending.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-white">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("published")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "published"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Dentistes publiés
          <span className="text-xs text-zinc-400">{dentists.length}</span>
        </button>
      </div>

      {/* Tab content */}
      <div className="rounded-2xl border border-border bg-white p-6 dark:bg-zinc-900">
        {tab === "pending" ? (
          <PendingTable submissions={pending} />
        ) : (
          <DentistsTable dentists={dentists} />
        )}
      </div>
    </div>
  );
}
