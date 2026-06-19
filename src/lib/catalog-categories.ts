import type { ShopProduct } from "@/types/shop";
import { resolveDepartmentId } from "@/lib/catalog-departments";

export type ProductCategorySection = {
  slug: string;
  name: string;
  products: ShopProduct[];
  productCount: number;
};

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Group products by their inventory category (one section per distinct category). */
export function buildCategoryCatalog(
  products: ShopProduct[],
  departmentId?: string | null
): ProductCategorySection[] {
  const filtered = departmentId
    ? products.filter((p) => resolveDepartmentId(p.category) === departmentId)
    : products;

  const byCategory = new Map<string, ShopProduct[]>();

  for (const product of filtered) {
    const name = product.category?.trim() || "General";
    if (!byCategory.has(name)) byCategory.set(name, []);
    byCategory.get(name)!.push(product);
  }

  return Array.from(byCategory.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, items]) => {
      const sorted = items.sort((a, b) => a.item_name.localeCompare(b.item_name));
      return {
        slug: categorySlug(name),
        name,
        products: sorted,
        productCount: sorted.length,
      };
    });
}

export function findCategoryBySlug(
  sections: ProductCategorySection[],
  slug: string
): ProductCategorySection | undefined {
  return sections.find((s) => s.slug === slug);
}
