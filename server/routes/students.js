import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// PUT /api/students/update-profile-picture - Update student profile picture
router.put('/update-profile-picture', async (req, res) => {
  try {
    const { email, profilePicture } = req.body;

    // Validation
    if (!email || !profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and profile picture'
      });
    }

    // Find student by email
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update profile picture
    student.profilePicture = profilePicture;
    await student.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile picture',
      error: error.message
    });
  }
});

export default router;
