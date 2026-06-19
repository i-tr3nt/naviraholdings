import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Wrench, ArrowLeft, CreditCard, Banknote, Smartphone } from "lucide-react";
import { CartItem } from "@/components/ShoppingCart";
import { formatCurrency } from "@/lib/currency";
import {
  ensureCustomerProfileFromUser,
  formatDeliveryAddress,
  formatCustomerContact,
} from "@/lib/customer-profile";
import { CART_STORAGE_KEY, clearShopCartStorage } from "@/hooks/useShopCart";

function loadCartFromSession(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return parsed.map((item) => ({
      ...item,
      lineId: item.lineId || item.id,
      line_details: item.line_details?.trim() || undefined,
      is_catalog_line: item.is_catalog_line ?? item.id.startsWith("catalog:"),
      price_on_request: item.price_on_request ?? item.id.startsWith("catalog:"),
    }));
  } catch {
    return [];
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const stateCart = (location.state as { cart?: CartItem[] } | null)?.cart;
  const cart: CartItem[] = stateCart?.length ? stateCart : loadCartFromSession();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    contact: "",
    email: "",
    addressLine: "",
    city: "Harare",
    deliveryNotes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const pricedTotal = cart.reduce(
    (sum, item) => (item.price_on_request ? sum : sum + item.unit_price * item.quantity),
    0
  );
  const hasPriceOnRequest = cart.some((item) => item.price_on_request);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate(`/shop/login?redirect=${encodeURIComponent("/checkout")}`, {
          state: { cart },
          replace: true,
        });
        return;
      }

      const profile = await ensureCustomerProfileFromUser(user);
      if (profile) {
        setCustomerInfo({
          name: profile.fullName,
          contact: profile.phone,
          email: user.email || "",
          addressLine: profile.addressLine,
          city: profile.city,
          deliveryNotes: profile.deliveryNotes || "",
        });
      } else {
        setCustomerInfo((prev) => ({
          ...prev,
          email: user.email || "",
          name: (user.user_metadata?.name as string) || prev.name,
          contact: (user.user_metadata?.phone as string) || prev.contact,
          addressLine: (user.user_metadata?.address_line as string) || prev.addressLine,
          city: (user.user_metadata?.city as string) || prev.city,
        }));
      }
      setAuthChecked(true);
    };
    init();
  }, [navigate, cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name.trim() || !customerInfo.contact.trim() || !customerInfo.addressLine.trim()) {
      toast({
        title: "Missing details",
        description: "Please complete your name, phone, and delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate(`/shop/login?redirect=${encodeURIComponent("/checkout")}`, { state: { cart } });
        return;
      }

      const { data: saleNumberData, error: saleNumberError } = await supabase.rpc("generate_sale_number");
      if (saleNumberError) throw saleNumberError;

      const deliveryAddress = formatDeliveryAddress({
        fullName: customerInfo.name,
        phone: customerInfo.contact,
        addressLine: customerInfo.addressLine,
        city: customerInfo.city,
        deliveryNotes: customerInfo.deliveryNotes,
      });

      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          sale_number: saleNumberData,
          total_amount: pricedTotal,
          payment_method: paymentMethod,
          customer_name: customerInfo.name.trim(),
          customer_contact: formatCustomerContact({
            fullName: customerInfo.name,
            phone: customerInfo.contact,
            addressLine: customerInfo.addressLine,
            city: customerInfo.city,
          }),
          customer_email: customerInfo.email.trim() || user.email || null,
          delivery_address: deliveryAddress,
          sold_by: null,
          is_online: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      for (const item of cart) {
        const isCatalog = item.is_catalog_line || item.id.startsWith("catalog:");
        const lineSubtotal = item.price_on_request ? 0 : item.unit_price * item.quantity;

        const { error: itemError } = await supabase.from("sale_items").insert({
          sale_id: saleData.id,
          inventory_id: isCatalog ? null : item.id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.price_on_request ? 0 : item.unit_price,
          subtotal: lineSubtotal,
          customer_notes: item.line_details?.trim() || null,
          is_catalog_line: isCatalog,
        });
        if (itemError) throw itemError;

        if (!isCatalog) {
          const { data: currentItem } = await supabase
            .from("inventory")
            .select("quantity")
            .eq("id", item.id)
            .single();

          if (currentItem) {
            await supabase
              .from("inventory")
              .update({ quantity: Math.max(0, currentItem.quantity - item.quantity) })
              .eq("id", item.id);
          }
        }
      }

      clearShopCartStorage();

      toast({
        title: "Order placed successfully!",
        description: `Your order number is ${saleNumberData}`,
      });

      navigate("/order-confirmation", {
        state: {
          saleNumber: saleNumberData,
          total: pricedTotal,
          hasPriceOnRequest,
          customerInfo,
        },
      });
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => navigate("/shop")} className="bg-navira-red hover:bg-navira-red/90 text-white">
              Continue shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-navira-red" />
            <div>
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">NAVIRA HARDWARE</p>
            </div>
          </div>
          <Button onClick={() => navigate("/shop")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to shop
          </Button>
        </div>
      </header>

      <main className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Confirm your details below. Update them anytime in{" "}
                <button
                  type="button"
                  className="text-navira-red hover:underline"
                  onClick={() => navigate("/profile")}
                >
                  My account
                </button>
                .
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Full name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone *</Label>
                    <Input
                      id="contact"
                      type="tel"
                      value={customerInfo.contact}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Delivery / pickup address *</Label>
                    <Input
                      id="address"
                      value={customerInfo.addressLine}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, addressLine: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Order notes</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.deliveryNotes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryNotes: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Payment method *</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex cursor-pointer items-center gap-2">
                        <Banknote className="h-5 w-5" />
                        Cash on delivery / pickup
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex cursor-pointer items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile" className="flex cursor-pointer items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Mobile money
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-navira-red hover:bg-navira-red/90 text-white"
                  size="lg"
                >
                  {isProcessing
                    ? "Processing..."
                    : hasPriceOnRequest
                      ? `Place order — ${formatCurrency(pricedTotal)}+ (some lines TBC)`
                      : `Place order — ${formatCurrency(pricedTotal)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.lineId} className="border-b pb-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span>
                      {item.item_name} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-medium">
                      {item.price_on_request ? "TBC" : formatCurrency(item.quantity * item.unit_price)}
                    </span>
                  </div>
                  {item.line_details && (
                    <p className="mt-0.5 text-xs text-muted-foreground italic">{item.line_details}</p>
                  )}
                </div>
              ))}
              {hasPriceOnRequest && (
                <p className="text-xs text-muted-foreground">
                  Lines marked TBC will be priced when we confirm your order.
                </p>
              )}
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total{hasPriceOnRequest ? " (confirmed lines)" : ""}</span>
                <span className="text-navira-red">{formatCurrency(pricedTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
