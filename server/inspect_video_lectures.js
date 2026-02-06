
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VideoLecture from './models/VideoLecture.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force usage of Google DNS to fix connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const inspectLectures = async () => {
    console.log('🔍 Inspecting Video Lectures...');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is undefined!');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Check total count
        const totalCount = await VideoLecture.countDocuments();
        console.log(`\n📊 Total Video Lectures (all statuses): ${totalCount}`);

        // Check active count
        const activeCount = await VideoLecture.countDocuments({ status: 'Active' });
        console.log(`✅ Active Video Lectures: ${activeCount}`);

        // List all lectures with limited details
        const lectures = await VideoLecture.find({});
        console.log('\n📋 Lecture List:');

        if (lectures.length === 0) {
            console.log('   (No lectures found)');
        } else {
            lectures.forEach(l => {
                console.log(`   - [${l.status}] ${l.title} (ID: ${l.courseId})`);
                console.log(`     Lessons: ${l.lessons ? l.lessons.length : 0}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Done');
    }
};

inspectLectures();
