"use client";

import Link from "next/link";
import { useState } from "react";
import { addItem, type CartItem } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function AddToCartButton({ product }: { product: CartItem }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          addItem(product);
          setAdded(true);
        }}
        className={cn(
          "pixel-tag flex h-14 w-full items-center justify-center rounded-sm text-[11px] transition-colors",
          added
            ? "border border-phosphor/50 bg-phosphor/10 text-phosphor"
            : "bg-phosphor text-ink hover:bg-bone"
        )}
      >
        {added ? "✓ IN CART — CHECKOUT BELOW" : "ADD TO CART"}
      </button>
      {added && (
        <Link
          href="/cart"
          className="flex h-12 w-full items-center justify-center rounded-sm border border-phosphor/50 font-mono text-[11px] uppercase tracking-widest text-phosphor transition-colors hover:bg-phosphor/10"
        >
          Go to cart →
        </Link>
      )}
    </div>
  );
}
