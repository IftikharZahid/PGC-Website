import express from 'express';
import AdmissionNotification from '../models/AdmissionNotification.js';

const router = express.Router();

// GET /api/admission-notification - Get current admission notification (public)
router.get('/', async (req, res) => {
    try {
        let notification = await AdmissionNotification.findOne();

        if (!notification) {
            return res.json({
                success: true,
                data: {
                    session: 'Session 2025-2027',
                    requirements: [
                        'Matriculation / O-Level Result Card',
                        'Character Certificate',
                        'CNIC / B-Form of Student',
                        'CNIC of Father/Guardian',
                        'Recent Photographs (Passport size)'
                    ],
                    importantNote: 'Please bring original documents along with photocopies to the admission office.',
                    buttonText: 'Continue to Application',
                    enabled: true
                }
            });
        }

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error fetching admission notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch admission notification',
            error: error.message
        });
    }
});

// PUT /api/admission-notification - Update/create admission notification (admin)
router.put('/', async (req, res) => {
    try {
        const { session, requirements, importantNote, buttonText, enabled } = req.body;

        const notification = await AdmissionNotification.findOneAndUpdate(
            {},
            {
                session: session || 'Session 2025-2027',
                requirements: requirements || [],
                importantNote: importantNote || '',
                buttonText: buttonText || 'Continue to Application',
                enabled: enabled !== undefined ? enabled : true,
                updatedAt: Date.now()
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Admission notification updated successfully',
            data: notification
        });
    } catch (error) {
        console.error('Error updating admission notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update admission notification',
            error: error.message
        });
    }
});

export default router;
