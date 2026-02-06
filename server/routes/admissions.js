import express from 'express';
import mongoose from 'mongoose';
import Admission from '../models/Admission.js';
import Student from '../models/Student.js';
import { generatePassword } from '../utils/passwordGenerator.js';
import { sendLoginCredentialsEmail } from '../utils/emailService.js';

const router = express.Router();

// POST /api/admissions - Submit new admission application
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      academic,
      program,
      documents,
      enrolledSubjects
    } = req.body;

    // DEBUG: Write payload
    try {
      const fs = await import('fs');
      fs.writeFileSync('C:\\Users\\USER\\Desktop\\PGC Website\\debug_payload.txt', JSON.stringify(req.body, null, 2));
    } catch (e) { }

    // Validation - required fields
    if (!fullName || !fatherName || !email || !phone || !dateOfBirth || !gender) {
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

    // Document validation - Optional now
    // if (!documents || !documents.matricResultCard || !documents.cnicPicture) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please upload required documents (Matric Result Card and CNIC Picture)'
    //   });
    // }

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

    console.log('Received admission submission:', { email, fullName });

    // Ensure documents object exists to avoid runtime errors
    const docs = documents || {};

    // Create new application
    const newApplication = await Admission.create({
      applicationId,
      fullName,
      fatherName,
      email: email.toLowerCase(),
      phone,
      dateOfBirth,
      gender,
      address,
      academic,
      program,
      enrolledSubjects: enrolledSubjects || [],
      documents: {
        profilePicture: docs.profilePicture || '',
        matricResultCard: docs.matricResultCard || '',
        cnicPicture: docs.cnicPicture || ''
      }
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        applicationId: newApplication.applicationId,
        submittedAt: newApplication.submittedAt,
        email: newApplication.email,
        fullName: newApplication.fullName
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);

    // DEBUG: Write error to file
    try {
      const fs = await import('fs');
      const path = await import('path');
      fs.writeFileSync('C:\\Users\\USER\\Desktop\\PGC Website\\debug_error.txt', JSON.stringify({
        message: error.message,
        stack: error.stack,
        validation: error.errors // Mongoose validation errors
      }, null, 2));
    } catch (e) { console.error('Failed to write debug log', e); }

    res.status(500).json({
      success: false,
      message: 'Server error during application submission: ' + error.message,
      error: error.message
    });
  }
});

// PUT /api/admissions/:id/status - Update application status (Approve/Reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'approved', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let admission;
    if (mongoose.Types.ObjectId.isValid(id)) {
      admission = await Admission.findById(id);
    } else {
      admission = await Admission.findOne({ applicationId: id });
    }

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission application not found' });
    }

    admission.status = status.toLowerCase();
    await admission.save();

    // If approved, create student account
    if (status.toLowerCase() === 'approved') {
      try {
        // Check if student account already exists
        const existingStudent = await Student.findOne({ email: admission.email.toLowerCase() });

        if (!existingStudent) {
          // Generate credentials
          const generatedPassword = generatePassword(8);
          const year = new Date().getFullYear();
          const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const studentId = `STU${year}${randomNum}`;

          // Create student account
          const newStudent = await Student.create({
            studentId,
            name: admission.fullName,
            email: admission.email.toLowerCase(),
            password: generatedPassword,
            phone: admission.phone,
            class: admission.program.desiredCourse,
            profilePicture: admission.documents.profilePicture || ''
          });

          // Send login credentials via email
          await sendLoginCredentialsEmail(
            admission.email.toLowerCase(),
            admission.fullName,
            studentId,
            generatedPassword
          );

          console.log(`\n✅ Student account created successfully for approved admission!`);
        }
      } catch (err) {
        console.error('Error creating student account during approval:', err);
        // We don't rollback the approval, but we log the error
      }
    }

    res.json({ success: true, message: `Application ${status}`, data: admission });

  } catch (error) {
    console.error('Error updating admission status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
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
