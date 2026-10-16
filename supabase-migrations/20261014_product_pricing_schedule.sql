ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cost_price NUMERIC,
  ADD COLUMN IF NOT EXISTS scheduled_price NUMERIC,
  ADD COLUMN IF NOT EXISTS scheduled_wholesale_price NUMERIC,
  ADD COLUMN IF NOT EXISTS price_effective_at TIMESTAMPTZ;