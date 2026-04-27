import { describe, it, expect, vi } from 'vitest';
import { generateChatResponse, generateQuizExplanation } from '../services/gemini';

// Mock @google/genai
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'The Election Commission of India (ECI) is a constitutional body responsible for administering elections.',
      }),
    },
  })),
}));

describe('Gemini AI Service', () => {
  describe('generateChatResponse', () => {
    it('should return a response string for valid input', async () => {
      const response = await generateChatResponse('What is ECI?');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle empty input gracefully', async () => {
      const response = await generateChatResponse('');
      expect(typeof response).toBe('string');
    });

    it('should return fallback for voting-related queries when API key missing', async () => {
      // With no real API key, fallback kicks in
      const response = await generateChatResponse('How does voting work?');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(50);
    });

    it('should return fallback for EVM queries', async () => {
      const response = await generateChatResponse('Tell me about EVM machines');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(50);
    });

    it('should return fallback for registration queries', async () => {
      const response = await generateChatResponse('How to register to vote?');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(50);
    });

    it('should return a non-empty response for generic queries', async () => {
      const response = await generateChatResponse('hello');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(10);
    });
  });

  describe('generateQuizExplanation', () => {
    it('should return explanation string', async () => {
      const question = { question: 'What is NOTA?', explanation: 'NOTA stands for None Of The Above' };
      const response = await generateQuizExplanation(question, 'None Of The Above', 'Some wrong answer');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });
  });
});
