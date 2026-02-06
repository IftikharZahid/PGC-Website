import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// GET /api/settings - Fetch all settings (public for maintenance check)
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getAllSettings();

        // Provide defaults for common settings
        const defaults = {
            maintenanceMode: false,
            resultPortalEnabled: true,
            admissionsOpen: true,
            siteName: 'Punjab Group of Colleges'
        };

        res.json({
            success: true,
            data: { ...defaults, ...settings }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        });
    }
});

// GET /api/settings/:key - Fetch a specific setting
router.get('/:key', async (req, res) => {
    try {
        const value = await Settings.getSetting(req.params.key);
        res.json({
            success: true,
            data: { key: req.params.key, value }
        });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch setting',
            error: error.message
        });
    }
});

// PUT /api/settings - Update multiple settings (admin only)
router.put('/', async (req, res) => {
    try {
        const { settings } = req.body;

        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Settings object is required'
            });
        }

        // Update each setting
        const updates = Object.entries(settings).map(([key, value]) =>
            Settings.setSetting(key, value)
        );

        await Promise.all(updates);

        // Fetch updated settings
        const updatedSettings = await Settings.getAllSettings();

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: updatedSettings
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
});

// PUT /api/settings/:key - Update a specific setting (admin only)
router.put('/:key', async (req, res) => {
    try {
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Value is required'
            });
        }

        const result = await Settings.setSetting(req.params.key, value);

        res.json({
            success: true,
            message: `Setting '${req.params.key}' updated successfully`,
            data: { key: req.params.key, value: result.value }
        });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting',
            error: error.message
        });
    }
});

// POST /api/settings/admin/login - Verify admin credentials
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Get stored admin credentials from Settings
        const storedEmail = await Settings.getSetting('adminEmail', 'IftikharZahid@outlook.com');
        const storedPassword = await Settings.getSetting('adminPassword', 'Zikki786');

        // Compare credentials
        if (email !== storedEmail || password !== storedPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                email: storedEmail,
                name: 'College Administrator',
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// PUT /api/settings/admin/change-password - Change admin password
router.put('/admin/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All password fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Get current stored password
        const storedPassword = await Settings.getSetting('adminPassword', 'Zikki786');

        // Verify current password
        if (currentPassword !== storedPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password in Settings
        await Settings.setSetting('adminPassword', newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

export default router;
