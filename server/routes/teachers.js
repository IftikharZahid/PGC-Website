import express from 'express';
import Teacher from '../models/Teacher.js';

const router = express.Router();

// GET /api/teachers - Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching teachers',
            error: error.message
        });
    }
});

// POST /api/teachers - Create new teacher
router.post('/', async (req, res) => {
    try {
        const { name, email, password, phone, designation, department, qualification, experience, subjects, image, status } = req.body;

        // Validation
        if (!name || !email || !designation || !department || !qualification) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
        if (existingTeacher) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const newTeacher = await Teacher.create({
            name,
            email: email.toLowerCase(),
            password, // Will be hashed by pre-save hook if provided
            phone,
            designation,
            department,
            qualification,
            experience,
            subjects,
            image,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Teacher added successfully',
            data: newTeacher
        });

    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating teacher',
            error: error.message
        });
    }
}
);

// POST /api/teachers/bulk - Bulk create teachers
router.post('/bulk', async (req, res) => {
    try {
        const { teachers } = req.body;

        if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No teachers data provided'
            });
        }

        const results = {
            success: 0,
            errors: 0,
            details: []
        };

        for (const teacherData of teachers) {
            try {
                // Check for existing email
                const existingTeacher = await Teacher.findOne({ email: teacherData.email.toLowerCase() });
                if (existingTeacher) {
                    results.errors++;
                    results.details.push({ email: teacherData.email, error: 'Email already exists' });
                    continue;
                }

                await Teacher.create({
                    ...teacherData,
                    email: teacherData.email.toLowerCase(),
                    status: teacherData.status || 'Active'
                    // Password will be handled by schema default or empty check
                });
                results.success++;
            } catch (err) {
                results.errors++;
                results.details.push({ email: teacherData.email, error: err.message });
            }
        }

        res.json({
            success: true,
            message: `Processed ${teachers.length} teachers`,
            data: results
        });

    } catch (error) {
        console.error('Bulk create teachers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing bulk import',
            error: error.message
        });
    }
});

// PUT /api/teachers/:id - Update teacher
router.put('/:id', async (req, res) => {
    try {
        const { name, email, password, phone, designation, department, qualification, experience, subjects, image, status } = req.body;

        let teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Update fields
        teacher.name = name || teacher.name;
        teacher.email = email || teacher.email;
        teacher.phone = phone || teacher.phone;
        teacher.designation = designation || teacher.designation;
        teacher.department = department || teacher.department;
        teacher.qualification = qualification || teacher.qualification;
        teacher.experience = experience || teacher.experience;
        teacher.subjects = subjects || teacher.subjects;
        teacher.image = image || teacher.image;
        teacher.status = status || teacher.status;

        // Only update password if a new one is provided
        if (password && password.length >= 6) {
            teacher.password = password; // Will be hashed by pre-save hook
        }

        await teacher.save();

        res.json({
            success: true,
            message: 'Teacher updated successfully',
            data: teacher
        });

    } catch (error) {
        console.error('Update teacher error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        res.status(500).json({
            success: false,
            message: 'Server error updating teacher',
            error: error.message
        });
    }
});

// DELETE /api/teachers/:id - Delete teacher
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        await teacher.deleteOne();

        res.json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting teacher',
            error: error.message
        });
    }
});

// PUT /api/teachers/:id/set-password - Set or update teacher password (admin only)
router.put('/:id/set-password', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        teacher.password = password;
        await teacher.save(); // Will hash via pre-save hook

        res.json({
            success: true,
            message: 'Password set successfully'
        });

    } catch (error) {
        console.error('Set password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error setting password',
            error: error.message
        });
    }
});

export default router;
