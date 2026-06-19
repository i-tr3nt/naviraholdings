import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isDemoMode } from "@/lib/demo-mode";
import type { CartItem } from "@/components/ShoppingCart";
import type { AddToCartPayload, AddCatalogToCartPayload } from "@/types/shop";
import { catalogCartLineId, CATALOG_ITEM_CODE } from "@/lib/catalog-cart";
import { SHOP_CART_MAX_QUANTITY } from "@/lib/shop-availability";

export const CART_STORAGE_KEY = "navira-shop-cart";

function newLineId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    lineId: item.lineId || newLineId(),
    line_details: item.line_details?.trim() || undefined,
    is_catalog_line: item.is_catalog_line ?? item.id.startsWith("catalog:"),
    price_on_request: item.price_on_request ?? item.id.startsWith("catalog:"),
  };
}

function loadCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return parsed.map(normalizeCartItem);
  } catch {
    return [];
  }
}

export function clearShopCartStorage(): void {
  sessionStorage.removeItem(CART_STORAGE_KEY);
}

function mergeLineDetails(base: string | undefined, extra: string): string | undefined {
  const parts = [base?.trim(), extra.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function useShopCart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ product, quantity, lineDetails }: AddToCartPayload) => {
    const details = lineDetails.trim();
    const qty = Math.min(SHOP_CART_MAX_QUANTITY, Math.max(1, quantity));

    const existing = cart.find(
      (item) =>
        !item.is_catalog_line &&
        item.id === product.id &&
        (item.line_details || "") === details
    );

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > SHOP_CART_MAX_QUANTITY) {
        toast({
          title: "Quantity limit",
          description: `You can add up to ${SHOP_CART_MAX_QUANTITY} of this item per order.`,
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.lineId === existing.lineId ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          lineId: newLineId(),
          id: product.id,
          item_name: product.item_name,
          item_code: product.item_code,
          unit_price: Number(product.unit_price),
          quantity: qty,
          available_stock: SHOP_CART_MAX_QUANTITY,
          line_details: details || undefined,
          is_catalog_line: false,
          price_on_request: false,
        },
      ]);
    }

    toast({
      title: "Added to Cart",
      description: details
        ? `${product.item_name} (${qty}) with your specifications.`
        : `${product.item_name} (${qty}) added to your cart.`,
    });
  };

  const addCatalogToCart = ({
    itemLabel,
    sectionLabel,
    categoryHint,
    quantity,
    lineDetails,
  }: AddCatalogToCartPayload) => {
    const details = lineDetails.trim();
    if (!details) {
      toast({
        title: "Details required",
        description: "Please describe size, brand, or specifications for this item.",
        variant: "destructive",
      });
      return;
    }

    const sectionKey = sectionLabel.toLowerCase().replace(/\s+/g, "-");
    const catalogId = catalogCartLineId(sectionKey, itemLabel);
    const qty = Math.min(SHOP_CART_MAX_QUANTITY, Math.max(1, quantity));
    const fullDetails = mergeLineDetails(`Section: ${sectionLabel}`, details);

    const existing = cart.find(
      (item) =>
        item.is_catalog_line &&
        item.id === catalogId &&
        (item.line_details || "") === (fullDetails || "")
    );

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > SHOP_CART_MAX_QUANTITY) {
        toast({
          title: "Quantity limit",
          description: `You can add up to ${SHOP_CART_MAX_QUANTITY} of this item per order.`,
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.lineId === existing.lineId ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          lineId: newLineId(),
          id: catalogId,
          item_name: itemLabel,
          item_code: CATALOG_ITEM_CODE,
          unit_price: 0,
          quantity: qty,
          available_stock: SHOP_CART_MAX_QUANTITY,
          line_details: fullDetails,
          is_catalog_line: true,
          price_on_request: true,
        },
      ]);
    }

    toast({
      title: "Added to Cart",
      description: `${itemLabel} — we'll confirm the price for your order.`,
    });
  };

  const updateCartQuantity = (lineId: string, quantity: number) => {
    const qty = Math.min(SHOP_CART_MAX_QUANTITY, Math.max(1, quantity));
    setCart(cart.map((item) => (item.lineId === lineId ? { ...item, quantity: qty } : item)));
  };

  const removeFromCart = (lineId: string) => {
    setCart(cart.filter((item) => item.lineId !== lineId));
    toast({ title: "Removed", description: "Item removed from cart." });
  };

  const clearCart = () => {
    setCart([]);
    clearShopCartStorage();
  };

  const checkout = (isLoggedIn: boolean) => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart first.",
        variant: "destructive",
      });
      return;
    }
    if (!isLoggedIn && !isDemoMode()) {
      toast({
        title: "Sign in to place your order",
        description: "Browse freely — login is only needed when you check out.",
      });
      navigate(`/shop/login?redirect=${encodeURIComponent("/checkout")}`, { state: { cart } });
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  return {
    cart,
    addToCart,
    addCatalogToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkout,
  };
}
