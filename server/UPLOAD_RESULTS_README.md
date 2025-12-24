# Student Results Upload Script

## Overview

A Node.js script to upload student results from JSON files directly to MongoDB database.

## Files Created

- `upload_results.js` - Main upload script
- `sample_results.json` - Example JSON format

## Usage

### Basic Upload (Skip Duplicates)

```bash
cd server
node upload_results.js sample_results.json
```

### Upload with Update (Overwrite Existing)

```bash
node upload_results.js results.json --update
```

### Upload from Different Location

```bash
node upload_results.js C:\Users\Desktop\student_results.json
```

## JSON Format

The JSON file must be an array of result objects with the following structure:

```json
[
  {
    "roll": "1001",
    "name": "Student Name",
    "class": "B.Sc Computer Science",
    "session": "6th",
    "marks": {
      "Mathematics": 95,
      "Computer Science": 80,
      "Physics": 70
    }
  }
]
```

### Required Fields

- `roll` (String) - Student roll number (must be unique)
- `name` (String) - Student full name
- `class` (String) - Class/program name
- `session` (String) - Session/semester
- `marks` (Object) - Subject names as keys, marks as values (numbers)

## Features

✅ **Batch Upload** - Upload multiple results at once  
✅ **Duplicate Detection** - Automatically detects existing records  
✅ **Update Mode** - Option to update existing records with `--update` flag  
✅ **Error Handling** - Validates data and continues on errors  
✅ **Progress Tracking** - Shows detailed progress for each record  
✅ **Summary Report** - Displays complete statistics after upload

## Output Example

```
📦 Connecting to MongoDB...
✅ Connected to MongoDB
📊 Database: punjab-college

📄 Reading JSON file: results.json
📝 Found 10 result(s) in file

✅ Result 1: Created - Roll: 1001, Name: Student Name
✅ Result 2: Created - Roll: 1002, Name: Another Student
⚠️  Result 3: Skipped (already exists) - Roll: 1003, Name: Existing Student

═══════════════════════════════════════
📊 UPLOAD SUMMARY
═══════════════════════════════════════
✅ Successfully created: 8
🔄 Updated: 0
⚠️  Skipped: 2
❌ Errors: 0
📝 Total processed: 10
═══════════════════════════════════════
```

## Tips for PC Usage

1. **Prepare Your Data**

   - Create a JSON file with all student results
   - Use `sample_results.json` as a template
   - Ensure all required fields are present

2. **Test First**

   - Test with a small file (2-3 records) first
   - Verify the data appears correctly in the website

3. **Use Update Mode Carefully**

   - Without `--update`: Existing records are skipped (safe)
   - With `--update`: Existing records are overwritten (use with caution)

4. **Check Results**
   - After upload, verify at: http://localhost:5173/result
   - Search for student roll numbers to confirm

## Troubleshooting

### Error: MongoDB Connection Failed

- Ensure MongoDB is running
- Check `.env` file has correct `MONGODB_URI`

### Error: File not found

- Use absolute path: `C:\Users\...\results.json`
- Or navigate to server directory first: `cd server`

### Error: Missing required fields

- Check JSON format matches the example
- Ensure all required fields are present

### Validation Errors

- Roll numbers must be unique
- Marks must be numbers, not strings
- All required fields must have values
