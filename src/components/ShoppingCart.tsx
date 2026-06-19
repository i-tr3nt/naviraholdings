import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";

export interface CartItem {
  lineId: string;
  id: string;
  item_name: string;
  item_code: string;
  unit_price: number;
  quantity: number;
  available_stock: number;
  line_details?: string;
  is_catalog_line?: boolean;
  price_on_request?: boolean;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemoveItem: (lineId: string) => void;
  onCheckout: () => void;
}

const ShoppingCart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }: ShoppingCartProps) => {
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-primary text-primary hover:bg-primary hover:text-white">
          <CartIcon className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-primary/20 bg-hardware-dark text-white sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-primary">Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-hardware-light">
              <CartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.lineId}
                    className="bg-hardware-steel/20 border border-primary/10 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">{item.item_name}</h4>
                        <p className="text-sm text-hardware-light">
                          {item.price_on_request ? "Price on request" : item.item_code}
                        </p>
                        {item.line_details && (
                          <p className="mt-1 text-xs text-hardware-light/90 italic">
                            {item.line_details}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.lineId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-primary/20"
                          onClick={() => onUpdateQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-primary/20"
                          onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                          disabled={item.quantity >= item.available_stock}
                          title={
                            item.quantity >= item.available_stock
                              ? `Maximum ${item.available_stock} per item`
                              : undefined
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        {item.price_on_request ? (
                          <p className="text-sm text-amber-300">Confirmed at store</p>
                        ) : (
                          <p className="text-sm text-hardware-light">{formatCurrency(item.unit_price)} each</p>
                        )}
                        <p className="font-semibold text-primary">
                          {item.price_on_request
                            ? "TBC"
                            : formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/20 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
