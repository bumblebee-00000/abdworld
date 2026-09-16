export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  main_image: string;
  images: string[];
  video_url: string | null;
  price: number | null;
  wholesale_price: number | null;
  pack_sizes: string[];
  rice_type: string;
  origin: string;
  grain_length: string;
  aroma: string;
  texture: string;
  cooking_info: string;
  best_used_for: string;
  min_order_quantity: number;
  stock_status: string;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  product_id: string;
  product_name: string;
  pack_size: string;
  quantity: number;
  message: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

export interface WholesaleEnquiry {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string | null;
  location: string;
  rice_requirement: string;
  approximate_quantity: string;
  message: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string | null;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  about_content: string;
  business_hours: string;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
