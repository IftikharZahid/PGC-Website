// Script to re-hash teacher passwords in MongoDB
// Run with: node rehash_passwords.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pgc-website';

async function rehashPasswords() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get the teachers collection directly (bypass Mongoose model to see raw passwords)
        const db = mongoose.connection.db;
        const teachersCollection = db.collection('teachers');

        const teachers = await teachersCollection.find({}).toArray();
        console.log(`Found ${teachers.length} teachers`);

        for (const teacher of teachers) {
            if (!teacher.password) {
                console.log(`⚠️  ${teacher.name} (${teacher.email}): No password set`);
                continue;
            }

            // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
            if (teacher.password.startsWith('$2a$') || teacher.password.startsWith('$2b$')) {
                console.log(`✓ ${teacher.name} (${teacher.email}): Password already hashed`);
                continue;
            }

            // Hash the plain-text password
            console.log(`🔄 ${teacher.name} (${teacher.email}): Hashing password...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(teacher.password, salt);

            await teachersCollection.updateOne(
                { _id: teacher._id },
                { $set: { password: hashedPassword } }
            );
            console.log(`✅ ${teacher.name}: Password hashed successfully`);
        }

        console.log('\n✅ Password rehashing complete!');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

rehashPasswords();
