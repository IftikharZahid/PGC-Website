import express from 'express';
import Student from '../models/Student.js';
import Admission from '../models/Admission.js';

const router = express.Router();

// GET /api/student-portal/:email - Get student portal data
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Fetch student profile
    const student = await Student.findOne({ email: email.toLowerCase() });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Fetch admission record (if exists)
    const admission = await Admission.findOne({ email: email.toLowerCase() });

    // Current courses - use actual subjects from admission if available
    let courses = [];
    
    if (admission && admission.enrolledSubjects && admission.enrolledSubjects.length > 0) {
      // Map enrolled subjects to course format
      courses = admission.enrolledSubjects.map((subject, index) => {
        // Define instructor and schedule based on subject
        const courseInfo = {
          'English': { instructor: 'Ms. Zainab', schedule: 'Mon, Wed 9:00 AM - 10:30 AM' },
          'Computer Science': { instructor: 'Mr. Iftikhar Ahmad Zahid', schedule: 'Tue, Thu 10:00 AM - 11:30 AM' },
          'Mathematics': { instructor: 'Prof. Sara Ali', schedule: 'Mon, Wed 11:00 AM - 12:30 PM' },
          'Physics': { instructor: 'Mrs. Javed Iqbal', schedule: 'Tue, Thu 1:00 PM - 2:30 PM' },
          'Chemistry': { instructor: 'Mr. Arshad Bhutta', schedule: 'Wed, Fri 9:00 AM - 10:30 AM' },
          'Urdu': { instructor: 'Mr. Sohaib Anjum', schedule: 'Mon 2:00 PM - 3:00 PM' },
          'Islamiyat': { instructor: 'Mr. Bilal Ahmad', schedule: 'Thu 2:00 PM - 3:00 PM' },
          'Tarjuma tul Quran': { instructor: 'Mr. Saleem Khan', schedule: 'Fri 2:00 PM - 3:00 PM' },
          'Information Technology': { instructor: 'Mr. Iftikhar Ahmad Zahid', schedule: 'Tue, Thu 11:00 AM - 12:30 PM' },
          'Pakistan Studies': { instructor: 'Ms. Sana Khan', schedule: 'Wed 1:00 PM - 2:00 PM' },
          'Economics': { instructor: 'Dr. Faisal Mahmood', schedule: 'Fri 10:00 AM - 11:30 AM' }
        };

        const info = courseInfo[subject] || { 
          instructor: 'TBA', 
          schedule: 'TBA' 
        };

        return {
          code: `SUB${String(index + 1).padStart(3, '0')}`,
          name: subject,
          instructor: info.instructor,
          schedule: info.schedule,
          room: `Room ${100 + index}`,
          credits: 3
        };
      });
    } else {
      // Fallback to placeholder courses if no admission record
      courses = [
        {
          code: 'CS101',
          name: 'Introduction to Computer Science',
          instructor: 'Dr. Ahmed Khan',
          schedule: 'Mon, Wed 9:00 AM - 10:30 AM',
          room: 'Lab-A',
          credits: 3
        },
        {
          code: 'MATH201',
          name: 'Calculus II',
          instructor: 'Prof. Sara Ali',
          schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
          room: 'Room 204',
          credits: 4
        },
        {
          code: 'ENG102',
          name: 'English Composition',
          instructor: 'Ms. Fatima Noor',
          schedule: 'Fri 2:00 PM - 4:00 PM',
          room: 'Room 105',
          credits: 3
        }
      ];
    }

    // Mock data for portal features
    const portalData = {
      student: student,
      admission: admission || null,
      courses: courses,

      // Academic performance
      academics: {
        currentGPA: '3.75',
        totalCredits: 45,
        attendancePercentage: 92,
        semester: 'Fall 2024'
      },

      // Recent grades
      grades: [
        { course: 'CS101', grade: 'A', credits: 3, semester: 'Fall 2024' },
        { course: 'MATH201', grade: 'A-', credits: 4, semester: 'Fall 2024' },
        { course: 'ENG102', grade: 'B+', credits: 3, semester: 'Fall 2024' }
      ],

      // Announcements
      announcements: [
        {
          id: 1,
          title: 'Mid-Term Examinations Schedule',
          message: 'Mid-term exams will begin from January 15, 2025. Check the portal for your exam timetable.',
          date: '2024-12-10',
          type: 'exam'
        },
        {
          id: 2,
          title: 'Library Extended Hours',
          message: 'The library will remain open until 10 PM during exam week.',
          date: '2024-12-08',
          type: 'facility'
        },
        {
          id: 3,
          title: 'Fee Payment Deadline',
          message: 'Please submit your semester fees by December 31, 2024.',
          date: '2024-12-05',
          type: 'finance'
        }
      ],

      // Fee information
      fees: {
        totalDue: 25000,
        paid: 15000,
        remaining: 10000,
        dueDate: '2024-12-31',
        status: 'Partial'
      },

      // Resources
      resources: {
        libraryAccess: true,
        onlinePortalAccess: true,
        emailAccess: true,
        wifiAccess: true
      }
    };

    res.json({
      success: true,
      data: portalData
    });

  } catch (error) {
    console.error('Student portal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching portal data',
      error: error.message
    });
  }
});

export default router;
