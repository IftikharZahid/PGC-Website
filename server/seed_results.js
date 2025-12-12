import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Result from './models/Result.js';

dotenv.config();

const results = [
  {
    roll: "1001",
    name: "Zikki",
    class: "B.Sc Computer Science",
    session: "6th",
    marks: {
      "Mathematics": 95,
      "Computer Science": 80,
      "Biology": 90,
      "Chemistry": 80,
      "Physics": 70,
      "Psychology": 85,
      "Economics": 65,
      "English": 85,
      "Statistics": 75,
      "Project": 95,
      "Tarjuma tul Quran": 85,
      "Pak Study": 85,
      "Islamiat": 85,
      "Urdu": 85,
 
    }
  },
  {
    roll: "zikki",
    name: "Zikki",
    class: "B.Sc Computer Science",
    session: "6th",
    marks: {
      "Mathematics": 95,
      "Computer Science": 80,
      "Biology": 90,
      "Chemistry": 80,
      "Physics": 70,
      "Psychology": 85,
      "Economics": 65,
      "English": 85,
      "Statistics": 75,
      "Project": 95,
      "Tarjuma tul Quran": 85,
      "Pak Study": 85,
      "Islamiat": 85,
      "Urdu": 85,
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
