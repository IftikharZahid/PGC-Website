import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Result from './models/Result.js';

dotenv.config();

const results = [
  {
    roll: "1001",
    name: "Zikki",
    course: "B.Sc Computer Science",
    semester: "6th",
    marks: {
      "Cloud Computing": 88,
      "Artificial Intelligence": 92,
      "Web Technologies": 85,
      "Data Warehousing": 79,
      "Project": 95
    }
  },
  {
    roll: "zikki",
    name: "Zikki",
    course: "B.Sc Computer Science",
    semester: "6th",
    marks: {
      "Cloud Computing": 88,
      "Artificial Intelligence": 92,
      "Web Technologies": 85,
      "Data Warehousing": 79,
      "Project": 95
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    for (const result of results) {
      // Check if exists
      const exists = await Result.findOne({ roll: result.roll });
      if (exists) {
        await Result.findOneAndUpdate({ roll: result.roll }, result);
        console.log(`✅ Updated result for roll: ${result.roll}`);
      } else {
        await Result.create(result);
        console.log(`✅ Created result for roll: ${result.roll}`);
      }
    }

    console.log('🎉 Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
