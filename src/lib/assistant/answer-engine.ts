import { formatPrice } from '../utils';
import type { Product } from '../../types';

export type AssistantProduct = Pick<
  Product,
  | 'name'
  | 'slug'
  | 'category'
  | 'short_description'
  | 'full_description'
  | 'pack_sizes'
  | 'rice_type'
  | 'origin'
  | 'grain_length'
  | 'aroma'
  | 'texture'
  | 'best_used_for'
  | 'cooking_info'
  | 'min_order_quantity'
  | 'stock_status'
  | 'price'
>;

const STOP_WORDS = new Set([
  'about', 'and', 'are', 'bulk', 'can', 'for', 'from', 'help', 'how', 'i', 'in', 'is',
  'me', 'of', 'our', 'please', 'the', 'this', 'to', 'what', 'which', 'wholesale', 'with', 'you', 'your', 'rice', 'supply',
]);

export function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function rankProducts(question: string, products: AssistantProduct[], limit = 3) {
  const terms = normalize(question).split(' ').filter((term) => term.length > 2 && !STOP_WORDS.has(term));
  return products
    .map((product) => {
      const name = normalize(product.name);
      const category = normalize(product.category);
      const details = normalize([
        product.rice_type,
        product.origin,
        product.full_description,
        product.aroma,
        product.texture,
        product.grain_length,
        product.best_used_for,
        product.cooking_info,
        product.short_description,
      ].join(' '));
      const score = terms.reduce((total, term) => total
        + (name.includes(term) ? 4 : 0)
        + (category.includes(term) ? 3 : 0)
        + (details.includes(term) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((result) => result.product);
}

function inferBusinessIntent(text: string) {
  const value = normalize(text);

  if (/\b(restaurant|hotel|canteen|mess|food service|kitchen|cloud kitchen)\b/.test(value)) return 'restaurant or hotel';
  if (/\b(biryani|pulao|catering|banquet|wedding|event)\b/.test(value)) return 'biryani or catering';
  if (/\b(retail|grocery|shop|store|resell|reseller|distributor|distribution)\b/.test(value)) return 'retail or wholesale resale';
  if (/\b(export|institution|school|college|hostel|army|office|factory)\b/.test(value)) return 'institutional or bulk supply';
  return 'your business';
}

function pickUseCaseLabel(primary: AssistantProduct | null) {
  if (!primary) return 'your business';
  if (/biryani|pulao|catering|banquet|wedding/i.test(primary.best_used_for ?? '')) return 'biryani or catering';
  if (/restaurant|hotel|kitchen/i.test(primary.best_used_for ?? '')) return 'restaurant or hotel';
  if (/retail|grocery|shop|resell/i.test(primary.best_used_for ?? '')) return 'retail or grocery';
  return 'your business';
}

function isContactQuery(question: string, context: string) {
  const value = normalize(`${context} ${question}`);
  const hasContactIntent = /\b(contact|call|phone|whatsapp|email|reach|talk to|quote|quotation|how can i contact|how to contact|reach us)\b/.test(value);
  const hasRiceIntent = /\b(rice|basmati|sella|grain|variety|varieties|pack|quantity|moq|price|pricing)\b/.test(value);
  return hasContactIntent && !hasRiceIntent;
}

function isDeliveryQuery(question: string, context: string) {
  const value = normalize(`${context} ${question}`);
  return /\b(delivery|deliver|dispatch|shipping|transport|logistics|how do you deliver|how is delivery|delivery process)\b/.test(value);
}

function isWholesaleInfoQuery(question: string, context: string) {
  const value = normalize(`${context} ${question}`);
  const hasWholesaleIntent = /\b(wholesale information|wholesale|bulk supply|business supply|supply requirements|minimum order|price and availability|pricing and availability)\b/.test(value);
  const hasSpecificProductIntent = /\b(help me choose|recommend|which rice|what rice|best rice|specific variety|basmati|sella|non basmati|golden rice|premium basmati|1121)\b/.test(value);
  const hasQuoteIntent = /\b(price|pricing|rate|rates|cost|quote|quotation)\b/.test(value);
  return hasWholesaleIntent && !hasSpecificProductIntent && !hasQuoteIntent;
}

function isBulkOrderQuery(question: string, context: string) {
  const value = normalize(`${context} ${question}`);
  return /\b(bulk (?:rice )?orders?|place (?:a )?bulk order|large orders?)\b/.test(value);
}

function isBusinessInfoQuery(question: string, context: string) {
  const value = normalize(`${context} ${question}`);
  const hasBusinessIntent = /\b(abd world|abdworld|business|company|who are you|about abd|about the business|contact abd|contact us|bulk order|wholesale information|supplier)\b/.test(value);
  const hasRiceIntent = /\b(rice|basmati|sella|grain|variety|varieties|order|pack|quantity|moq|price|pricing)\b/.test(value);
  return hasBusinessIntent && !hasRiceIntent;
}

function buildRecommendationSentence(primary: AssistantProduct | null, context: string, question: string) {
  const intent = inferBusinessIntent(`${context} ${question}`);
  if (!primary) {
    return `I can narrow down the right rice for ${intent}. What will you use it for? I’ll recommend a suitable option from our catalogue.`;
  }

  const shortDescription = primary.short_description || 'A dependable wholesale rice option.';
  const bestUse = primary.best_used_for ? `It is especially suited for ${primary.best_used_for.toLowerCase()}.` : '';

  return `${primary.name} looks like a strong fit for ${intent}. ${shortDescription} ${bestUse} It comes in ${primary.pack_sizes.join(', ')} with a ${primary.min_order_quantity} kg minimum. What approximate quantity are you considering?`;
}

export function answerQuestion(question: string, context: string, products: AssistantProduct[]) {
  const normalized = normalize(`${context} ${question}`);
  const currentQuestion = normalize(question);

  const namedProduct = products.find((product) => {
    const nameTerms = normalize(product.name).split(' ').filter((term) => term !== 'rice');
    return nameTerms.length > 0 && nameTerms.every((term) => normalized.split(' ').includes(term));
  });

  const matchedProducts = namedProduct ? [namedProduct] : rankProducts(`${context} ${question}`, products);
  const primary = matchedProducts[0];
  const suggestions = matchedProducts.slice(0, 3).map(({ name, slug, category, short_description, pack_sizes, min_order_quantity }) => ({
    name,
    slug,
    category,
    short_description,
    pack_sizes,
    min_order_quantity,
  }));

  const asksMinimum = /\b(minimum|min order|moq|quantity|bulk order|how much)\b/.test(currentQuestion);
  const asksPackSize = /\b(pack|packs|bag|bags|size|sizes|packaging)\b/.test(currentQuestion);
  const asksPrice = /\b(price|pricing|rate|rates|cost|quote|quotation)\b/.test(currentQuestion);
  const asksDelivery = /\b(deliver|delivery|shipping|ship|dispatch|location|pin code|city|state)\b/.test(currentQuestion);
  const asksQuality = /\b(quality|grade|origin|aroma|grain|texture|cook|cooking|pure|fluffy|long grain)\b/.test(currentQuestion);

  if (isContactQuery(question, context)) {
    return {
      answer: 'I can help you prepare a wholesale enquiry here. Which rice variety are you looking for, and roughly how much do you need? The sales team confirms current pricing and availability.',
      products: [],
    };
  }

  if (isDeliveryQuery(question, context)) {
    return {
      answer: 'I can help check the delivery requirements. Which city or PIN code is the order going to, and approximately how many kilograms do you need? The sales team confirms serviceability and timing.',
      products: [],
    };
  }

  if (isBulkOrderQuery(question, context)) {
    return {
      answer: 'I can help you prepare a bulk enquiry. Which variety or intended use are you considering, and roughly how many kilograms do you need? Final pricing, availability, and delivery are confirmed by ABD WORLD’s sales team; this chat does not confirm an order.',
      products: [],
    };
  }

  if (isWholesaleInfoQuery(question, context)) {
    return {
      answer: 'ABD WORLD supplies rice to retailers, restaurants, hotels, caterers, and bulk buyers. What kind of business are you buying for, and roughly how much rice do you need?',
      products: [],
    };
  }

  if (isBusinessInfoQuery(question, context)) {
    return {
      answer: 'ABD WORLD is a wholesale rice supplier for retailers, restaurants, hotels, caterers, and bulk buyers. What are you sourcing for: restaurant service, catering, retail resale, or another use?',
      products: [],
    };
  }

  if (primary && asksMinimum) {
    return {
      answer: `${primary.name} has a ${primary.min_order_quantity} kg minimum and comes in ${primary.pack_sizes.join(', ')}. What approximate quantity are you planning to order?`,
      products: suggestions,
    };
  }

  if (primary && asksPackSize) {
    return {
      answer: `${primary.name} is available in ${primary.pack_sizes.join(', ')}. What approximate order quantity should I help you plan for?`,
      products: suggestions,
    };
  }

  if (asksPrice) {
    return {
      answer: primary
        ? `For ${primary.name}, what approximate quantity and delivery city or PIN code should the quote cover? ABD WORLD’s sales team confirms final pricing and availability.`
        : 'I can help you prepare a current wholesale quote. Which variety, approximate quantity, and delivery city or PIN code do you need? ABD WORLD’s sales team confirms final pricing and availability.',
      products: suggestions,
    };
  }

  if (primary && asksQuality) {
    const details = [
      primary.rice_type && `Type: ${primary.rice_type}`,
      primary.origin && `Origin: ${primary.origin}`,
      primary.aroma && `Aroma: ${primary.aroma}`,
      primary.texture && `Texture: ${primary.texture}`,
      primary.best_used_for && `Best for: ${primary.best_used_for}`,
      primary.cooking_info && `Cooking: ${primary.cooking_info}`,
    ].filter(Boolean);

    return {
      answer: `${primary.name} is often chosen for ${pickUseCaseLabel(primary)} because it has ${details.slice(0, 3).join('; ')}. What will you mainly use it for?`,
      products: suggestions,
    };
  }

  if (primary) {
    return {
      answer: buildRecommendationSentence(primary, context, question),
      products: suggestions,
    };
  }

  if (isContactQuery(question, context)) {
    return {
      answer: 'I can help you prepare a wholesale enquiry here. Which rice variety are you looking for, and roughly how much do you need? The sales team confirms current pricing and availability.',
      products: [],
    };
  }

  if (isDeliveryQuery(question, context)) {
    return {
      answer: 'I can help check the delivery requirements. Which city or PIN code is the order going to, and approximately how many kilograms do you need? The sales team confirms serviceability and timing.',
      products: [],
    };
  }

  if (isWholesaleInfoQuery(question, context)) {
    return {
      answer: 'ABD WORLD supplies rice to retailers, restaurants, hotels, caterers, and bulk buyers. What kind of business are you buying for, and roughly how much rice do you need?',
      products: [],
    };
  }

  if (isBusinessInfoQuery(question, context)) {
    return {
      answer: 'ABD WORLD is a wholesale rice supplier for retailers, restaurants, hotels, caterers, and bulk buyers. What are you sourcing for: restaurant service, catering, retail resale, or another use?',
      products: [],
    };
  }

  if (suggestions.length) {
    return {
      answer: `${suggestions.map((product) => product.name).join(', ')} may suit your requirement. What kind of business are you buying for? I can narrow the recommendation from there.`,
      products: suggestions,
    };
  }

  return {
    answer: 'I can help you choose rice for your business. What will you use it for, and approximately how much do you need? I’ll guide you to a suitable catalogue option.',
    products: [],
  };
}
