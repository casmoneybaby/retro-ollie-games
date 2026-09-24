import { CONDITION_META, type ConditionKey } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ConditionBadge({ condition }: { condition: string }) {
  const meta = CONDITION_META[condition as ConditionKey] ?? CONDITION_META.PLAYER;
  return (
    <span
      className={cn(
        "pixel-tag inline-flex items-center rounded-sm border px-2 py-1 text-[8px]",
        meta.tone
      )}
    >
      {meta.label}
    </span>
  );
}

export function StockBadge({ quantity, status }: { quantity: number; status: string }) {
  if (status === "SOLD") {
    return (
      <span className="pixel-tag inline-flex items-center rounded-sm border border-amber/40 bg-amber/10 px-2 py-1 text-[8px] text-amber">
        SOLD
      </span>
    );
  }
  if (status === "RESERVED") {
    return (
      <span className="pixel-tag inline-flex items-center rounded-sm border border-line bg-panel-2 px-2 py-1 text-[8px] text-mist">
        RESERVED
      </span>
    );
  }
  if (quantity <= 1) {
    return (
      <span className="pixel-tag inline-flex items-center rounded-sm border border-phosphor/40 bg-phosphor/10 px-2 py-1 text-[8px] text-phosphor">
        1 OF 1 · IN STOCK
      </span>
    );
  }
  return (
    <span className="pixel-tag inline-flex items-center rounded-sm border border-line bg-panel-2 px-2 py-1 text-[8px] text-mist">
      {quantity} IN STOCK
    </span>
  );
}

export function PlatformTag({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-mist">
      {label}
    </span>
  );
}
