export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export const CONDITION_META = {
  PLAYER: {
    label: "PLAYER",
    tone: "text-orange border-orange/40 bg-orange/10",
    blurb: "Fully functional. Visible cosmetic wear. Best value for pure play.",
  },
  RESTORED: {
    label: "RESTORED",
    tone: "text-phosphor border-phosphor/40 bg-phosphor/10",
    blurb: "Cleaned, inspected, tested and serviced. Good cosmetic condition.",
  },
  VAULT: {
    label: "VAULT",
    tone: "text-purple border-purple/40 bg-purple/10",
    blurb: "Exceptional, collectible, rare or complete-in-box. Premium inventory.",
  },
} as const;

export type ConditionKey = keyof typeof CONDITION_META;
