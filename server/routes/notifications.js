import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/notifications - Get current notification (public)
router.get('/', async (req, res) => {
    try {
        // Find the single notification document, or return default values
        let notification = await Notification.findOne();

        if (!notification) {
            // Return default values if no notification exists yet
            return res.json({
                success: true,
                data: {
                    title: 'Admissions Open',
                    session: 'Fall 2026 Session',
                    description: 'Secure your future at Punjab Group of Colleges. Applications are now open.',
                    buttonText: 'Apply Now',
                    buttonLink: '/admissions',
                    imageUrl: '',
                    enabled: true
                }
            });
        }

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notification',
            error: error.message
        });
    }
});

// PUT /api/notifications - Update/create notification (admin)
router.put('/', async (req, res) => {
    try {
        const { title, session, description, buttonText, buttonLink, imageUrl, enabled } = req.body;

        // Find and update, or create if doesn't exist (upsert)
        const notification = await Notification.findOneAndUpdate(
            {}, // Match any document (we only have one)
            {
                title: title || 'Admissions Open',
                session: session || '',
                description: description || '',
                buttonText: buttonText || 'Apply Now',
                buttonLink: buttonLink || '/admissions',
                imageUrl: imageUrl || '',
                enabled: enabled !== undefined ? enabled : true,
                updatedAt: Date.now()
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create if doesn't exist
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Notification updated successfully',
            data: notification
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification',
            error: error.message
        });
    }
});

export default router;
