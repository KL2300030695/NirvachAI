import { describe, it, expect } from 'vitest';
import { electionStages } from '../data/electionStages';

describe('Election Stages Data', () => {
  it('should have exactly 9 election stages', () => {
    expect(electionStages).toHaveLength(9);
  });

  it('each stage should have required fields', () => {
    const requiredFields = ['id', 'number', 'title', 'description', 'duration', 'icon', 'color', 'details', 'keyFacts', 'officials', 'legalReference'];
    electionStages.forEach((stage) => {
      requiredFields.forEach((field) => {
        expect(stage).toHaveProperty(field);
      });
    });
  });

  it('stage numbers should be sequential 1-9', () => {
    electionStages.forEach((stage, index) => {
      expect(stage.number).toBe(index + 1);
    });
  });

  it('each stage should have unique id', () => {
    const ids = electionStages.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each stage should have at least 2 key details', () => {
    electionStages.forEach((stage) => {
      expect(stage.details.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('each stage should have at least 1 key fact', () => {
    electionStages.forEach((stage) => {
      expect(stage.keyFacts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('each stage should have at least 1 official', () => {
    electionStages.forEach((stage) => {
      expect(stage.officials.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('each stage should have a valid color hex', () => {
    electionStages.forEach((stage) => {
      expect(stage.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('first stage should be election announcement', () => {
    expect(electionStages[0].title).toContain('Announcement');
  });

  it('last stage should be government formation', () => {
    expect(electionStages[8].title).toContain('Government Formation');
  });
});
