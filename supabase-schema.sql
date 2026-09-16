-- ABD World Rice - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor

-- Admins table (single admin)
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY DEFAULT '1',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'basmati',
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  main_image TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  price NUMERIC,
  wholesale_price NUMERIC,
  pack_sizes TEXT[] NOT NULL DEFAULT '{}',
  rice_type TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  grain_length TEXT DEFAULT '',
  aroma TEXT DEFAULT '',
  texture TEXT DEFAULT '',
  cooking_info TEXT DEFAULT '',
  best_used_for TEXT DEFAULT '',
  min_order_quantity INTEGER DEFAULT 1,
  stock_status TEXT DEFAULT 'in_stock',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  pack_size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wholesale enquiries
CREATE TABLE IF NOT EXISTS wholesale_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  location TEXT NOT NULL,
  rice_requirement TEXT NOT NULL,
  approximate_quantity TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  business_name TEXT NOT NULL DEFAULT 'ABD World Rice',
  logo_url TEXT,
  phone TEXT NOT NULL DEFAULT '',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  about_content TEXT NOT NULL DEFAULT '',
  business_hours TEXT NOT NULL DEFAULT 'Mon - Sat: 9:00 AM - 6:00 PM',
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO site_settings (id, business_name, about_content) VALUES 
  ('1', 'ABD World Rice', 'We are a premium rice wholesaler committed to delivering the finest quality rice to our customers. Our carefully sourced rice varieties come from trusted farms and are processed with the highest standards of hygiene and quality.')
ON CONFLICT (id) DO NOTHING;

-- Seed editable SAMPLE products
-- NOTE: These are clearly-identified sample/placeholder products for development.
-- Delete or edit them from the Admin Panel before going live.
INSERT INTO products (
  name, slug, category, short_description, full_description, main_image,
  images, video_url, price, wholesale_price, pack_sizes, rice_type, origin,
  grain_length, aroma, texture, cooking_info, best_used_for, min_order_quantity,
  stock_status, is_featured, is_active, seo_title, seo_description
) VALUES
(
  'Premium Basmati Rice',
  'premium-basmati-rice',
  'Basmati',
  'Long grain, naturally aromatic premium quality basmati rice. Light, fluffy grains that stay separate after cooking.',
  'Our Premium Basmati Rice is selected from the finest paddy grown in the foothills of the Himalayas. Each grain is aged naturally to enhance its aroma and length, giving you the signature basmati experience.\n\nThis rice is perfect for biryani, pulao, and everyday serving. It cooks to a light, fluffy texture with grains that stay separate and non-sticky.',
  '',
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  NULL,
  ARRAY['5 KG','10 KG','25 KG','50 KG'],
  'Basmati',
  'India',
  'Long Grain',
  'Naturally Aromatic',
  'Fluffy & Non-Sticky',
  'Rinse rice and soak for 20 minutes. Use 1 part rice to 1.5 parts water.',
  'Biryani, Pulao, Everyday Meals',
  50,
  'in_stock',
  true,
  true,
  'Premium Basmati Rice - Wholesale | ABD World Rice',
  'Premium long-grain basmati rice available at wholesale prices. Aromatic, fluffy, non-sticky. Available in 5/10/25/50 KG packs.'
),
(
  'Sella Basmati Rice',
  'sella-basmati-rice',
  'Basmati',
  'Parboiled golden basmati rice with excellent grain separation and stronger structure for bulk cooking.',
  'Sella basmati rice is parboiled before milling, which locks in nutrients and strengthens the grain. It is ideal for hotels, restaurants, and caterers who need rice that holds up well in large-scale cooking.\n\nIts golden colour comes from the parboiling process and the grains cook up firm and separate, making it perfect for biryani and fried rice in bulk.',
  '',
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  NULL,
  ARRAY['5 KG','10 KG','25 KG','50 KG'],
  'Basmati',
  'India',
  'Long Grain',
  'Mild Aroma',
  'Firm & Separate',
  'No soaking needed. Use 1 part rice to 1.6 parts water. Cook for 18-20 minutes.',
  'Bulk Biryani, Fried Rice, Restaurant Use',
  100,
  'in_stock',
  true,
  true,
  'Sella Basmati Rice - Wholesale | ABD World Rice',
  'Parboiled golden sella basmati rice for bulk cooking. Firm, separate grains ideal for restaurants and caterers.'
),
(
  '1121 Basmati Rice',
  '1121-basmati-rice',
  'Premium Basmati',
  'Extra-long grain premium basmati, the crown jewel of Indian rice with unmatched length and aroma.',
  '1121 Basmati is one of the longest premium basmati varieties grown in India. Its extra-long grains elongate beautifully upon cooking and carry an intense, naturally sweet aroma.\n\nA favourite among premium restaurants and export markets, 1121 basmati delivers presentation-grade results for special occasions.',
  '',
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  NULL,
  ARRAY['5 KG','10 KG','25 KG'],
  'Basmati',
  'India',
  'Extra-Long Grain',
  'Rich, Naturally Aromatic',
  'Light, Fluffy & Separate',
  'Rinse and soak for 30 minutes. Use 1 part rice to 1.4 parts water.',
  'Special Occasions, Fine Dining, Gifting',
  50,
  'in_stock',
  true,
  true,
  '1121 Basmati Rice - Wholesale | ABD World Rice',
  'Extra-long grain 1121 basmati rice. Premium quality, naturally aromatic, presentation-grade. Wholesale available.'
),
(
  'Golden Rice',
  'golden-rice',
  'Specialty',
  'Premium non-basmati golden rice with excellent cooking quality and consistent grain texture.',
  'Our Golden Rice is a high-quality non-basmati variety prized for its excellent cooking quality and consistent results. It cooks up soft and aromatic with a pleasant golden tinge.\n\nThis is an economical everyday rice that families and small businesses trust for reliable performance at a great wholesale price.',
  '',
  ARRAY[]::TEXT[],
  NULL,
  NULL,
  ARRAY['5 KG','10 KG','25 KG','50 KG'],
  'Non-Basmati',
  'India',
  'Medium Grain',
  'Mild',
  'Soft & Fluffy',
  'Use 1 part rice to 2 parts water. Cook for 15-18 minutes.',
  'Everyday Cooking, Hostels, Canteens',
  100,
  'in_stock',
  false,
  true,
  'Golden Rice - Wholesale | ABD World Rice',
  'Quality non-basmati golden rice for everyday cooking. Economical, reliable, available at wholesale rates.'
)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wholesale_enquiries_status ON wholesale_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- Row Level Security policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Products: public read for active, full access via service role
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Site settings: public read
CREATE POLICY "Public can view settings" ON site_settings
  FOR SELECT USING (true);

-- Orders: no public access (server-side only)
CREATE POLICY "No public order access" ON orders
  FOR ALL USING (false);

-- Wholesale enquiries: no public access
CREATE POLICY "No public wholesale access" ON wholesale_enquiries
  FOR ALL USING (false);

-- Contact messages: no public access
CREATE POLICY "No public contact access" ON contact_messages
  FOR ALL USING (false);

-- Admins: no public access
CREATE POLICY "No public admin access" ON admins
  FOR ALL USING (false);
