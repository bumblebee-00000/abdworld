export const BUSINESS_PHONE = '+91 92462 51399';
export const WHATSAPP_NUMBER = '919246251399';
export function getWhatsAppMessageUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DIRECT_URL = getWhatsAppMessageUrl(
  'Hello! I want to enquire about your rice products.'
);
export const WHATSAPP_CHANNEL_URL =
  'https://whatsapp.com/channel/0029VbDNTNV1Hsq3Bmnk5U0n';