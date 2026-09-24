"use client";

import { useState } from "react";
import { addItem } from "@/lib/cart";
import type { StorefrontProduct } from "@/lib/queries";

export function QuickAddButton({ product }: { product: StorefrontProduct }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to cart`}
      onClick={() => {
        addItem({
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          image: product.images[0]?.url ?? null,
          platform: product.platform.name,
        });
        setAdded(true);
      }}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-all ${
        added
          ? "border-phosphor bg-phosphor/15 text-phosphor"
          : "border-line text-mist hover:border-phosphor/50 hover:text-phosphor"
      }`}
    >
      {added ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6h15l-1.5 9h-12z" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M6 6L5 3H2" />
        </svg>
      )}
    </button>
  );
}
