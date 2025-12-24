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
      program,
      documents,
      enrolledSubjects
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

    // Document validation - required documents
    if (!documents || !documents.matricResultCard || !documents.cnicPicture) {
      return res.status(400).json({
        success: false,
        message: 'Please upload required documents (Matric Result Card and CNIC Picture)'
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
      program,
      enrolledSubjects: enrolledSubjects || [],
      documents: {
        profilePicture: documents.profilePicture || '',
        matricResultCard: documents.matricResultCard,
        cnicPicture: documents.cnicPicture
      }
    });

    // Auto-create student account with login credentials
    try {
      const Student = (await import('../models/Student.js')).default;
      const { generatePassword } = await import('../utils/passwordGenerator.js');
      const { sendLoginCredentialsEmail } = await import('../utils/emailService.js');

      // Check if student account already exists
      const existingStudent = await Student.findOne({ email: email.toLowerCase() });
      
      if (!existingStudent) {
        // Generate credentials
        const generatedPassword = generatePassword(8);
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const studentId = `STU${year}${randomNum}`;

        // Create student account
        const newStudent = await Student.create({
          studentId,
          name: fullName,
          email: email.toLowerCase(),
          password: generatedPassword,
          phone,
          class: program.desiredCourse,
          profilePicture: documents.profilePicture || ''
        });

        // Send login credentials via email
        await sendLoginCredentialsEmail(
          email.toLowerCase(),
          fullName,
          studentId,
          generatedPassword
        );

        console.log(`\n✅ Student account created successfully!`);
        console.log(`Student ID: ${studentId}`);
        console.log(`Email: ${email.toLowerCase()}`);
        console.log(`Login credentials sent to email\n`);
      } else {
        console.log(`\nℹ️ Student account already exists for ${email}`);
      }
    } catch (studentCreationError) {
      // Log error but don't fail the admission submission
      console.error('Error creating student account:', studentCreationError);
      console.log('Admission was successful, but student account creation failed.');
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Check your email for login credentials.',
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
