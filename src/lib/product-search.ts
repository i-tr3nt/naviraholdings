/** Shared product / catalog search helpers (matching is case-insensitive). */

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

/** True if haystack matches query (full phrase or all words). */
export function matchesSearchQuery(haystack: string, query: string): boolean {
  const q = normalizeSearchQuery(query);
  if (!q) return true;

  const text = haystack.toLowerCase();
  if (text.includes(q)) return true;

  const words = q.split(" ").filter((w) => w.length > 0);
  return words.length > 0 && words.every((word) => text.includes(word));
}

export type SearchableProduct = {
  item_name: string;
  item_code: string;
  category: string;
  description?: string | null;
};

export function productSearchHaystack(product: SearchableProduct): string {
  return [product.item_name, product.item_code, product.category, product.description ?? ""]
    .filter(Boolean)
    .join(" ");
}

export function filterProductsBySearch<T extends SearchableProduct>(
  products: T[],
  query: string
): T[] {
  const q = normalizeSearchQuery(query);
  if (!q) return products;
  return products.filter((p) => matchesSearchQuery(productSearchHaystack(p), q));
}

export function filterStringsBySearch(items: string[], query: string): string[] {
  const q = normalizeSearchQuery(query);
  if (!q) return items;
  return items.filter((item) => matchesSearchQuery(item, q));
}
