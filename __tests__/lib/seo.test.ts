import { describe, it, expect } from 'vitest';
import {
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SITE_CONFIG,
} from '../../lib/seo';

describe('SEO Schema Generators', () => {
  describe('generateProductSchema', () => {
    it('should include valid rating (1-5) in aggregateRating', () => {
      const validRatings = [1, 1.5, 2, 3, 4, 4.5, 5];

      validRatings.forEach(rating => {
        const schema = generateProductSchema({
          name: 'Test Product',
          description: 'Test description',
          rating,
        });

        expect(schema.aggregateRating).toBeDefined();
        expect((schema.aggregateRating as Record<string, unknown>).ratingValue).toBe(rating.toString());
      });
    });

    it('should exclude rating if below valid range', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        rating: 0.5,
      });

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should exclude rating if above valid range', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        rating: 5.5,
      });

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should exclude rating if undefined', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
      });

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should include negative ratings as invalid', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        rating: -2,
      });

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should include reviewCount when rating is valid', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        rating: 4.5,
        reviewCount: 120,
      });

      const aggregateRating = schema.aggregateRating as Record<string, unknown>;
      expect(aggregateRating.reviewCount).toBe(120);
    });

    it('should default reviewCount to 1 if not provided', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        rating: 4,
      });

      const aggregateRating = schema.aggregateRating as Record<string, unknown>;
      expect(aggregateRating.reviewCount).toBe(1);
    });

    it('should include offer data when price is provided', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        price: 25000,
        currency: 'NGN',
      });

      const offer = schema.offers as Record<string, unknown>;
      expect(offer).toBeDefined();
      expect(offer['@type']).toBe('Offer');
      expect(offer.price).toBe('25000');
      expect(offer.priceCurrency).toBe('NGN');
    });

    it('should use default currency NGN if not specified', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        price: 25000,
      });

      const offer = schema.offers as Record<string, unknown>;
      expect(offer.priceCurrency).toBe('NGN');
    });

    it('should use InStock as default availability', () => {
      const schema = generateProductSchema({
        name: 'Test Product',
        description: 'Test description',
        price: 25000,
      });

      const offer = schema.offers as Record<string, unknown>;
      expect(offer.availability).toBe('https://schema.org/InStock');
    });

    it('should include all required schema.org fields', () => {
      const schema = generateProductSchema({
        name: 'Prostanone',
        description: 'Premium prostate supplement',
        image: 'https://example.com/product.jpg',
        brand: 'Prostanone',
        rating: 4.5,
        reviewCount: 150,
        price: 25000,
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Prostanone');
      expect(schema.description).toBe('Premium prostate supplement');
      expect(schema.image).toBe('https://example.com/product.jpg');
      expect((schema.brand as Record<string, unknown>).name).toBe('Prostanone');
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate valid BlogPosting schema', () => {
      const schema = generateArticleSchema({
        headline: 'Test Article',
        description: 'Test description',
        author: 'John Doe',
        datePublished: '2024-03-15',
      });

      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBe('Test Article');
      expect(schema.description).toBe('Test description');
      expect((schema.author as Record<string, unknown>).name).toBe('John Doe');
    });

    it('should use datePublished as dateModified if not provided', () => {
      const schema = generateArticleSchema({
        headline: 'Test Article',
        description: 'Test description',
        datePublished: '2024-03-15',
      });

      expect(schema.dateModified).toBe('2024-03-15');
    });

    it('should use custom dateModified when provided', () => {
      const schema = generateArticleSchema({
        headline: 'Test Article',
        description: 'Test description',
        datePublished: '2024-03-15',
        dateModified: '2024-03-20',
      });

      expect(schema.dateModified).toBe('2024-03-20');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://example.com' },
        { name: 'Blog', url: 'https://example.com/blog' },
        { name: 'Article', url: 'https://example.com/blog/article' },
      ]);

      expect(schema['@type']).toBe('BreadcrumbList');
      const itemList = schema.itemListElement as Array<Record<string, unknown>>;
      expect(itemList).toHaveLength(3);
      expect(itemList[0].position).toBe('1');
      expect(itemList[2].position).toBe('3');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQPage schema', () => {
      const schema = generateFAQSchema([
        { question: 'What is Prostanone?', answer: 'A premium prostate health supplement.' },
        { question: 'Is it safe?', answer: 'Yes, it is NAFDAC certified.' },
      ]);

      expect(schema['@type']).toBe('FAQPage');
      const mainEntity = schema.mainEntity as Array<Record<string, unknown>>;
      expect(mainEntity).toHaveLength(2);
      expect(mainEntity[0].name).toBe('What is Prostanone?');
    });
  });
});
