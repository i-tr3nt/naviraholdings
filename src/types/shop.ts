export type ShopProduct = {
  id: string;
  item_name: string;
  item_code: string;
  description: string | null;
  category: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
};

export type AddToCartPayload = {
  product: ShopProduct;
  quantity: number;
  lineDetails: string;
};

export type AddCatalogToCartPayload = {
  itemLabel: string;
  sectionLabel: string;
  categoryHint: string;
  quantity: number;
  lineDetails: string;
};
