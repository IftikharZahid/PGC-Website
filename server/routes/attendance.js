import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const router = express.Router();

// GET /api/attendance - Get attendance records with filters
router.get('/', async (req, res) => {
    try {
        const { date, class: className } = req.query;

        let query = {};

        if (date) {
            // Match the entire day
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        if (className) {
            query.class = { $regex: className, $options: 'i' };
        }

        const records = await Attendance.find(query)
            .sort({ class: 1, studentName: 1 })
            .lean();

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching attendance',
            error: error.message
        });
    }
});

// GET /api/attendance/classes - Get unique class list
router.get('/classes', async (req, res) => {
    try {
        const classes = await Student.distinct('class');
        // Filter out empty/null values
        const validClasses = classes.filter(c => c && c.trim());
        res.json({
            success: true,
            data: validClasses.sort()
        });
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching classes',
            error: error.message
        });
    }
});

// GET /api/attendance/students - Get students for marking attendance
router.get('/students', async (req, res) => {
    try {
        const { class: className, rollNo } = req.query;

        let query = {};

        if (className) {
            query.class = { $regex: className, $options: 'i' };
        }

        if (rollNo) {
            query.$or = [
                { rollNo: { $regex: rollNo, $options: 'i' } },
                { studentId: { $regex: rollNo, $options: 'i' } }
            ];
        }

        const students = await Student.find(query)
            .select('_id name email rollNo studentId class status')
            .sort({ rollNo: 1, name: 1 })
            .lean();

        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Get students for attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching students',
            error: error.message
        });
    }
});

// POST /api/attendance - Mark attendance for multiple students
router.post('/', async (req, res) => {
    try {
        const { date, records } = req.body;

        if (!date || !records || !Array.isArray(records)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide date and attendance records'
            });
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(12, 0, 0, 0); // Normalize to noon

        let successCount = 0;
        let updateCount = 0;

        for (const record of records) {
            try {
                // Use upsert to create or update
                const result = await Attendance.findOneAndUpdate(
                    { student: record.studentId, date: attendanceDate },
                    {
                        student: record.studentId,
                        studentName: record.studentName,
                        rollNo: record.rollNo || '',
                        class: record.class,
                        date: attendanceDate,
                        status: record.status,
                        markedBy: 'admin'
                    },
                    { upsert: true, new: true }
                );

                if (result) {
                    successCount++;
                }
            } catch (err) {
                console.error('Error saving attendance for', record.studentName, err.message);
            }
        }

        res.json({
            success: true,
            message: `Attendance saved for ${successCount} students`,
            data: { saved: successCount }
        });

    } catch (error) {
        console.error('Save attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error saving attendance',
            error: error.message
        });
    }
});

// GET /api/attendance/stats - Get attendance statistics
router.get('/stats', async (req, res) => {
    try {
        const { class: className, startDate, endDate } = req.query;

        let matchQuery = {};

        if (className) {
            matchQuery.class = { $regex: className, $options: 'i' };
        }

        if (startDate && endDate) {
            matchQuery.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalRecords = await Attendance.countDocuments(matchQuery);

        res.json({
            success: true,
            data: {
                total: totalRecords,
                byStatus: stats
            }
        });

    } catch (error) {
        console.error('Get attendance stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching statistics',
            error: error.message
        });
    }
});

export default router;
