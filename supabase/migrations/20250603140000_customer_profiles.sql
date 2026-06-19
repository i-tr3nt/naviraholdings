-- Customer profiles for online ordering
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL DEFAULT 'Harare',
  delivery_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own profile"
  ON public.customer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own profile"
  ON public.customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update own profile"
  ON public.customer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view customer profiles"
  ON public.customer_profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'employee'::public.app_role)
  );

ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS delivery_address text,
  ADD COLUMN IF NOT EXISTS customer_email text;
