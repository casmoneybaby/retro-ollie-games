"use client";

/**
 * Lightweight localStorage cart. One-of-one consoles mean quantity is always
 * 1 per slug; the server revalidates everything at checkout time.
 */

export type CartItem = {
  slug: string;
  name: string;
  priceCents: number;
  image: string | null;
  platform: string;
};

const KEY = "rog_cart_v1";
const CHANGE_EVENT = "rog-cart-changed";
const MAX_ITEMS = 20;
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedItems = EMPTY_CART;

function isValidItem(v: unknown): v is CartItem {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.priceCents === "number" &&
    Number.isInteger(o.priceCents) &&
    o.priceCents > 0 &&
    (o.image === null || typeof o.image === "string") &&
    typeof o.platform === "string"
  );
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedItems;

    cachedRaw = raw;
    if (!raw) {
      cachedItems = EMPTY_CART;
      return cachedItems;
    }
    const parsed = JSON.parse(raw);
    cachedItems = Array.isArray(parsed)
      ? parsed.filter(isValidItem).slice(0, MAX_ITEMS)
      : EMPTY_CART;
    return cachedItems;
  } catch {
    cachedItems = EMPTY_CART;
    return cachedItems;
  }
}

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function addItem(item: CartItem): void {
  const items = readCart();
  if (items.some((i) => i.slug === item.slug)) return; // one of each unit
  writeCart([...items, item]);
}

export function removeItem(slug: string): void {
  writeCart(readCart().filter((i) => i.slug !== slug));
}

export function clearCart(): void {
  writeCart([]);
}

/** Subscribe to cart changes. Returns an unsubscribe function. */
export function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function cartCount(items: CartItem[]): number {
  return items.length;
}
