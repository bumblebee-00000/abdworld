export const BUSINESS_PHONE = '+91 92462 51399';
export const WHATSAPP_NUMBER = '919246251399';
export function getWhatsAppMessageUrl(message: string, phoneNumber = WHATSAPP_NUMBER): string {
  const normalizedNumber = phoneNumber.replace(/\D/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DIRECT_URL = getWhatsAppMessageUrl(
  'Hello! I want to enquire about your rice products.'
);
export const WHATSAPP_CHANNEL_URL =
  'https://whatsapp.com/channel/0029VbDNTNV1Hsq3Bmnk5U0n';