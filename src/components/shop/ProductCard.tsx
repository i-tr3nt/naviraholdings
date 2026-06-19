import { useState } from "react";
import { ShoppingCart as CartIcon, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ProductImage";
import { ProductOrderDialog } from "@/components/shop/ProductOrderDialog";
import { formatCurrency } from "@/lib/currency";
import type { AddToCartPayload, ShopProduct } from "@/types/shop";

type ProductCardProps = {
  product: ShopProduct;
  onAddToCart: (payload: AddToCartPayload) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={openDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDialog();
          }
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden border-border bg-card transition-all hover:border-navira-red/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navira-red"
      >
        <ProductImage
          src={product.image_url}
          alt={product.item_name}
          category={product.category}
          className="rounded-none border-b border-border"
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-1 line-clamp-2 text-lg group-hover:text-navira-red">
                {product.item_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{product.item_code}</p>
            </div>
            <Badge variant="outline" className="shrink-0 border-navira-red/40 text-navira-red">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col">
          <p className="mb-4 min-h-[40px] line-clamp-2 text-sm text-muted-foreground">
            {product.description || "Tap to choose quantity and specify what you need"}
          </p>
          <div className="mb-4">
            <p className="text-2xl font-bold text-navira-navy dark:text-primary">
              {formatCurrency(Number(product.unit_price))}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              Available · tap for details
            </p>
          </div>
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDialog();
            }}
            className="mt-auto w-full bg-navira-red hover:bg-navira-red/90 text-white"
          >
            <CartIcon className="mr-2 h-4 w-4" />
            Choose &amp; add to cart
            <ChevronRight className="ml-auto h-4 w-4 opacity-80" />
          </Button>
        </CardContent>
      </Card>

      <ProductOrderDialog
        product={product}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={onAddToCart}
      />
    </>
  );
}
