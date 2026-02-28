"use client";

import { useEffect } from "react";
import { incrementView } from "./actions";

export function ViewTracker({ dentistId }: { dentistId: string }) {
  useEffect(() => {
    incrementView(dentistId);
  }, [dentistId]);

  return null;
}
