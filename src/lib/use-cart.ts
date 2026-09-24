"use client";

import { useSyncExternalStore } from "react";
import { getServerCartSnapshot, readCart, subscribe } from "@/lib/cart";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function useCart() {
  const items = useSyncExternalStore(subscribe, readCart, getServerCartSnapshot);
  const ready = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );

  return { items, ready };
}