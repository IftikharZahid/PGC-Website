import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanupDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const db = mongoose.connection.db;
    const resultsCollection = db.collection('results');

    // Remove old 'course' and 'semester' fields from all records
    const result = await resultsCollection.updateMany(
      {},
      {
        $unset: { course: "", semester: "" }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} records`);
    console.log('🎉 Cleanup complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
};

cleanupDB();
