import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

// GET /api/results/:roll - Get result by roll number
router.get('/:roll', async (req, res) => {
  try {
    const { roll } = req.params;
    const result = await Result.findOne({ roll });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found for this Roll Number'
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

// POST /api/results - Add a new result (For testing/admin purposes)
router.post('/', async (req, res) => {
  try {
    // Basic validation
    const { roll, name, course, semester, marks, class: studentClass, session } = req.body;
    
    if (!roll || !name || !course || !marks) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if result already exists
    let result = await Result.findOne({ roll });
    if (result) {
      return res.status(400).json({
        success: false,
        message: 'Result already exists for this roll number'
      });
    }

    result = new Result({
      roll,
      name,
      course,
      semester,
      marks,
      class: studentClass,
      session
    });

    await result.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error adding result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
