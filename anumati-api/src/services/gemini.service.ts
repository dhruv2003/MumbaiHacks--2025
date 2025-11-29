import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(DATA_DIR, 'gemini_cache.json');

interface CacheEntry {
  response: string;
  timestamp: number;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private embeddingModel: any;
  private cache: Map<string, CacheEntry> = new Map();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in .env');
    }

    this.genAI = new GoogleGenerativeAI(apiKey || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.embeddingModel = this.genAI.getGenerativeModel({ model: 'embedding-001' });

    this.loadCache();
  }

  private loadCache() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        this.cache = new Map(Object.entries(data));
        console.log(`Loaded ${this.cache.size} entries from Gemini cache`);
      }
    } catch (error) {
      console.error('Error loading Gemini cache:', error);
    }
  }

  private saveCache() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = Object.fromEntries(this.cache.entries());
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving Gemini cache:', error);
    }
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      // Check cache first (using a prefix for embeddings)
      const cacheKey = `emb:${text}`;
      if (this.cache.has(cacheKey)) {
        return JSON.parse(this.cache.get(cacheKey)!.response);
      }

      const result = await this.embeddingModel.embedContent(text);
      const embedding = result.embedding.values;

      // Cache the result
      this.cache.set(cacheKey, {
        response: JSON.stringify(embedding),
        timestamp: Date.now()
      });
      this.saveCache();

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a dummy embedding if API fails (fallback)
      return new Array(768).fill(0);
    }
  }

  async chat(query: string, context: string): Promise<string> {
    try {
      const prompt = `
      You are a helpful financial assistant for a user. 
      Use the following context about the user's finances to answer their question.
      If the answer is not in the context, say you don't have that information.
      
      Context:
      ${context}
      
      User Question: ${query}
      
      Answer (in Indian context, use ₹ symbol):
      `;

      // Check cache
      const cacheKey = `chat:${prompt}`;
      if (this.cache.has(cacheKey)) {
        console.log('Serving from cache');
        return this.cache.get(cacheKey)!.response;
      }

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Cache the result
      this.cache.set(cacheKey, {
        response,
        timestamp: Date.now()
      });
      this.saveCache();

      return response;
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
