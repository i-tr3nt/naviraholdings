import { useState } from "react";
import { ChevronRight, Package, ShoppingCart } from "lucide-react";
import { CatalogOrderDialog } from "@/components/shop/CatalogOrderDialog";
import type { AddCatalogToCartPayload } from "@/types/shop";

type TypicalItemRowProps = {
  label: string;
  sectionLabel: string;
  categoryHint: string;
  onAddCatalog: (payload: AddCatalogToCartPayload) => void;
};

export function TypicalItemRow({
  label,
  sectionLabel,
  categoryHint,
  onAddCatalog,
}: TypicalItemRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <li>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-start gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-navira-red/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navira-red"
        >
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-navira-red" />
          <span className="min-w-0 flex-1 font-medium">{label}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-navira-red">
            <ShoppingCart className="h-3.5 w-3.5" />
            Order
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </li>

      <CatalogOrderDialog
        itemLabel={label}
        sectionLabel={sectionLabel}
        categoryHint={categoryHint}
        open={open}
        onOpenChange={setOpen}
        onConfirm={onAddCatalog}
      />
    </>
  );
}
