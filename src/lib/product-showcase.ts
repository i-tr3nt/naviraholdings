import { hardwareImages } from "@/lib/hardware-images";
import type { ProductCategorySection } from "@/lib/catalog-categories";
import type { ShopProduct } from "@/types/shop";

export type ProductShowcaseCategory = {
  id: string;
  label: string;
  image: string;
  matchers: string[];
};

export const PRODUCT_SHOWCASE_CATEGORIES: ProductShowcaseCategory[] = [
  {
    id: "hand-tools",
    label: "Hand tools & socket sets",
    image: hardwareImages.ratchetsAisle,
    matchers: ["hand tool", "socket", "wrench", "ratchet", "plier", "spanner", "hammer", "screwdriver", "allen"],
  },
  {
    id: "power-tools",
    label: "Power tools",
    image: hardwareImages.powerToolsBench,
    matchers: ["power", "drill", "sander", "grinder", "saw"],
  },
  {
    id: "plumbing",
    label: "Plumbing & bathroom",
    image: hardwareImages.plumbingInstall,
    matchers: ["plumb", "pipe", "tap", "faucet", "sink", "bath", "toilet", "drain"],
  },
  {
    id: "paint",
    label: "Paint & decorating",
    image: hardwareImages.paintCansWood,
    matchers: ["paint", "brush", "roller", "primer", "varnish", "decor"],
  },
  {
    id: "fasteners",
    label: "Screws & fasteners",
    image: hardwareImages.screwsOrganizer,
    matchers: ["screw", "nail", "bolt", "fastener", "nut", "washer", "anchor"],
  },
  {
    id: "locks",
    label: "Locks & door hardware",
    image: hardwareImages.doorLocks,
    matchers: ["lock", "door", "hinge", "handle", "latch"],
  },
  {
    id: "carpentry",
    label: "Carpentry & timber",
    image: hardwareImages.carpentryBench,
    matchers: ["carpent", "timber", "lumber", "wood", "plane", "chisel"],
  },
  {
    id: "storage",
    label: "Tool kits & storage",
    image: hardwareImages.toolbox,
    matchers: ["toolbox", "tool box", "storage", "kit", "bag", "organizer"],
  },
];

export function getShowcaseById(id: string | null): ProductShowcaseCategory | undefined {
  if (!id) return undefined;
  return PRODUCT_SHOWCASE_CATEGORIES.find((c) => c.id === id);
}

export function productMatchesShowcase(product: ShopProduct, showcase: ProductShowcaseCategory): boolean {
  const haystack = `${product.category} ${product.item_name} ${product.description ?? ""}`.toLowerCase();
  return showcase.matchers.some((m) => haystack.includes(m));
}

export function filterProductsByShowcase(products: ShopProduct[], showcaseId: string): ShopProduct[] {
  const showcase = getShowcaseById(showcaseId);
  if (!showcase) return products;
  return products.filter((p) => productMatchesShowcase(p, showcase));
}

export function findShowcaseScrollTarget(
  showcase: ProductShowcaseCategory,
  categories: ProductCategorySection[]
): string | null {
  for (const cat of categories) {
    const name = cat.name.toLowerCase();
    if (showcase.matchers.some((m) => name.includes(m))) {
      return cat.slug;
    }
  }

  for (const cat of categories) {
    const matchesProduct = cat.products.some((p) => {
      const haystack = `${p.category} ${p.item_name} ${p.description ?? ""}`.toLowerCase();
      return showcase.matchers.some((m) => haystack.includes(m));
    });
    if (matchesProduct) return cat.slug;
  }

  return categories[0]?.slug ?? null;
}
