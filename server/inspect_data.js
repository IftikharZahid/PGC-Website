
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function inspect() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        const collection = mongoose.connection.db.collection('results');

        // Check if ANY doc has fatherName (or FatherName)
        const doc = await collection.findOne({
            $or: [
                { fatherName: { $exists: true } },
                { FatherName: { $exists: true } },
                { father_name: { $exists: true } }
            ]
        });

        if (doc) {
            console.log('Found Document with father name field:');
            console.log(JSON.stringify(doc, null, 2));
        } else {
            console.log('No documents found with known father name fields.');
            const sample = await collection.findOne({});
            console.log('Sample Document keys:', Object.keys(sample || {}));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

inspect();
