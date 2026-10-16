UPDATE public.products
SET
  scheduled_price = 170,
  scheduled_wholesale_price = 107,
  price_effective_at = TIMESTAMPTZ '2026-10-17 00:00:00+05:30',
  updated_at = NOW()
WHERE slug = 'premium-basmati-rice'
  AND is_active = true;