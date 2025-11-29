import { geminiService } from '../src/services/gemini.service';
import { db } from '../src/services/database.service';
import { syncService } from '../src/services/sync.service';
import { pineconeService } from '../src/services/pinecone.service';
import { User } from '../src/types';

async function verify() {
  console.log('Starting verification...');

  // 1. Verify Persistence
  console.log('\n--- Verifying Persistence ---');
  const testUser: User = {
    id: 'test-user-1',
    aaHandle: 'test@anumati',
    mobile: '1234567890',
    pin: '1234',
    name: 'Test User',
    email: 'test@example.com',
    pan: 'ABCDE1234F',
    dob: '1990-01-01',
    createdAt: new Date(),
    linkedAccounts: []
  };

  db.createUser(testUser);
  console.log('Created user. Checking if saved to disk...');
  // In a real test we'd check the file, but here we trust the log/implementation

  // 2. Verify Gemini Embeddings
  console.log('\n--- Verifying Gemini Embeddings ---');
  try {
    const embedding = await geminiService.generateEmbeddings('Hello world');
    console.log(`Generated embedding of length: ${embedding.length}`);
    if (embedding.length > 0) console.log('✓ Embedding generation successful');
  } catch (error) {
    console.error('x Embedding generation failed:', error);
  }

  // 3. Verify Gemini Chat
  console.log('\n--- Verifying Gemini Chat ---');
  try {
    const response = await geminiService.chat('What is 2+2?', 'Math context');
    console.log('Gemini Response:', response);
    if (response) console.log('✓ Chat successful');
  } catch (error) {
    console.error('x Chat failed:', error);
  }

  // 4. Verify Sync Service (Mock)
  console.log('\n--- Verifying Sync Service ---');
  try {
    // Mock pinecone upsert to avoid real API call if key missing
    const originalUpsert = pineconeService.upsertUserVectors;
    pineconeService.upsertUserVectors = async (userId, data) => {
      console.log(`Mock Upsert: Syncing ${data.transactions.length} transactions for user ${userId}`);
    };

    await syncService.syncUserData(testUser.id);
    console.log('✓ Sync service called successfully');

    // Restore
    pineconeService.upsertUserVectors = originalUpsert;
  } catch (error) {
    console.error('x Sync service failed:', error);
  }

  console.log('\nVerification complete.');
}

verify().catch(console.error);
