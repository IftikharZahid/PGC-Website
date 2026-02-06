import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ courseName: 1 });
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching courses',
      error: error.message
    });
  }
});

// GET /api/courses/:id - Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

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

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
  try {
    const { courseId, courseName, duration, semesters, subjects } = req.body;

    // Check for existing course ID
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course ID already exists'
      });
    }

    const newCourse = await Course.create({
      courseId,
      courseName,
      duration,
      semesters,
      subjects
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating course',
      error: error.message
    });
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', async (req, res) => {
  try {
    const { courseId, courseName, duration, semesters, subjects } = req.body;

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update fields
    course.courseId = courseId || course.courseId;
    course.courseName = courseName || course.courseName;
    course.duration = duration || course.duration;
    course.semesters = semesters || course.semesters;
    course.subjects = subjects || course.subjects;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating course',
      error: error.message
    });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting course',
      error: error.message
    });
  }
});

export default router;
