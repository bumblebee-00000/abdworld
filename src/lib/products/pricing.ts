import type { Product } from '@/types';

type ProductPricing = Pick<
  Product,
  'price' | 'wholesale_price' | 'scheduled_price' | 'scheduled_wholesale_price' | 'price_effective_at'
>;

export function getEffectivePrices(product: ProductPricing, now = Date.now()) {
  const scheduleIsActive = Boolean(
    product.price_effective_at && Date.parse(product.price_effective_at) <= now
  );

  return {
    price: scheduleIsActive && product.scheduled_price != null
      ? product.scheduled_price
      : product.price,
    wholesale_price: scheduleIsActive && product.scheduled_wholesale_price != null
      ? product.scheduled_wholesale_price
      : product.wholesale_price,
  };
}

export function toPublicProduct(product: Product): Product {
  const publicProduct = { ...product };
  const priceChangeIsUpcoming = Boolean(
    product.price_effective_at &&
    Date.parse(product.price_effective_at) > Date.now() &&
    (product.scheduled_price != null || product.scheduled_wholesale_price != null)
  );

  delete publicProduct.cost_price;

  if (!priceChangeIsUpcoming) {
    delete publicProduct.scheduled_price;
    delete publicProduct.scheduled_wholesale_price;
    delete publicProduct.price_effective_at;
  }

  return { ...publicProduct, ...getEffectivePrices(product) };
}