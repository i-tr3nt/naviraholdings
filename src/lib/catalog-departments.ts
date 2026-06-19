import type { ShopProduct } from "@/types/shop";
import { getDepartmentImage } from "@/lib/hardware-images";

export type StoreDepartment = {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryMatchers: string[];
};

export const STORE_DEPARTMENTS: StoreDepartment[] = [
  {
    id: "tools",
    name: "Tools & Equipment",
    description: "Hand tools, power tools, and jobsite essentials",
    image: getDepartmentImage("Tools & Equipment"),
    categoryMatchers: ["tool", "power", "drill", "saw", "hammer", "wrench", "ratchet", "plier", "sander", "grinder"],
  },
  {
    id: "building",
    name: "Building Materials",
    description: "Cement, timber, fasteners, and structural supplies",
    image: getDepartmentImage("Building Materials"),
    categoryMatchers: ["build", "cement", "timber", "lumber", "wood", "nail", "screw", "bolt", "fastener", "steel", "roof", "brick", "sand", "aggregate", "door", "lock", "hinge"],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Pipes, fittings, taps, and drainage",
    image: getDepartmentImage("Plumbing"),
    categoryMatchers: ["plumb", "pipe", "tap", "faucet", "drain", "toilet", "sink", "bath", "shower", "pvc", "geyser"],
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Cables, switches, lighting, and safety gear",
    image: getDepartmentImage("Electrical"),
    categoryMatchers: ["electr", "wire", "cable", "switch", "light", "lamp", "bulb", "socket", "breaker", "fuse", "generator", "solar", "battery"],
  },
  {
    id: "paint",
    name: "Paint & Finishes",
    description: "Interior, exterior, brushes, and prep",
    image: getDepartmentImage("Paint & Finishes"),
    categoryMatchers: ["paint", "varnish", "brush", "roller", "primer", "thinners", "thinner", "finish", "sealant", "adhesive", "glue"],
  },
  {
    id: "garden",
    name: "Garden & Outdoor",
    description: "Garden tools, irrigation, and outdoor care",
    image: getDepartmentImage("Garden & Outdoor"),
    categoryMatchers: ["garden", "outdoor", "lawn", "irrigation", "hose", "rake", "shovel", "wheelbarrow", "plant", "fence"],
  },
];

const departmentOrder = STORE_DEPARTMENTS.map((d) => d.id);

export function resolveDepartmentId(category: string): string {
  const normalized = category.toLowerCase().trim();
  for (const dept of STORE_DEPARTMENTS) {
    if (dept.categoryMatchers.some((m) => normalized.includes(m))) {
      return dept.id;
    }
  }
  return "building";
}

export type CategoryGroup = {
  name: string;
  products: ShopProduct[];
};

export type DepartmentCatalog = StoreDepartment & {
  categories: CategoryGroup[];
  productCount: number;
};

export function buildDepartmentCatalog(products: ShopProduct[]): DepartmentCatalog[] {
  const byDept = new Map<string, Map<string, ShopProduct[]>>();

  for (const product of products) {
    const deptId = resolveDepartmentId(product.category);
    if (!byDept.has(deptId)) byDept.set(deptId, new Map());
    const catMap = byDept.get(deptId)!;
    const catName = product.category?.trim() || "General";
    if (!catMap.has(catName)) catMap.set(catName, []);
    catMap.get(catName)!.push(product);
  }

  return STORE_DEPARTMENTS.map((dept) => {
    const catMap = byDept.get(dept.id);
    const categories: CategoryGroup[] = catMap
      ? Array.from(catMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, items]) => ({
            name,
            products: items.sort((x, y) => x.item_name.localeCompare(y.item_name)),
          }))
      : [];

    const productCount = categories.reduce((sum, c) => sum + c.products.length, 0);

    return { ...dept, categories, productCount };
  }).sort((a, b) => departmentOrder.indexOf(a.id) - departmentOrder.indexOf(b.id));
}

export function getCatalogDepartmentId(departmentName: string): string {
  return STORE_DEPARTMENTS.find((d) => d.name === departmentName)?.id ?? "building";
}
