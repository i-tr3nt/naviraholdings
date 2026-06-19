-- Complete online ordering: line notes, catalog requests, customer RLS

ALTER TABLE public.sale_items
  ADD COLUMN IF NOT EXISTS customer_notes text;

ALTER TABLE public.sale_items
  ADD COLUMN IF NOT EXISTS is_catalog_line boolean NOT NULL DEFAULT false;

-- Catalogue / aisle requests may not match a single inventory row yet
ALTER TABLE public.sale_items
  ALTER COLUMN inventory_id DROP NOT NULL;

COMMENT ON COLUMN public.sale_items.is_catalog_line IS
  'True when the customer ordered from the typical-products list (price confirmed by staff).';

-- Customers place their own online orders
DROP POLICY IF EXISTS "Customers can insert own online sales" ON public.sales;
CREATE POLICY "Customers can insert own online sales"
  ON public.sales FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND is_online = true
  );

-- Line items for the customer's pending online sale
DROP POLICY IF EXISTS "Customers can insert own online sale items" ON public.sale_items;
CREATE POLICY "Customers can insert own online sale items"
  ON public.sale_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales s
      WHERE s.id = sale_id
        AND s.user_id = auth.uid()
        AND s.is_online = true
    )
  );

DROP POLICY IF EXISTS "Customers can view own online sale items" ON public.sale_items;
CREATE POLICY "Customers can view own online sale items"
  ON public.sale_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sales s
      WHERE s.id = sale_id
        AND s.user_id = auth.uid()
        AND s.is_online = true
    )
  );

GRANT EXECUTE ON FUNCTION public.generate_sale_number() TO authenticated;
