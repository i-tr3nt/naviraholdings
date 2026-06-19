-- Customer specifications per order line (size, colour, brand, etc.)
ALTER TABLE public.sale_items
  ADD COLUMN IF NOT EXISTS customer_notes text;

COMMENT ON COLUMN public.sale_items.customer_notes IS
  'Optional per-line details from the customer (size, length, brand, colour, etc.)';
