
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Result from './models/Result.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testResult = {
            name: "Test Student",
            roll: "PGC-2024-001",
            class: "ICS",
            session: "2024-2026",
            marks: {
                "Physics": 85,
                "Chemistry": 90,
                "Math": 95,
                "English": 88
            },
            maxMarks: {
                "Physics": 100,
                "Chemistry": 100,
                "Math": 100,
                "English": 100
            },
            totalMarks: 400,
            obtainedMarks: 358,
            percentage: 89.5,
            grade: "A",
            isPublished: true
        };

        // Upsert the test result
        await Result.updateOne(
            { roll: testResult.roll },
            { $set: testResult },
            { upsert: true }
        );

        console.log('Seed data inserted successfully');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
