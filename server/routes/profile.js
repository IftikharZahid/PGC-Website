import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// GET /api/profile/:email - Get user profile
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await Student.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// PUT /api/profile/:email - Update user profile
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Don't allow email or password updates through this route
    delete updates.email;
    delete updates.password;

    const updatedUser = await Student.findOneAndUpdate(
      { email: email.toLowerCase() },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
