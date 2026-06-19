import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { ProductSearchBar } from "@/components/shop/ProductSearchBar";
import { filterProductsBySearch, filterStringsBySearch, normalizeSearchQuery } from "@/lib/product-search";
import { ShopStoreHeader } from "@/components/shop/ShopStoreHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { TypicalItemRow } from "@/components/shop/TypicalItemRow";
import { useShopCart } from "@/hooks/useShopCart";
import { STORE_DEPARTMENTS } from "@/lib/catalog-departments";
import {
  getDepartmentInventory,
  getDepartmentItemList,
} from "@/lib/department-items";
import type { ShopProduct } from "@/types/shop";
import { Button } from "@/components/ui/button";

const ShopDepartment = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const department = STORE_DEPARTMENTS.find((d) => d.id === departmentId);

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);

  const { cart, addToCart, addCatalogToCart, updateCartQuantity, removeFromCart, checkout } =
    useShopCart();

  useEffect(() => {
    fetchProducts();
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ? { id: session.user.id } : null);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory")
      .select("id, item_name, item_code, description, category, quantity, unit_price, image_url")
      .order("item_name");

    setProducts(error ? [] : data || []);
    setLoading(false);
  };

  const typicalItems = useMemo(
    () => getDepartmentItemList(departmentId ?? ""),
    [departmentId]
  );

  const departmentStock = useMemo(
    () => (departmentId ? getDepartmentInventory(products, departmentId) : []),
    [products, departmentId]
  );

  const filteredTypicalItems = useMemo(
    () => filterStringsBySearch(typicalItems, searchTerm),
    [typicalItems, searchTerm]
  );

  const filteredStock = useMemo(
    () => filterProductsBySearch(departmentStock, searchTerm),
    [departmentStock, searchTerm]
  );

  const isSearching = normalizeSearchQuery(searchTerm).length > 0;

  if (!department) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground">Department not found.</p>
        <Button onClick={() => navigate("/")}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopStoreHeader
        subtitle={department.name}
        user={user}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => checkout(!!user)}
        onLogout={() => supabase.auth.signOut().then(() => setUser(null))}
        onLogin={() => navigate("/shop/login")}
      />

      <div className="relative border-b border-border bg-navira-navy text-white">
        <img
          src={department.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="container relative mx-auto px-4 py-8 md:py-10">
          <Button
            variant="secondary"
            size="sm"
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All departments
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">{department.name}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{department.description}</p>
          <ProductSearchBar
            className="mt-6"
            variant="onDark"
            placeholder="Search this department..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          {!loading && (
            <p className="mt-3 text-sm text-white/70">
              {isSearching
                ? `${filteredTypicalItems.length} typical · ${filteredStock.length} listed for "${searchTerm.trim()}"`
                : `${filteredTypicalItems.length} items in this aisle${filteredStock.length > 0 ? ` · ${filteredStock.length} listed online` : ""}`}
            </p>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="py-16 text-center text-muted-foreground">Loading...</p>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="mb-1 text-xl font-bold text-navira-navy dark:text-foreground">
                What you can find here
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Tap any line to order — add quantity and specifications (size, brand, colour, etc.).
              </p>

              {filteredTypicalItems.length === 0 ? (
                <div>
                  <p className="text-muted-foreground">
                    {isSearching ? `No items match "${searchTerm.trim()}".` : "No items listed."}
                  </p>
                  {isSearching && (
                    <Button variant="link" className="mt-2 h-auto p-0 text-navira-red" onClick={() => setSearchTerm("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTypicalItems.map((item) => (
                    <TypicalItemRow
                      key={item}
                      label={item}
                      sectionLabel={department.name}
                      categoryHint={department.name}
                      onAddCatalog={addCatalogToCart}
                    />
                  ))}
                </ul>
              )}
            </section>

            {isSearching && filteredStock.length === 0 && filteredTypicalItems.length > 0 && (
              <p className="mb-6 text-sm text-muted-foreground">
                No listed items match your search — see typical products above or{" "}
                <button type="button" className="text-navira-red hover:underline" onClick={() => setSearchTerm("")}>
                  clear search
                </button>
                .
              </p>
            )}

            {filteredStock.length > 0 && (
              <section>
                <h2 className="mb-1 text-xl font-bold text-navira-navy dark:text-foreground">
                  Available to order
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Items from our inventory in this department — add to cart to order.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredStock.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </section>
            )}

            {filteredStock.length === 0 && filteredTypicalItems.length > 0 && (
              <p className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                Order from the list above — our team will confirm price and availability.
              </p>
            )}
          </>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link to="/shop/catalog?view=all" className="text-navira-red hover:underline">
            View all products
          </Link>
        </p>
      </main>

    </div>
  );
};

export default ShopDepartment;
