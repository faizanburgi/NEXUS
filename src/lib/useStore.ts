"use client";

import { useSyncExternalStore } from "react";
import { NexusStore } from "@/services/NexusStore";

/**
 * Subscribes the calling component to NexusStore mutations. Returns the store
 * instance; the numeric version snapshot drives re-renders, and components read
 * fresh data from the store getters during render. This is what makes the
 * cross-section demo updates appear instantly across the whole app.
 */
export function useStore() {
  useSyncExternalStore(
    NexusStore.subscribe,
    NexusStore.getSnapshot,
    NexusStore.getServerSnapshot
  );
  return NexusStore;
}
