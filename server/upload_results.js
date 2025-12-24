import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Result Schema (must match your model)
const ResultSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  marks: {
    type: Map,
    of: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', ResultSchema);

/**
 * Upload student results from a JSON file to MongoDB
 * @param {string} jsonFilePath - Path to the JSON file containing results
 * @param {boolean} updateExisting - If true, update existing records; if false, skip duplicates
 */
async function uploadResults(jsonFilePath, updateExisting = false) {
  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log('');

    // Read JSON file
    console.log(`📄 Reading JSON file: ${jsonFilePath}`);
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const results = JSON.parse(fileContent);

    // Validate that results is an array
    if (!Array.isArray(results)) {
      throw new Error('JSON file must contain an array of result objects');
    }

    console.log(`📝 Found ${results.length} result(s) in file`);
    console.log('');

    let successCount = 0;
    let updateCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Process each result
    for (let i = 0; i < results.length; i++) {
      const resultData = results[i];
      
      try {
        // Validate required fields
        if (!resultData.roll || !resultData.name || !resultData.class || !resultData.session || !resultData.marks) {
          console.log(`❌ Result ${i + 1}: Missing required fields (roll, name, class, session, marks)`);
          errorCount++;
          continue;
        }

        // Check if result already exists
        const existingResult = await Result.findOne({ roll: resultData.roll });

        if (existingResult) {
          if (updateExisting) {
            // Update existing result
            await Result.findOneAndUpdate(
              { roll: resultData.roll },
              resultData,
              { new: true }
            );
            console.log(`✅ Result ${i + 1}: Updated - Roll: ${resultData.roll}, Name: ${resultData.name}`);
            updateCount++;
          } else {
            console.log(`⚠️  Result ${i + 1}: Skipped (already exists) - Roll: ${resultData.roll}, Name: ${resultData.name}`);
            skipCount++;
          }
        } else {
          // Create new result
          await Result.create(resultData);
          console.log(`✅ Result ${i + 1}: Created - Roll: ${resultData.roll}, Name: ${resultData.name}`);
          successCount++;
        }
      } catch (error) {
        console.log(`❌ Result ${i + 1}: Error - ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📊 UPLOAD SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Successfully created: ${successCount}`);
    console.log(`🔄 Updated: ${updateCount}`);
    console.log(`⚠️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${results.length}`);
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('');
    console.error('❌ UPLOAD FAILED');
    console.error('═══════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('═══════════════════════════════════════');
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('');
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     STUDENT RESULTS UPLOAD SCRIPT                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('USAGE:');
  console.log('  node upload_results.js <json-file-path> [--update]');
  console.log('');
  console.log('PARAMETERS:');
  console.log('  <json-file-path>  Path to JSON file containing results');
  console.log('  --update          Optional: Update existing records instead of skipping');
  console.log('');
  console.log('EXAMPLES:');
  console.log('  node upload_results.js results.json');
  console.log('  node upload_results.js ./data/results.json --update');
  console.log('  node upload_results.js C:\\Users\\Desktop\\results.json');
  console.log('');
  console.log('JSON FORMAT EXAMPLE:');
  console.log('[');
  console.log('  {');
  console.log('    "roll": "1001",');
  console.log('    "name": "Student Name",');
  console.log('    "class": "B.Sc Computer Science",');
  console.log('    "session": "6th",');
  console.log('    "marks": {');
  console.log('      "Mathematics": 95,');
  console.log('      "Computer Science": 80,');
  console.log('      "Physics": 70');
  console.log('    }');
  console.log('  }');
  console.log(']');
  console.log('');
  process.exit(1);
}

const jsonFilePath = args[0];
const updateExisting = args.includes('--update');

// Check if file exists
if (!fs.existsSync(jsonFilePath)) {
  console.error(`❌ Error: File not found - ${jsonFilePath}`);
  process.exit(1);
}

// Run the upload
uploadResults(jsonFilePath, updateExisting);
