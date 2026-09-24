"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart, subscribe, type CartItem } from "@/lib/cart";

export function CartButton() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    setReady(true);
    return subscribe(sync);
  }, []);

  const count = items.length;

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex h-9 items-center gap-2 rounded-sm border border-line bg-panel px-3 text-xs font-semibold tracking-widest text-bone transition-colors hover:border-phosphor/50 hover:text-phosphor"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M6 6L5 3H2" />
      </svg>
      <span className="hidden sm:inline">CART</span>
      {ready && count > 0 && (
        <span className="pixel-tag absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-sm bg-phosphor px-1 text-[8px] text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
