import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, ArrowLeft, User, History, Building } from "lucide-react";
import { ProductSearchBar } from "@/components/shop/ProductSearchBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { filterProductsBySearch, normalizeSearchQuery } from "@/lib/product-search";
import { useShopCart } from "@/hooks/useShopCart";
import BrandLogo from "@/components/BrandLogo";
import ShoppingCart from "@/components/ShoppingCart";
import AIToolHelper from "@/components/AIToolHelper";
import { MobileMenu } from "@/components/MobileMenu";
import { hardwareImages } from "@/lib/hardware-images";
import type { ShopProduct } from "@/types/shop";
const Shop = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [user, setUser] = useState<any>(null);
  const { cart, addToCart, updateCartQuantity, removeFromCart, checkout } = useShopCart();

  useEffect(() => {
    fetchProducts();
    checkUser();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };
  const fetchProducts = async () => {
    // Fetch products without requiring authentication
    const {
      data,
      error
    } = await supabase.from("inventory").select("id, item_name, item_code, description, category, quantity, unit_price, image_url").order("item_name");
    if (error) {
      console.error("Error fetching products:", error);
      // Don't show error to users - products will display empty
      setProducts([]);
    } else {
      setProducts(data || []);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    filtered = filterProductsBySearch(filtered, searchTerm);
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  );
  const handleCheckout = () => checkout(!!user);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully."
    });
  };
  return <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3">
          <button type="button" onClick={() => navigate("/")} className="min-w-0 shrink text-left">
            <BrandLogo size="sm" className="sm:hidden" />
            <BrandLogo size="md" className="hidden sm:flex" />
            <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">Online Store</p>
          </button>
          <div className="flex shrink-0 items-center gap-1.5">
            <ShoppingCart
              items={cart}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
            {!user && (
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                onClick={() => navigate("/shop/login")}
                aria-label="Login"
              >
                <User className="h-4 w-4" />
              </Button>
            )}
            {!user && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => navigate("/shop/register")}
              >
                Create account
              </Button>
            )}
            <div className="hidden items-center gap-2 sm:flex">
              <Button onClick={() => navigate("/company-info")} variant="outline" size="sm">
                <Building className="mr-1.5 h-3 w-3" />
                <span className="hidden md:inline">Business details</span>
                <span className="md:hidden">Info</span>
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
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
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/shop/login")} variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
            <MobileMenu
              title="Store menu"
              items={
                user
                  ? [
                      { label: "My account", onClick: () => navigate("/profile"), icon: <User className="h-4 w-4" /> },
                      { label: "My orders", onClick: () => navigate("/my-orders"), icon: <History className="h-4 w-4" /> },
                      { label: "Business details", onClick: () => navigate("/company-info"), icon: <Building className="h-4 w-4" /> },
                      { label: "Back to home", onClick: () => navigate("/"), icon: <ArrowLeft className="h-4 w-4" /> },
                      { label: "Log out", onClick: handleLogout, variant: "destructive" },
                    ]
                  : [
                      { label: "Create account", onClick: () => navigate("/shop/register"), icon: <User className="h-4 w-4" /> },
                      { label: "Sign in", onClick: () => navigate("/shop/login"), icon: <User className="h-4 w-4" /> },
                      { label: "Business details", onClick: () => navigate("/company-info"), icon: <Building className="h-4 w-4" /> },
                      { label: "Back to home", onClick: () => navigate("/"), icon: <ArrowLeft className="h-4 w-4" /> },
                    ]
              }
            />
          </div>
        </div>
      </header>

      <div className="relative h-32 overflow-hidden border-b border-border sm:h-40 md:h-48">
        <img
          src={hardwareImages.powerToolsBench}
          alt="Hand tools and hardware supplies"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 flex items-center bg-navira-navy/75 px-4">
          <div className="container mx-auto">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Shop our hardware range</h2>
            <p className="mt-1 text-sm text-white/85">Tools, materials, and essentials — order online for pickup</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <ProductSearchBar
                className="flex-1 max-w-none"
                placeholder="Search by name, code, category, or description..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-40" />
            <p className="text-lg text-muted-foreground">
              {normalizeSearchQuery(searchTerm)
                ? `No products match "${searchTerm.trim()}"`
                : selectedCategory !== "all"
                  ? "No products in this category."
                  : "No products listed right now."}
            </p>
            {normalizeSearchQuery(searchTerm) && (
              <Button variant="link" className="mt-2 text-navira-red" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </main>

      <AIToolHelper products={products} />
    </div>;
};
export default Shop;