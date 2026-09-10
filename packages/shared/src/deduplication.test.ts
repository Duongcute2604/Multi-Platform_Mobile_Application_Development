import { describe, it, expect } from 'vitest';
import { jaroWinkler, jaccardSimilarity, isDuplicate } from './deduplication';

describe('Deduplication (BR-05)', () => {
  describe('jaroWinkler', () => {
    it('identical strings → 1', () => {
      expect(jaroWinkler('pizza', 'pizza')).toBe(1);
    });

    it('similar strings → high score', () => {
      const score = jaroWinkler('pho bo', 'pho bo');
      expect(score).toBe(1);
    });

    it('different strings → low score', () => {
      const score = jaroWinkler('xyz123', 'abc456');
      expect(score).toBeLessThan(0.2);
    });

    it('empty string → 0', () => {
      expect(jaroWinkler('', 'test')).toBe(0);
    });
  });

  describe('jaccardSimilarity', () => {
    it('identical sets → 1', () => {
      expect(jaccardSimilarity(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(1);
    });

    it('partial overlap', () => {
      const score = jaccardSimilarity(['a', 'b', 'c'], ['b', 'c', 'd']);
      expect(score).toBeCloseTo(0.5, 1);
    });

    it('no overlap → 0', () => {
      expect(jaccardSimilarity(['a', 'b'], ['c', 'd'])).toBe(0);
    });

    it('empty both → 1', () => {
      expect(jaccardSimilarity([], [])).toBe(1);
    });

    it('case insensitive', () => {
      expect(jaccardSimilarity(['Beef'], ['beef'])).toBe(1);
    });
  });

  describe('isDuplicate', () => {
    it('same title + same ingredients → duplicate', () => {
      expect(isDuplicate(
        'Phở bò', ['phấn', 'thịt bò', 'hành'],
        'Phở bò', ['phấn', 'thịt bò', 'hành'],
      )).toBe(true);
    });

    it('similar title + same ingredients → duplicate', () => {
      expect(isDuplicate(
        'Phở bò Hà Nội', ['pho', 'thit bo', 'hanh'],
        'Phở bò Ha Noi', ['pho', 'thit bo', 'hanh'],
      )).toBe(true);
    });

    it('different title → not duplicate', () => {
      expect(isDuplicate(
        'Phở bò', ['phấn', 'thịt bò'],
        'Bún bò Huế', ['bún', 'thịt bò'],
      )).toBe(false);
    });

    it('same title + different ingredients → not duplicate', () => {
      expect(isDuplicate(
        'Phở bò', ['phấn', 'thịt bò'],
        'Phở bò', ['mì', 'thịt gà'],
      )).toBe(false);
    });
  });
});
