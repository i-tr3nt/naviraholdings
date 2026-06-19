-- Extended contact fields for NAVIRA HARDWARE
ALTER TABLE public.company_info
  ADD COLUMN IF NOT EXISTS sales_email text,
  ADD COLUMN IF NOT EXISTS accounts_email text,
  ADD COLUMN IF NOT EXISTS general_email text,
  ADD COLUMN IF NOT EXISTS whatsapp text;

UPDATE public.company_info
SET
  email = 'sales@navirahardware.co.zw',
  sales_email = 'sales@navirahardware.co.zw',
  general_email = 'navira@navrahardwae.co.zw',
  accounts_email = 'accounts@navirahardware.co.zw',
  whatsapp = '+263772253246',
  landline = '+263774740730',
  cell_number = '+263713712204',
  address = 'Chillarz Complex, Westwood Drive, Westwood',
  city = 'Harare',
  country = 'Zimbabwe',
  updated_at = now()
WHERE id IS NOT NULL;

-- If no row exists yet, insert defaults
INSERT INTO public.company_info (
  email,
  sales_email,
  general_email,
  accounts_email,
  whatsapp,
  landline,
  cell_number,
  address,
  city,
  country
)
SELECT
  'sales@navirahardware.co.zw',
  'sales@navirahardware.co.zw',
  'navira@navrahardwae.co.zw',
  'accounts@navirahardware.co.zw',
  '+263772253246',
  '+263774740730',
  '+263713712204',
  'Chillarz Complex, Westwood Drive, Westwood',
  'Harare',
  'Zimbabwe'
WHERE NOT EXISTS (SELECT 1 FROM public.company_info LIMIT 1);
