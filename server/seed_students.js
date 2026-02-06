// Script to add 20 random students with realistic Pakistani names and data
// Run with: node seed_students.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pgc-website';

// Pakistani first names
const firstNames = [
    'Ahmed', 'Muhammad', 'Ali', 'Hassan', 'Usman', 'Bilal', 'Hamza', 'Zain', 'Omar', 'Fahad',
    'Fatima', 'Ayesha', 'Zainab', 'Maryam', 'Hira', 'Sana', 'Amna', 'Khadija', 'Maham', 'Laiba'
];

// Pakistani last names
const lastNames = [
    'Khan', 'Ahmed', 'Ali', 'Malik', 'Hussain', 'Shah', 'Raza', 'Iqbal', 'Butt', 'Chaudhry',
    'Qureshi', 'Siddiqui', 'Mirza', 'Bhatti', 'Javed', 'Aslam', 'Rashid', 'Akram', 'Tariq', 'Nawaz'
];

// Classes/Programs
const classes = [
    'FSc Pre-Medical - 1st Year',
    'FSc Pre-Medical - 2nd Year',
    'FSc Pre-Engineering - 1st Year',
    'FSc Pre-Engineering - 2nd Year',
    'ICS - 1st Year',
    'ICS - 2nd Year',
    'ICom - 1st Year',
    'ICom - 2nd Year',
    'FA - 1st Year',
    'FA - 2nd Year'
];

// Phone prefixes
const phonePrefixes = ['0300', '0301', '0302', '0303', '0304', '0311', '0312', '0321', '0331', '0333'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
    const prefix = getRandomElement(phonePrefixes);
    const number = Math.floor(Math.random() * 9000000 + 1000000);
    return `${prefix}-${number}`;
}

function generateRollNo(index) {
    const year = 2024;
    const num = (index + 1).toString().padStart(3, '0');
    return `PGC-${year}-${num}`;
}

async function seedStudents() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const students = [];

        for (let i = 0; i < 20; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@student.pgc.edu.pk`;
            const phone = generatePhone();
            const studentClass = getRandomElement(classes);
            const rollNo = generateRollNo(i);
            const studentId = `STU2024${(1000 + i).toString()}`; // e.g., STU20241000

            students.push({
                name,
                email,
                password: 'student123', // Will be hashed by pre-save hook
                phone,
                class: studentClass,
                rollNo,
                studentId,
                status: 'Active'
            });
        }

        let successCount = 0;
        let skipCount = 0;

        for (const studentData of students) {
            try {
                // Check if email already exists
                const existing = await Student.findOne({ email: studentData.email });
                if (existing) {
                    console.log(`⏭️  Skipped: ${studentData.name} (email exists)`);
                    skipCount++;
                    continue;
                }

                const student = new Student(studentData);
                await student.save();
                console.log(`✅ Created: ${studentData.name} | ${studentData.rollNo} | ${studentData.class}`);
                successCount++;
            } catch (err) {
                console.error(`❌ Error creating ${studentData.name}:`, err.message);
            }
        }

        console.log('\n========================================');
        console.log(`✅ Successfully created: ${successCount} students`);
        console.log(`⏭️  Skipped (existing): ${skipCount} students`);
        console.log(`🔐 Default password: student123`);
        console.log('========================================');

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedStudents();
