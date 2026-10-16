ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS payment_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS razorpay_payment_link_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_link_url TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
  ON public.orders(payment_status);