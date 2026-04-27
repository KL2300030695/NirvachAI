import { describe, it, expect } from 'vitest';
import { quizQuestions, quizCategories } from '../data/quizQuestions';

describe('Quiz Questions Data', () => {
  it('should have at least 25 questions', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(25);
  });

  it('each question should have required fields', () => {
    const requiredFields = ['id', 'question', 'options', 'correctAnswer', 'explanation', 'category', 'difficulty'];
    quizQuestions.forEach((q) => {
      requiredFields.forEach((field) => {
        expect(q).toHaveProperty(field);
      });
    });
  });

  it('each question should have exactly 4 options', () => {
    quizQuestions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('correctAnswer should be a valid index (0-3)', () => {
    quizQuestions.forEach((q) => {
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThanOrEqual(3);
    });
  });

  it('difficulty should be one of beginner, intermediate, advanced', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    quizQuestions.forEach((q) => {
      expect(validDifficulties).toContain(q.difficulty);
    });
  });

  it('each question should have a non-empty explanation', () => {
    quizQuestions.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });

  it('each question category should exist in quizCategories', () => {
    const categoryIds = quizCategories.map(c => c.id);
    quizQuestions.forEach((q) => {
      expect(categoryIds).toContain(q.category);
    });
  });

  it('each question should have unique id', () => {
    const ids = quizQuestions.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Quiz Categories', () => {
  it('should have at least 3 categories', () => {
    expect(quizCategories.length).toBeGreaterThanOrEqual(3);
  });

  it('each category should have id, title, description, icon, color', () => {
    quizCategories.forEach((cat) => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('title');
      expect(cat).toHaveProperty('description');
      expect(cat).toHaveProperty('icon');
      expect(cat).toHaveProperty('color');
    });
  });

  it('each category should have questions associated', () => {
    quizCategories.forEach((cat) => {
      const questions = quizQuestions.filter(q => q.category === cat.id);
      expect(questions.length).toBeGreaterThanOrEqual(1);
    });
  });
});
