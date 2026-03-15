import { describe, it, expect } from 'vitest';
import { filterByCategory, sortItems, filterByPage } from './filters';
import { ProductCategory, SortParams, PerPage } from '../../types/request.enums';
import type { BaseProduct } from '../../types';
import { Screens, Capacity, Colors, Ram } from '../../types/entities/entities.enums';

const makeProduct = (
  override: Partial<BaseProduct> & { id: string },
): BaseProduct => ({
  key: 1,
  name: 'Product',
  priceRegular: 100,
  priceDiscount: 100,
  screen: Screens.OLED_61,
  capacity: Capacity.g128,
  color: Colors.blc,
  ram: Ram.R4,
  images: [],
  category: ProductCategory.PHONES,
  year: 2022,
  ...override,
});

const phone1 = makeProduct({ id: 'p1', category: ProductCategory.PHONES, name: 'Beta', priceDiscount: 200, year: 2021 });
const phone2 = makeProduct({ id: 'p2', category: ProductCategory.PHONES, name: 'Alpha', priceDiscount: 100, year: 2023 });
const tablet1 = makeProduct({ id: 't1', category: ProductCategory.TABLETS, name: 'Tablet', priceDiscount: 300, year: 2022 });

describe('filterByCategory', () => {
  it('returns all items for ProductCategory.ALL', () => {
    const result = filterByCategory([phone1, phone2, tablet1], ProductCategory.ALL);
    expect(result).toHaveLength(3);
  });

  it('filters by specific category', () => {
    const result = filterByCategory([phone1, phone2, tablet1], ProductCategory.PHONES);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === ProductCategory.PHONES)).toBe(true);
  });

  it('returns empty array when no items match', () => {
    const result = filterByCategory([phone1, phone2], ProductCategory.ACCESSORIES);
    expect(result).toHaveLength(0);
  });
});

describe('sortItems', () => {
  it('sorts by name (TITLE) alphabetically', () => {
    const result = sortItems([phone1, phone2], SortParams.TITLE);
    expect(result[0].name).toBe('Alpha');
    expect(result[1].name).toBe('Beta');
  });

  it('sorts by year descending (AGE)', () => {
    const result = sortItems([phone1, phone2], SortParams.AGE);
    expect(result[0].year).toBeGreaterThan(result[1].year);
  });

  it('sorts by price ascending (PRICE_ASC)', () => {
    const result = sortItems([phone1, phone2], SortParams.PRICE_ASC);
    expect(result[0].priceDiscount).toBe(100);
    expect(result[1].priceDiscount).toBe(200);
  });

  it('returns array unchanged for SortParams.NONE', () => {
    const result = sortItems([phone1, phone2], SortParams.NONE);
    expect(result[0].id).toBe(phone1.id);
  });
});

describe('filterByPage', () => {
  const items = Array.from({ length: 10 }, (_, i) =>
    makeProduct({ id: `p${i}`, name: `Product ${i}` }),
  );

  it('returns all items for PerPage.ALL on page 1', () => {
    const result = filterByPage(items, PerPage.ALL, 1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.items).toHaveLength(10);
  });

  it('returns 404 for PerPage.ALL on page > 1', () => {
    const result = filterByPage(items, PerPage.ALL, 2);
    expect(result.ok).toBe(false);
  });

  it('paginates correctly', () => {
    const result = filterByPage(items, PerPage.FOUR, 2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.items).toHaveLength(4);
      expect(result.data.currentPage).toBe(2);
      expect(result.data.pages).toBe(3);
    }
  });

  it('returns 404 for out-of-range page', () => {
    const result = filterByPage(items, PerPage.FOUR, 99);
    expect(result.ok).toBe(false);
  });
});
