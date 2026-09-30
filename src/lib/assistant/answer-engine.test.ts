import test from 'node:test';
import assert from 'node:assert/strict';

import { answerQuestion } from './answer-engine';
import { FALLBACK_PRODUCTS } from '../products/catalog';

test('restaurant buyer gets a concise, human recommendation', () => {
  const result = answerQuestion(
    'I run a restaurant and need rice that cooks fluffy for biryani.',
    '',
    FALLBACK_PRODUCTS,
  );

  assert.ok(result.answer.toLowerCase().includes('restaurant') || result.answer.toLowerCase().includes('biryani'));
  assert.ok(result.products.length > 0);
  assert.ok(result.answer.length > 60);
  assert.ok(!result.answer.includes('I can help with rice varieties, pack sizes, minimum orders, pricing, and delivery'));
});

test('returns a business-style response for a general wholesale inquiry', () => {
  const result = answerQuestion(
    'I need rice for my retail shop',
    '',
    FALLBACK_PRODUCTS,
  );

  assert.ok(result.answer.toLowerCase().includes('retail') || result.answer.toLowerCase().includes('shop') || result.answer.toLowerCase().includes('business'));
  assert.ok(result.products.length > 0);
});
