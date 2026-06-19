/** Hints for the per-line details field based on product category. */

export function getLineDetailsPlaceholder(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("plumb") || c.includes("pipe") || c.includes("drain")) {
    return "e.g. 20mm PVC, 3m length, white, brand…";
  }
  if (c.includes("electr") || c.includes("wire") || c.includes("cable")) {
    return "e.g. 2.5mm twin & earth, 100m roll, colour…";
  }
  if (c.includes("paint") || c.includes("varnish") || c.includes("primer")) {
    return "e.g. Dulux exterior, 5L, colour name or code…";
  }
  if (c.includes("screw") || c.includes("nail") || c.includes("bolt") || c.includes("fastener")) {
    return "e.g. M8 × 50mm, zinc, box of 100…";
  }
  if (c.includes("tool") || c.includes("drill") || c.includes("saw")) {
    return "e.g. cordless 18V, with battery, brand…";
  }
  if (c.includes("timber") || c.includes("wood") || c.includes("cement")) {
    return "e.g. dimensions, grade, pack size…";
  }
  return "e.g. size, brand, colour, length, pack size…";
}

export function getLineDetailsLabel(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("paint")) return "Colour & finish details";
  if (c.includes("plumb") || c.includes("electr")) return "Size & specification";
  return "Product details (optional)";
}
