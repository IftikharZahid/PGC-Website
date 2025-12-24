import express from 'express';

const router = express.Router();

// Dummy course data
const courses = [
  {
    id: 1,
    title: "Computer Science & Engineering",
    description: "Comprehensive program covering software development, algorithms, data structures, and modern computing technologies.",
    duration: "4 Years",
    instructor: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    title: "Business Administration",
    description: "Learn core business principles, management strategies, marketing, finance, and entrepreneurship skills.",
    duration: "3 Years",
    instructor: "Prof. Michael Chen"
  },
  {
    id: 3,
    title: "Mechanical Engineering",
    description: "Study design, analysis, and manufacturing of mechanical systems with hands-on laboratory experience.",
    duration: "4 Years",
    instructor: "Dr. Robert Williams"
  },
  {
    id: 4,
    title: "English Literature",
    description: "Explore classical and contemporary literature, creative writing, and critical analysis of literary works.",
    duration: "3 Years",
    instructor: "Prof. Emily Thompson"
  },
  {
    id: 5,
    title: "Data Science & Analytics",
    description: "Master data analysis, machine learning, statistical modeling, and big data technologies.",
    duration: "2 Years",
    instructor: "Dr. David Martinez"
  },
  {
    id: 6,
    title: "Psychology",
    description: "Understand human behavior, mental processes, counseling techniques, and research methodologies.",
    duration: "4 Years",
    instructor: "Dr. Lisa Anderson"
  }
];

// GET /api/courses - Get all courses
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/courses/:id - Get single course by ID
router.get('/:id', (req, res) => {
  try {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: course
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
