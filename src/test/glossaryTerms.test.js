import { describe, it, expect } from 'vitest';
import { glossaryTerms } from '../data/glossaryTerms';

describe('Glossary Terms Data', () => {
  it('should have at least 15 terms', () => {
    expect(glossaryTerms.length).toBeGreaterThanOrEqual(15);
  });

  it('each term should have required fields', () => {
    const requiredFields = ['id', 'term', 'definition', 'category', 'context'];
    glossaryTerms.forEach((t) => {
      requiredFields.forEach((field) => {
        expect(t).toHaveProperty(field);
      });
    });
  });

  it('each term should have unique id', () => {
    const ids = glossaryTerms.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('definitions should be descriptive (>20 chars)', () => {
    glossaryTerms.forEach((t) => {
      expect(t.definition.length).toBeGreaterThan(20);
    });
  });

  it('context should provide additional info (>20 chars)', () => {
    glossaryTerms.forEach((t) => {
      expect(t.context.length).toBeGreaterThan(20);
    });
  });

  it('category should be a non-empty string', () => {
    glossaryTerms.forEach((t) => {
      expect(typeof t.category).toBe('string');
      expect(t.category.length).toBeGreaterThan(0);
    });
  });
});
