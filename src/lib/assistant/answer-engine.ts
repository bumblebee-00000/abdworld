import { formatPrice } from '../utils';
import type { Product } from '../../types';

export type AssistantProduct = Pick<
  Product,
  | 'name'
  | 'slug'
  | 'category'
  | 'short_description'
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
  'about', 'and', 'are', 'can', 'for', 'from', 'help', 'how', 'i', 'in', 'is',
  'me', 'of', 'our', 'please', 'the', 'this', 'to', 'what', 'which', 'with', 'you', 'your', 'rice',
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

function buildRecommendationSentence(primary: AssistantProduct | null, context: string, question: string) {
  const intent = inferBusinessIntent(`${context} ${question}`);
  if (!primary) {
    return `For ${intent}, I’d start by narrowing your use case and quantity. Tell me whether you need rice for biryani, a restaurant, retail sales, or bulk supply, and I can point you to the right fit.`;
  }

  const useCase = pickUseCaseLabel(primary);
  const shortDescription = primary.short_description || 'A dependable wholesale rice option.';
  const bestUse = primary.best_used_for ? `It is especially suited for ${primary.best_used_for.toLowerCase()}.` : '';

  return `For ${intent}, ${primary.name} is a strong fit. ${shortDescription} ${bestUse} It’s available in ${primary.pack_sizes.join(', ')} and the minimum order is ${primary.min_order_quantity} kg.`;
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

  if (primary && asksMinimum) {
    return {
      answer: `${primary.name} is a good match for ${inferBusinessIntent(question)}. The minimum order is ${primary.min_order_quantity} kg, and it is available in ${primary.pack_sizes.join(', ')}. If you want, I can help you choose the right pack size for your business.`,
      products: suggestions,
    };
  }

  if (primary && asksPackSize) {
    return {
      answer: `${primary.name} is available in ${primary.pack_sizes.join(', ')}. For ${inferBusinessIntent(question)}, that gives you flexibility for both smaller retail orders and larger business supply runs.`,
      products: suggestions,
    };
  }

  if (primary && asksPrice) {
    return {
      answer: 'For the latest wholesale price and availability, please contact ABD WORLD. Final pricing depends on your quantity, rice type and delivery location, and our team can confirm the best option for your business.',
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
      answer: `${primary.name} is often chosen for ${pickUseCaseLabel(primary)} because it has ${details.slice(0, 3).join('; ')}. If you want, I can suggest the best option for your restaurant, retail shop, or catering business.`,
      products: suggestions,
    };
  }

  if (primary) {
    return {
      answer: buildRecommendationSentence(primary, context, question),
      products: suggestions,
    };
  }

  if (suggestions.length) {
    return {
      answer: `I’d look at ${suggestions.map((product) => product.name).join(', ')} for your requirement. If you tell me whether you’re buying for a restaurant, retail shop, biryani business, or bulk supply, I can narrow this down to the best fit.`,
      products: suggestions,
    };
  }

  const fallbackSuggestions = products.slice(0, 3).map(({ name, slug, category, short_description, pack_sizes, min_order_quantity }) => ({
    name,
    slug,
    category,
    short_description,
    pack_sizes,
    min_order_quantity,
  }));

  return {
    answer: 'I can help you choose the right rice for your business, with the right quality, pack size, and minimum order to support your goals. Share your use case and quantity, and I’ll guide you toward the best option with confidence.',
    products: fallbackSuggestions,
  };
}
