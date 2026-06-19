import { supabase } from "@/integrations/supabase/client";
import { DEMO_INVENTORY } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/demo-mode";
import type { ShopProduct } from "@/types/shop";

const SHOP_INVENTORY_SELECT =
  "id, item_name, item_code, description, category, quantity, unit_price, image_url";

export async function fetchShopInventory(): Promise<ShopProduct[]> {
  if (isDemoMode()) {
    return DEMO_INVENTORY;
  }

  const { data, error } = await supabase
    .from("inventory")
    .select(SHOP_INVENTORY_SELECT)
    .order("item_name");

  return error ? [] : data || [];
}
