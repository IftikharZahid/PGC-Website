import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force usage of Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

const connectDB = async () => {
    console.log('Testing MongoDB Connection with DNS override (8.8.8.8)...');
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI is undefined or empty locally/env!');
        return;
    }

    console.log(`URI found (masked): ${uri.substring(0, 15)}...`);

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        });
        console.log('✅ MongoDB Connected Successfully!');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Connection Failed:', error);
        console.log('Full Error Object:', JSON.stringify(error, null, 2));
    }
};

connectDB();
