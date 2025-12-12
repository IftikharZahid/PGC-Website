import express from 'express';
import Admission from '../models/Admission.js';

const router = express.Router();

// POST /api/admissions - Submit new admission application
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      academic,
      program
    } = req.body;

    // Validation - required fields
    if (!fullName || !email || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required personal information'
      });
    }

    if (!address || !address.street || !address.city || !address.postalCode || !address.country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete address information'
      });
    }

    if (!academic || !academic.previousSchool || !academic.graduationYear || !academic.gpa) {
      return res.status(400).json({
        success: false,
        message: 'Please provide academic background information'
      });
    }

    if (!program || !program.desiredCourse || !program.preferredTerm) {
      return res.status(400).json({
        success: false,
        message: 'Please provide program selection'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if application already exists with this email
    const existingApplication = await Admission.findOne({ email: email.toLowerCase() });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'An application with this email already exists',
        data: {
          applicationId: existingApplication.applicationId,
          submittedAt: existingApplication.submittedAt
        }
      });
    }

    // Generate Application ID
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const applicationId = `ADM-${year}-${randomId}`;

    // Create new application
    const newApplication = await Admission.create({
      applicationId,
      fullName,
      email: email.toLowerCase(),
      phone,
      dateOfBirth,
      gender,
      address,
      academic,
      program
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will contact you soon.',
      data: {
        applicationId: newApplication.applicationId,
        submittedAt: newApplication.submittedAt,
        email: newApplication.email,
        fullName: newApplication.fullName
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission',
      error: error.message
    });
  }
});

// GET /api/admissions - Get all applications (for admin/debugging)
router.get('/', async (req, res) => {
  try {
    const applications = await Admission.find({}).sort({ submittedAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
