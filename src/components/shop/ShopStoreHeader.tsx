import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, History, Building, LayoutGrid } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { MobileMenu } from "@/components/MobileMenu";
import ShoppingCart from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/components/ShoppingCart";

type ShopStoreHeaderProps = {
  subtitle: string;
  user: { id: string } | null;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onLogout: () => void;
  onLogin: () => void;
};

export function ShopStoreHeader({
  subtitle,
  user,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onLogout,
  onLogin,
}: ShopStoreHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3">
        <button type="button" onClick={() => navigate("/")} className="min-w-0 shrink text-left">
          <BrandLogo size="sm" className="sm:hidden" />
          <BrandLogo size="md" className="hidden sm:flex" />
          <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">{subtitle}</p>
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="default"
            size="sm"
            className="bg-navira-navy text-white hover:bg-navira-navy/90"
            onClick={() => navigate("/shop/catalog?view=all")}
          >
            <LayoutGrid className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">All products</span>
          </Button>
          <ShoppingCart
            items={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onCheckout={onCheckout}
          />
          <div className="hidden items-center gap-2 sm:flex">
            <Button onClick={() => navigate("/company-info")} variant="outline" size="sm">
              <Building className="mr-1.5 h-3 w-3" />
              Info
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            {user ? (
              <>
                <Button onClick={() => navigate("/profile")} variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button onClick={() => navigate("/my-orders")} variant="outline" size="sm">
                  <History className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/shop/register")} variant="outline" size="sm" className="hidden md:inline-flex">
                  Create account
                </Button>
                <Button onClick={onLogin} variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </>
            )}
          </div>
          <MobileMenu
            title="Store menu"
            items={
              user
                ? [
                    { label: "View all products", onClick: () => navigate("/shop/catalog?view=all"), icon: <LayoutGrid className="h-4 w-4" /> },
                    { label: "Browse by product type", onClick: () => navigate("/shop/catalog"), icon: <LayoutGrid className="h-4 w-4" /> },
                    { label: "My account", onClick: () => navigate("/profile"), icon: <User className="h-4 w-4" /> },
                    { label: "My orders", onClick: () => navigate("/my-orders"), icon: <History className="h-4 w-4" /> },
                    { label: "Business details", onClick: () => navigate("/company-info"), icon: <Building className="h-4 w-4" /> },
                    { label: "Back to home", onClick: () => navigate("/"), icon: <ArrowLeft className="h-4 w-4" /> },
                    { label: "Log out", onClick: onLogout, variant: "destructive" },
                  ]
                : [
                    { label: "View all products", onClick: () => navigate("/shop/catalog?view=all"), icon: <LayoutGrid className="h-4 w-4" /> },
                    { label: "Browse by product type", onClick: () => navigate("/shop/catalog"), icon: <LayoutGrid className="h-4 w-4" /> },
                    { label: "Create account", onClick: () => navigate("/shop/register"), icon: <User className="h-4 w-4" /> },
                    { label: "Sign in", onClick: onLogin, icon: <User className="h-4 w-4" /> },
                    { label: "Business details", onClick: () => navigate("/company-info"), icon: <Building className="h-4 w-4" /> },
                    { label: "Back to home", onClick: () => navigate("/"), icon: <ArrowLeft className="h-4 w-4" /> },
                  ]
            }
          />
        </div>
      </div>
    </header>
  );
}
