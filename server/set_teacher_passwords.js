// Script to set default passwords for teachers who don't have one
// Run with: node set_teacher_passwords.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pgc-website';
const DEFAULT_PASSWORD = 'teacher123'; // Default password for all teachers

async function setTeacherPasswords() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const teachersCollection = db.collection('teachers');

        const teachers = await teachersCollection.find({}).toArray();
        console.log(`Found ${teachers.length} teachers\n`);

        // Hash the default password once
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const teacher of teachers) {
            // Check if password exists and is already hashed
            if (teacher.password && (teacher.password.startsWith('$2a$') || teacher.password.startsWith('$2b$'))) {
                console.log(`✓ ${teacher.name}: Already has password`);
                skippedCount++;
                continue;
            }

            // Set default password
            await teachersCollection.updateOne(
                { _id: teacher._id },
                { $set: { password: hashedPassword } }
            );
            console.log(`✅ ${teacher.name} (${teacher.email}): Password set to "${DEFAULT_PASSWORD}"`);
            updatedCount++;
        }

        console.log('\n========================================');
        console.log(`✅ Updated: ${updatedCount} teachers`);
        console.log(`⏭️  Skipped: ${skippedCount} teachers (already had password)`);
        console.log(`\n🔐 Default password: ${DEFAULT_PASSWORD}`);
        console.log('========================================');

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setTeacherPasswords();
