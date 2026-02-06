import express from 'express';
import Result from '../models/Result.js';
import mongoose from 'mongoose';

const router = express.Router();

// Public Route - Get Stats & Top Performers
router.get('/public/stats', async (req, res) => {
  try {
    const publishedResults = await Result.find({ isPublished: true }).lean();

    // Calculate Stats
    const totalStudents = publishedResults.length;
    const passedStudents = publishedResults.filter(r => r.grade !== 'F').length;
    const passRate = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) + '%' : '0%';

    const totalPercentage = publishedResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
    const average = totalStudents > 0 ? (totalPercentage / totalStudents).toFixed(1) + '%' : '0%';

    const perfectScores = publishedResults.filter(r => r.percentage >= 90).length;

    // Get Top 5 Performers
    const topPerformers = publishedResults
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        roll: r.roll,
        course: r.class,
        percentage: r.percentage
      }));

    res.json({
      success: true,
      data: {
        stats: {
          perfectScores,
          average,
          passRate,
          bestSubject: 'Physics' // Placeholder
        },
        topPerformers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/results/public/:roll - Get result by roll number
router.get('/public/:roll', async (req, res) => {
  try {
    const { roll } = req.params;
    // CRITICAL: Only return published results for public access
    const result = await Result.findOne({
      roll: { $regex: new RegExp(`^${roll}$`, 'i') }, // Case-insensitive exact match
      isPublished: true
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found or not published'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin Route - Get All Results (with filtering)
router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ roll: 1 });
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Route - Create Result
router.post('/', async (req, res) => {
  try {
    // Check duplication
    const existing = await Result.findOne({
      roll: { $regex: new RegExp(`^${req.body.roll}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Result with this Roll Number already exists'
      });
    }

    const result = new Result(req.body);
    await result.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin Route - Update Result
router.put('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin Route - Toggle Publish Status
router.patch('/:id/toggle-publish', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    console.log(`[DEBUG] Toggling publish for ${result.roll}. Old status: ${result.isPublished}`);
    result.isPublished = !result.isPublished;
    await result.save();
    console.log(`[DEBUG] New status: ${result.isPublished}`);

    res.json({
      success: true,
      data: result,
      message: `Result ${result.isPublished ? 'published' : 'unpublished'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Route - Delete Result
router.delete('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    res.json({ success: true, message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Route - Sync Father Names
router.post('/sync-father-names', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const resultsColl = db.collection('results');
    const studentsColl = db.collection('students');
    const admissionsColl = db.collection('admissions');

    // Fetch Lookups
    const students = await studentsColl.find({ rollNo: { $exists: true, $ne: '' } }).toArray();
    const admissions = await admissionsColl.find({ fatherName: { $exists: true, $ne: '' } }).toArray();

    const rollToEmail = {};
    students.forEach(s => {
      if (s.rollNo && s.email) rollToEmail[s.rollNo] = s.email.toLowerCase();
    });

    const emailToFatherName = {};
    admissions.forEach(a => {
      if (a.email && a.fatherName) emailToFatherName[a.email.toLowerCase()] = a.fatherName;
    });

    const results = await resultsColl.find({}).toArray();
    let updatedCount = 0;

    for (const resItem of results) {
      const roll = resItem.roll;
      const email = rollToEmail[roll];

      if (email) {
        const fatherName = emailToFatherName[email];
        if (fatherName && resItem.fatherName !== fatherName) {
          await resultsColl.updateOne(
            { _id: resItem._id },
            { $set: { fatherName: fatherName } }
          );
          updatedCount++;
        }
      }
    }

    res.json({ success: true, message: `Synced ${updatedCount} records.` });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
