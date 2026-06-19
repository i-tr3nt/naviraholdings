import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchShopInventory } from "@/lib/shop-inventory";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft } from "lucide-react";
import { ProductSearchBar } from "@/components/shop/ProductSearchBar";
import { filterProductsBySearch, filterStringsBySearch, normalizeSearchQuery } from "@/lib/product-search";
import AIToolHelper from "@/components/AIToolHelper";
import { ShopStoreHeader } from "@/components/shop/ShopStoreHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { TypicalItemRow } from "@/components/shop/TypicalItemRow";
import { ProductShowcaseGrid } from "@/components/shop/ProductShowcaseGrid";
import { DepartmentBrowseGrid } from "@/components/shop/DepartmentBrowseGrid";
import { useShopCart } from "@/hooks/useShopCart";
import { STORE_DEPARTMENTS, resolveDepartmentId } from "@/lib/catalog-departments";
import { buildCategoryCatalog } from "@/lib/catalog-categories";
import { getShowcaseById, filterProductsByShowcase } from "@/lib/product-showcase";
import { getDepartmentItemList } from "@/lib/department-items";
import type { ShopProduct } from "@/types/shop";
import { Button } from "@/components/ui/button";

/** Typical items to show when inventory has no matches for a product type */
const SHOWCASE_TYPICAL_ITEMS: Record<string, string> = {
  "hand-tools": "tools",
  "power-tools": "tools",
  plumbing: "plumbing",
  paint: "paint",
  fasteners: "building",
  locks: "building",
  carpentry: "building",
  storage: "tools",
};

const ShopCatalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentFilter = searchParams.get("department");
  const productTypeFilter = searchParams.get("type");
  const viewAll = searchParams.get("view") === "all";
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const urlQuery = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);

  const updateSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const params = new URLSearchParams(searchParams);
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);
  const [user, setUser] = useState<{ id: string } | null>(null);

  const { cart, addToCart, addCatalogToCart, updateCartQuantity, removeFromCart, checkout } =
    useShopCart();

  const activeDepartment = STORE_DEPARTMENTS.find((d) => d.id === departmentFilter);
  const activeShowcase = getShowcaseById(productTypeFilter);

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
    setProducts(await fetchShopInventory());
    setLoading(false);
  };

  const baseProducts = useMemo(() => {
    let list = products;
    if (departmentFilter) {
      list = list.filter((p) => resolveDepartmentId(p.category) === departmentFilter);
    }
    if (productTypeFilter && activeShowcase) {
      list = filterProductsByShowcase(list, productTypeFilter);
    }
    return list;
  }, [products, departmentFilter, productTypeFilter, activeShowcase]);

  const filteredProducts = useMemo(
    () => filterProductsBySearch(baseProducts, searchTerm),
    [baseProducts, searchTerm]
  );

  const isSearching = normalizeSearchQuery(searchTerm).length > 0;

  const categories = useMemo(() => buildCategoryCatalog(filteredProducts, null), [filteredProducts]);

  const totalShown = filteredProducts.length;
  const totalInStore = products.length;

  const typicalItemsForShowcase = useMemo(() => {
    if (!productTypeFilter) return [];
    const deptId = SHOWCASE_TYPICAL_ITEMS[productTypeFilter];
    if (!deptId) return [];
    return filterStringsBySearch(getDepartmentItemList(deptId), searchTerm);
  }, [productTypeFilter, searchTerm]);

  const clearFilters = () => navigate(viewAll ? "/shop/catalog?view=all" : "/shop/catalog");

  const showBrowseHub =
    !loading && viewAll && !activeShowcase && !activeDepartment && !isSearching;
  const showTypePicker =
    !loading && !viewAll && !activeShowcase && !activeDepartment && !isSearching;
  const showProductList =
    !loading && (activeShowcase || activeDepartment || (viewAll && isSearching) || (!viewAll && isSearching));
  const showCategoryNav =
    showProductList && categories.length > 0 && (isSearching || activeShowcase);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const pageTitle = activeShowcase
    ? activeShowcase.label
    : activeDepartment
      ? activeDepartment.name
      : viewAll
        ? "View all products"
        : "Browse by product type";

  const pageDescription = activeShowcase
    ? `Products and items in our ${activeShowcase.label.toLowerCase()} range.`
    : activeDepartment
      ? activeDepartment.description
      : viewAll
        ? "Shop by department or product type — then search if you know what you need."
        : "Choose a product type below, or search to find something specific.";

  return (
    <div className="min-h-screen bg-background">
      <ShopStoreHeader
        subtitle="Browse products"
        user={user}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => checkout(!!user)}
        onLogout={handleLogout}
        onLogin={() => navigate("/shop/login")}
      />

      <div className="border-b border-border bg-navira-navy text-white">
        <div className="container mx-auto px-4 py-8 md:py-10">
          {(activeShowcase || activeDepartment) && (
            <Button variant="secondary" size="sm" className="mb-4" onClick={clearFilters}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {viewAll || activeShowcase ? "Back to all products" : "All product types"}
            </Button>
          )}
          {viewAll && !activeShowcase && !activeDepartment && (
            <Button variant="secondary" size="sm" className="mb-4" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          )}
          {activeShowcase && (
            <div className="mb-6 overflow-hidden rounded-lg border border-white/20 md:flex md:max-w-2xl">
              <img
                src={activeShowcase.image}
                alt=""
                className="h-32 w-full object-cover md:h-auto md:w-48"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold md:text-3xl">{pageTitle}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{pageDescription}</p>
          <ProductSearchBar
            className="mt-6"
            variant="onDark"
            placeholder={
              activeShowcase
                ? `Search in ${activeShowcase.label}...`
                : "Search all products by name, code, or category..."
            }
            value={searchTerm}
            onChange={updateSearch}
          />
          {!loading && (
            <p className="mt-3 text-sm text-white/70">
              {isSearching
                ? `${totalShown} result${totalShown !== 1 ? "s" : ""} for "${searchTerm.trim()}"`
                : `${totalShown} product${totalShown !== 1 ? "s" : ""} in this section`}
              {!isSearching && !activeShowcase && !activeDepartment && ` · ${totalInStore} total in store`}
            </p>
          )}
        </div>
      </div>

      {showBrowseHub && (
        <>
          <DepartmentBrowseGrid />
          <ProductShowcaseGrid />
        </>
      )}

      {showTypePicker && <ProductShowcaseGrid />}

      {showCategoryNav && (
        <nav className="sticky top-[57px] z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3 scrollbar-thin">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#category-${cat.slug}`}
                className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-navira-red hover:text-navira-red"
              >
                {cat.name}
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                  {cat.productCount}
                </Badge>
              </a>
            ))}
          </div>
        </nav>
      )}

      <main id="catalog-products" className="container mx-auto scroll-mt-36 px-4 py-8">
        {loading && (
          <div className="py-16 text-center text-muted-foreground">Loading products...</div>
        )}

        {!loading && isSearching && totalShown === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-40" />
            <p className="text-lg text-muted-foreground">
              No products match &ldquo;{searchTerm.trim()}&rdquo;
              {activeShowcase ? ` in ${activeShowcase.label}` : ""}.
            </p>
            <Button variant="link" className="mt-2 text-navira-red" onClick={() => updateSearch("")}>
              Clear search
            </Button>
          </div>
        )}

        {!loading && activeShowcase && !isSearching && totalShown === 0 && (
          <div className="space-y-8">
            <p className="text-center text-muted-foreground">
              No items are listed online in this section yet. We often stock the lines below — visit the store or
              contact us to order.
            </p>
            {typicalItemsForShowcase.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-navira-navy dark:text-foreground">
                  Items typically available in {activeShowcase.label}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {typicalItemsForShowcase.map((item) => (
                    <TypicalItemRow
                      key={item}
                      label={item}
                      sectionLabel={activeShowcase!.label}
                      categoryHint={activeShowcase!.label}
                      onAddCatalog={addCatalogToCart}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!loading && showTypePicker && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Select a product type above to see items in that range.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-navira-red/40 text-navira-red hover:bg-navira-red/5"
              onClick={() => navigate("/shop/catalog?view=all")}
            >
              View all products
            </Button>
          </div>
        )}

        {showProductList &&
          categories.map((cat) => (
            <section
              key={cat.slug}
              id={`category-${cat.slug}`}
              className="mb-14 scroll-mt-40 border-b border-border pb-14 last:border-0"
            >
              {categories.length > 1 && (
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-l-4 border-navira-red pl-4">
                  <div>
                    <h2 className="text-xl font-bold text-navira-navy dark:text-foreground">{cat.name}</h2>
                  </div>
                  <Badge variant="outline" className="border-navira-red/40 text-navira-red">
                    {cat.productCount} item{cat.productCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </section>
          ))}

        {!loading && activeShowcase && isSearching && totalShown === 0 && typicalItemsForShowcase.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Matching items we typically stock</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {typicalItemsForShowcase.map((item) => (
                <TypicalItemRow
                  key={item}
                  label={item}
                  sectionLabel={activeShowcase!.label}
                  categoryHint={activeShowcase!.label}
                  onAddCatalog={addCatalogToCart}
                />
              ))}
            </ul>
          </div>
        )}

        {!loading && viewAll && isSearching && totalShown === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Try a different search, or pick a department or product type above.
          </p>
        )}
      </main>

      <AIToolHelper products={products} />
    </div>
  );
};

export default ShopCatalog;
