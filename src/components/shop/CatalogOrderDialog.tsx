import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getLineDetailsLabel, getLineDetailsPlaceholder } from "@/lib/product-order-hints";
import { SHOP_CART_MAX_QUANTITY } from "@/lib/shop-availability";
import type { AddCatalogToCartPayload } from "@/types/shop";
import { Package, ShoppingCart } from "lucide-react";

type CatalogOrderDialogProps = {
  itemLabel: string | null;
  sectionLabel: string;
  categoryHint: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: AddCatalogToCartPayload) => void;
};

export function CatalogOrderDialog({
  itemLabel,
  sectionLabel,
  categoryHint,
  open,
  onOpenChange,
  onConfirm,
}: CatalogOrderDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [lineDetails, setLineDetails] = useState("");

  useEffect(() => {
    if (open && itemLabel) {
      setQuantity(1);
      setLineDetails("");
    }
  }, [open, itemLabel]);

  if (!itemLabel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.min(SHOP_CART_MAX_QUANTITY, Math.max(1, quantity));
    onConfirm({
      itemLabel,
      sectionLabel,
      categoryHint,
      quantity: qty,
      lineDetails: lineDetails.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 text-left leading-snug">{itemLabel}</DialogTitle>
          <DialogDescription className="text-left">
            {sectionLabel} · typical product line
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <Package className="h-10 w-10 shrink-0 text-navira-red" />
          <p className="text-sm text-muted-foreground">
            We stock this line in store. Add it to your order with the size, brand, or specs you need — our team
            will confirm the price before fulfilment.
          </p>
        </div>

        <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
          Price confirmed when we process your order
        </Badge>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-qty">Quantity</Label>
            <Input
              id="cat-qty"
              type="number"
              min={1}
              max={SHOP_CART_MAX_QUANTITY}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-details">{getLineDetailsLabel(categoryHint)}</Label>
            <Textarea
              id="cat-details"
              placeholder={getLineDetailsPlaceholder(categoryHint)}
              value={lineDetails}
              onChange={(e) => setLineDetails(e.target.value)}
              rows={4}
              className="resize-y"
              required
            />
            <p className="text-xs text-muted-foreground">
              Required — include size, brand, colour, length, or model so we can prepare the right product.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-navira-red hover:bg-navira-red/90 text-white"
              disabled={!lineDetails.trim()}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
