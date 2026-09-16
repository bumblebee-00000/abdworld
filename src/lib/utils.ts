import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppUrl(
  phone: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateOrderMessage(data: {
  product_name: string;
  pack_size: string;
  quantity: number;
  customer_name?: string;
  city?: string;
}): string {
  const lines = [
    `Hello, I am interested in ordering:`,
    ``,
    `Product: ${data.product_name}`,
    `Pack Size: ${data.pack_size}`,
    `Quantity: ${data.quantity}`,
  ];

  if (data.customer_name) lines.push(`Name: ${data.customer_name}`);
  if (data.city) lines.push(`Location: ${data.city}`);

  lines.push(``, `Please provide the final price and delivery information.`);

  return lines.join('\n');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export function validateFileUpload(
  file: File,
  type: 'image' | 'video'
): { valid: boolean; error?: string } {
  if (type === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid image type. Allowed: JPEG, PNG, WebP, AVIF' };
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }
  } else {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid video type. Allowed: MP4, WebM' };
    }
    if (file.size > MAX_VIDEO_SIZE) {
      return { valid: false, error: 'Video size must be less than 50MB' };
    }
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  const dangerousExts = ['php', 'js', 'html', 'exe', 'sh', 'bat', 'cmd', 'ps1', 'scr', 'com', 'pif'];
  if (ext && dangerousExts.includes(ext)) {
    return { valid: false, error: 'File type not allowed' };
  }

  return { valid: true };
}
