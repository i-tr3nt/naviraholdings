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
import { ProductImage } from "@/components/ProductImage";
import { formatCurrency } from "@/lib/currency";
import { getLineDetailsLabel, getLineDetailsPlaceholder } from "@/lib/product-order-hints";
import { SHOP_CART_MAX_QUANTITY } from "@/lib/shop-availability";
import type { AddToCartPayload, ShopProduct } from "@/types/shop";
import { ShoppingCart } from "lucide-react";

type ProductOrderDialogProps = {
  product: ShopProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: AddToCartPayload) => void;
};

export function ProductOrderDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
}: ProductOrderDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [lineDetails, setLineDetails] = useState("");

  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      setLineDetails("");
    }
  }, [open, product?.id]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.min(SHOP_CART_MAX_QUANTITY, Math.max(1, quantity));
    onConfirm({
      product,
      quantity: qty,
      lineDetails: lineDetails.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 text-left leading-snug">{product.item_name}</DialogTitle>
          <DialogDescription className="text-left">
            {product.item_code} · {product.category}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border border-border">
          <ProductImage
            src={product.image_url}
            alt={product.item_name}
            category={product.category}
            className="rounded-none"
          />
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        <p className="text-2xl font-bold text-navira-navy dark:text-primary">
          {formatCurrency(Number(product.unit_price))}
          <Badge variant="secondary" className="ml-2 align-middle text-xs font-normal">
            Available
          </Badge>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-qty">Quantity</Label>
            <Input
              id="order-qty"
              type="number"
              min={1}
              max={SHOP_CART_MAX_QUANTITY}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order-details">{getLineDetailsLabel(product.category)}</Label>
            <Textarea
              id="order-details"
              placeholder={getLineDetailsPlaceholder(product.category)}
              value={lineDetails}
              onChange={(e) => setLineDetails(e.target.value)}
              rows={3}
              className="resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Tell us size, brand, colour, length, or anything else we should know for this line.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-navira-red hover:bg-navira-red/90 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
