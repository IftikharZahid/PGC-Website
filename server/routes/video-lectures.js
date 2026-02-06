import express from 'express';
import VideoLecture from '../models/VideoLecture.js';

const router = express.Router();

// GET /api/video-lectures - Get all video lectures/courses
router.get('/', async (req, res) => {
    try {
        const lectures = await VideoLecture.find({ status: 'Active' }).sort({ order: 1, createdAt: 1 });
        res.json({
            success: true,
            count: lectures.length,
            data: lectures
        });
    } catch (error) {
        console.error('Get video lectures error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching video lectures',
            error: error.message
        });
    }
});

// GET /api/video-lectures/all - Get all video lectures including inactive (for admin)
router.get('/all', async (req, res) => {
    try {
        const lectures = await VideoLecture.find({}).sort({ order: 1, createdAt: 1 });
        res.json({
            success: true,
            count: lectures.length,
            data: lectures
        });
    } catch (error) {
        console.error('Get all video lectures error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching video lectures',
            error: error.message
        });
    }
});

// POST /api/video-lectures - Create new course/week
router.post('/', async (req, res) => {
    console.log('📥 POST /api/video-lectures received');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

    try {
        const { courseId, title, lessons, order, status } = req.body;

        // Validation
        if (!courseId || !title) {
            console.log('⚠️ Validation failed: missing courseId or title');
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId and title'
            });
        }

        console.log('🔍 Checking if courseId exists:', courseId);

        // Check if courseId already exists
        const existing = await VideoLecture.findOne({ courseId });
        if (existing) {
            console.log('⚠️ Course ID already exists');
            return res.status(409).json({
                success: false,
                message: 'Course ID already exists'
            });
        }

        console.log('✅ Creating new course...');

        const newLecture = await VideoLecture.create({
            courseId,
            title,
            lessons: lessons || [],
            order: order || 0,
            status: status || 'Active'
        });

        console.log('✅ Course created successfully:', newLecture._id);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: newLecture
        });

    } catch (error) {
        console.error('❌ Create video lecture error:', error.message);
        console.error('❌ Full error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating course',
            error: error.message
        });
    }
});

// PUT /api/video-lectures/:courseId - Update course
router.put('/:courseId', async (req, res) => {
    try {
        const { title, lessons, order, status } = req.body;

        let lecture = await VideoLecture.findOne({ courseId: req.params.courseId });

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Update fields
        if (title !== undefined) lecture.title = title;
        if (lessons !== undefined) lecture.lessons = lessons;
        if (order !== undefined) lecture.order = order;
        if (status !== undefined) lecture.status = status;

        await lecture.save();

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: lecture
        });

    } catch (error) {
        console.error('Update video lecture error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating course',
            error: error.message
        });
    }
});

// DELETE /api/video-lectures/:courseId - Delete course
router.delete('/:courseId', async (req, res) => {
    try {
        const lecture = await VideoLecture.findOne({ courseId: req.params.courseId });

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await lecture.deleteOne();

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete video lecture error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting course',
            error: error.message
        });
    }
});

// PUT /api/video-lectures/:courseId/lessons - Update lessons for a course
router.put('/:courseId/lessons', async (req, res) => {
    try {
        const { lessons } = req.body;

        const lecture = await VideoLecture.findOne({ courseId: req.params.courseId });

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        lecture.lessons = lessons;
        await lecture.save();

        res.json({
            success: true,
            message: 'Lessons updated successfully',
            data: lecture
        });

    } catch (error) {
        console.error('Update lessons error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating lessons',
            error: error.message
        });
    }
});

export default router;
