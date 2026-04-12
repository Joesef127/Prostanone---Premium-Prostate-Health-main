import { describe, it, expect, beforeEach } from 'vitest';
import { getCategoryColor } from '../../lib/categoryColors';

describe('categoryColors Utility', () => {
  it('should consistently map same category to same color', () => {
    const category = 'Health Tips';
    const color1 = getCategoryColor(category);
    const color2 = getCategoryColor(category);

    expect(color1).toBe(color2);
  });

  it('should return valid Tailwind color classes', () => {
    const validColorPairs = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-teal-100 text-teal-700',
      'bg-indigo-100 text-indigo-700',
      'bg-orange-100 text-orange-700',
      'bg-cyan-100 text-cyan-700',
      'bg-pink-100 text-pink-700',
    ];

    const categories = ['Health', 'Wellness', 'Science', 'Tips', 'Guide', 'Review'];
    const colors = categories.map(cat => getCategoryColor(cat));

    colors.forEach(color => {
      expect(validColorPairs).toContain(color);
    });
  });

  it('should handle different case variations', () => {
    const color1 = getCategoryColor('Health');
    const color2 = getCategoryColor('health');
    const color3 = getCategoryColor('HEALTH');

    // Should be deterministic based on normalized value
    expect(typeof color1).toBe('string');
    expect(typeof color2).toBe('string');
    expect(typeof color3).toBe('string');
  });

  it('should distribute colors across different categories', () => {
    const categories = [
      'Prostate Health',
      'Nutrition',
      'Wellness',
      'Science',
      'Tips',
      'Testimonials',
      'FAQ',
      'Research',
    ];

    const colors = categories.map(cat => getCategoryColor(cat));
    
    // Check that we get valid color pairs back
    colors.forEach(color => {
      expect(color).toMatch(/^bg-/);
      expect(color).toMatch(/text-\w+-\d+$/);
      expect(color).toContain('text-'); // Should have both bg and text classes
    });
  });

  it('should handle empty string gracefully', () => {
    const color = getCategoryColor('');
    expect(color).toBeDefined();
    expect(typeof color).toBe('string');
  });

  it('should handle special characters', () => {
    const categories = [
      'Health & Wellness',
      'Tips/Guide',
      'Science-Based',
      'Q&A',
    ];

    categories.forEach(cat => {
      const color = getCategoryColor(cat);
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });
  });

  it('should return from consistent color palette', () => {
    const colors = new Set<string>();
    
    for (let i = 0; i < 100; i++) {
      const color = getCategoryColor(`category${i}`);
      colors.add(color);
    }

    // Should have multiple but limited colors (deterministic hash)
    expect(colors.size).toBeGreaterThan(1);
    expect(colors.size).toBeLessThanOrEqual(10);
  });
});
