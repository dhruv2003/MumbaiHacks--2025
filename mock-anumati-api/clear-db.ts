import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || '';
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || 'anumati_db' });

    console.log('Connected to MongoDB');

    // Drop all collections
    const collections = await mongoose.connection.db!.collections();

    for (const collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log('Database cleared successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
