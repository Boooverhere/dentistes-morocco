"use client";

import dynamic from "next/dynamic";

const DentistMap = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
  ),
});

export { DentistMap };
