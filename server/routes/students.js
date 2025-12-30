import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching students',
      error: error.message
    });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting student',
      error: error.message
    });
  }
});

// PUT /api/students/:id - Update student details
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, course, semester, status, rollNo } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update fields
    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.status = status || student.status;
    student.rollNo = rollNo || student.rollNo;

    // Handle class update if course/semester provided
    if (course || semester) {
      // If we have both or partial, we might need to be careful. 
      // Assuming existing format "Course - Semester"
      // Use provided values or parse existing
      const currentClassParts = student.class ? student.class.split(' - ') : ['', ''];
      const newCourse = course || currentClassParts[0] || '';
      const newSemester = semester || currentClassParts[1] || '';
      student.class = `${newCourse} - ${newSemester}`;
    }

    await student.save();

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating student',
      error: error.message
    });
  }
});

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

// POST /api/students/bulk - Bulk import students from CSV
router.post('/bulk', async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No students data provided'
      });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const studentData of students) {
      try {
        // Check if student with this email already exists
        const existingStudent = await Student.findOne({
          email: studentData.email?.toLowerCase()
        });

        if (existingStudent) {
          errorCount++;
          errors.push(`${studentData.name}: Email already exists`);
          continue;
        }

        // Generate a default password (can be the roll number or a random one)
        const defaultPassword = studentData.rollNumber || `PGC${Date.now().toString().slice(-6)}`;

        // Create new student
        const newStudent = new Student({
          name: studentData.name,
          email: studentData.email?.toLowerCase() || `student${Date.now()}@pgc.edu.pk`,
          password: defaultPassword,
          phone: studentData.phone || '',
          class: studentData.class ? `${studentData.class} - ${studentData.section || 'A'}` : 'N/A',
          rollNo: studentData.rollNumber || '',
          status: 'Active'
        });

        await newStudent.save();
        successCount++;
      } catch (rowError) {
        errorCount++;
        errors.push(`${studentData.name}: ${rowError.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: `Imported ${successCount} students successfully`,
      data: {
        success: successCount,
        errors: errorCount,
        errorDetails: errors.slice(0, 10) // Return first 10 errors only
      }
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk import',
      error: error.message
    });
  }
});

export default router;
