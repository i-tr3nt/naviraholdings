import { useNavigate, useSearchParams } from "react-router-dom";
import { PRODUCT_SHOWCASE_CATEGORIES } from "@/lib/product-showcase";

export function ProductShowcaseGrid() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preserveViewAll = searchParams.get("view") === "all";

  const goToType = (id: string) => {
    const params = new URLSearchParams();
    params.set("type", id);
    if (preserveViewAll) params.set("view", "all");
    navigate(`/shop/catalog?${params.toString()}`);
  };

  return (
    <section className="bg-navira-navy py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Shop by product type</h2>
          <p className="mt-2 text-white/80">Select a category to see all items in that range</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PRODUCT_SHOWCASE_CATEGORIES.map(({ id, label, image }) => (
            <button
              key={id}
              type="button"
              onClick={() => goToType(id)}
              className="group overflow-hidden rounded-lg text-left shadow-lg transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-navira-red"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image}
                  alt={label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="bg-navira-navy px-3 py-3 text-center sm:px-4">
                <p className="text-xs font-semibold leading-snug text-white sm:text-sm">{label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
