import { z } from 'zod';

export const orderSchema = z.object({
  customer_name: z.string().min(2).max(100).trim(),
  phone: z.string().min(10).max(15).trim(),
  email: z.string().email().max(200).trim().optional().or(z.literal('')),
  address: z.string().min(5).max(500).trim(),
  city: z.string().min(2).max(100).trim(),
  state: z.string().min(2).max(100).trim(),
  pin_code: z.string().min(4).max(10).trim(),
  product_id: z.string().uuid(),
  product_name: z.string().min(1).max(200).trim(),
  pack_size: z.string().min(1).max(50).trim(),
  quantity: z.number().int().min(1).max(10000),
  message: z.string().max(1000).trim().optional().or(z.literal('')),
});

export const wholesaleSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  business_name: z.string().min(2).max(200).trim(),
  phone: z.string().min(10).max(15).trim(),
  email: z.string().email().max(200).trim().optional().or(z.literal('')),
  location: z.string().min(2).max(200).trim(),
  rice_requirement: z.string().min(2).max(500).trim(),
  approximate_quantity: z.string().min(1).max(100).trim(),
  message: z.string().max(1000).trim().optional().or(z.literal('')),
});

export const productLeadSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  phone: z.string().min(10).max(20).trim(),
  email: z.string().email().max(200).trim().optional().or(z.literal('')),
  city: z.string().max(100).trim().optional().or(z.literal('')),
  product_name: z.string().min(1).max(200).trim(),
  product_slug: z.string().min(1).max(200).trim(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  phone: z.string().min(10).max(15).trim(),
  email: z.string().email().max(200).trim().optional().or(z.literal('')),
  subject: z.string().min(2).max(200).trim(),
  message: z.string().min(10).max(2000).trim(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  slug: z.string().min(2).max(200).trim(),
  category: z.string().min(1).max(100).trim(),
  short_description: z.string().min(1).max(500).trim(),
  full_description: z.string().min(1).max(5000).trim(),
  main_image: z.string().url().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  price: z.number().nullable().optional(),
  wholesale_price: z.number().nullable().optional(),
  pack_sizes: z.array(z.string()).min(1),
  rice_type: z.string().min(1).max(100).trim(),
  origin: z.string().min(1).max(100).trim(),
  grain_length: z.string().max(100).trim().optional().or(z.literal('')),
  aroma: z.string().max(100).trim().optional().or(z.literal('')),
  texture: z.string().max(100).trim().optional().or(z.literal('')),
  cooking_info: z.string().max(1000).trim().optional().or(z.literal('')),
  best_used_for: z.string().max(200).trim().optional().or(z.literal('')),
  min_order_quantity: z.number().int().min(1).default(1),
  stock_status: z.string().default('in_stock'),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(200).trim().optional().or(z.literal('')),
  seo_description: z.string().max(500).trim().optional().or(z.literal('')),
});
