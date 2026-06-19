import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { ProductCategorySection } from "@/lib/catalog-categories";

type CategoryBrowseGridProps = {
  categories: ProductCategorySection[];
  onSelectCategory: (slug: string) => void;
};

export function CategoryBrowseGrid({ categories, onSelectCategory }: CategoryBrowseGridProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="mb-2 text-xl font-bold text-navira-navy dark:text-foreground">Browse by category</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Choose a category to jump to the full product list for that aisle.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((cat) => (
          <Card
            key={cat.slug}
            className="cursor-pointer border-border transition-all hover:border-navira-red/50 hover:shadow-md"
            onClick={() => onSelectCategory(cat.slug)}
          >
            <CardContent className="flex flex-col items-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-navira-navy/10">
                <Package className="h-5 w-5 text-navira-red" />
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{cat.name}</h3>
              <Badge variant="secondary" className="mt-2 text-xs">
                {cat.productCount} item{cat.productCount !== 1 ? "s" : ""}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
