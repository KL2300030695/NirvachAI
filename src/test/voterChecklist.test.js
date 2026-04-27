import { describe, it, expect } from 'vitest';
import { voterChecklist, importantLinks } from '../data/voterChecklist';

describe('Voter Checklist Data', () => {
  it('should have at least 3 sections', () => {
    expect(voterChecklist.length).toBeGreaterThanOrEqual(3);
  });

  it('each section should have id, title, description, icon, items', () => {
    voterChecklist.forEach((section) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('description');
      expect(section).toHaveProperty('icon');
      expect(section).toHaveProperty('items');
    });
  });

  it('each item should have id, text, required fields', () => {
    voterChecklist.forEach((section) => {
      section.items.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('text');
        expect(typeof item.text).toBe('string');
        expect(item.text.length).toBeGreaterThan(5);
      });
    });
  });

  it('total items should be at least 15', () => {
    const total = voterChecklist.reduce((sum, s) => sum + s.items.length, 0);
    expect(total).toBeGreaterThanOrEqual(15);
  });

  it('all item ids should be unique', () => {
    const ids = voterChecklist.flatMap(s => s.items.map(i => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Important Links', () => {
  it('should have at least 2 links', () => {
    expect(importantLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('each link should have url, title, description', () => {
    importantLinks.forEach((link) => {
      expect(link).toHaveProperty('url');
      expect(link).toHaveProperty('title');
      expect(link).toHaveProperty('description');
      expect(link.url).toMatch(/^https?:\/\//);
    });
  });
});
