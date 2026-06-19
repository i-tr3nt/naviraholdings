/** Stable id for catalogue / typical-item cart lines (not inventory UUIDs). */
export function catalogCartLineId(sectionKey: string, itemLabel: string): string {
  const slug = itemLabel
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `catalog:${sectionKey}:${slug}`;
}

export const CATALOG_ITEM_CODE = "REQUEST";
