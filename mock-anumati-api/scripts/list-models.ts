import { config } from '../src/config/env';

async function listModels() {
  try {
    const key = config.gemini.apiKey;
    if (!key) {
      console.log('No API Key found in env');
      return;
    }

    console.log(`Fetching models with key: ${key.substring(0, 5)}...`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json() as any;

    if (data.models) {
      console.log('Available Models:');
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('No models found or error:', data);
    }

  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
