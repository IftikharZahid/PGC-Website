import { useState, useEffect, useRef } from 'react';
import { Save, Download, Trash2, Key, User, Bell, Database, Moon, Sun, Shield, Upload, Users, X, FileText, Palette, Sparkles } from 'lucide-react';
import { exportAllData, clearAllData, initializeDemoData, addItem, STORAGE_KEYS } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';
import { useTheme } from '../../context/ThemeContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const SettingsPage = () => {
    const { showNotification, darkMode, toggleDarkMode } = useAdmin();
    const { heroStyle, setHeroStyle, colorTheme, setColorTheme, colorThemes } = useTheme();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [settings, setSettings] = useState({
        siteName: 'Punjab Group of Colleges',
        resultPortalEnabled: true,
        admissionsOpen: true,
        maintenanceMode: false,
        emailAlerts: false,
        systemNotifications: false
    });
    const [clearDataDialog, setclearDataDialog] = useState(false);
    const fileInputRef = useRef(null);
    const staffFileInputRef = useRef(null);
    const [importStats, setImportStats] = useState(null);
    const [staffImportStats, setStaffImportStats] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showStaffImportModal, setShowStaffImportModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        showNotification('Password changed successfully', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('admin_settings', JSON.stringify(newSettings));
        showNotification('Settings updated', 'success');
    };

    const handleExportData = () => {
        try {
            const data = exportAllData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pgc-admin-backup-${new Date().toISOString()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            showNotification('Data exported successfully', 'success');
            const newSettings = { ...settings, lastBackup: new Date().toISOString() };
            setSettings(newSettings);
            localStorage.setItem('admin_settings', JSON.stringify(newSettings));
        } catch (error) {
            showNotification('Failed to export data', 'error');
        }
    };

    const handleClearData = () => {
        clearAllData();
        showNotification('All data cleared successfully', 'success');
        setclearDataDialog(false);
        setTimeout(() => {
            initializeDemoData();
            window.location.reload();
        }, 1000);
    };

    const handleCSVImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        console.log('📂 Starting CSV import for file:', file.name);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csvText = event.target.result;
                const lines = csvText.split('\n').filter(line => line.trim());
                console.log('📊 CSV lines found:', lines.length);

                if (lines.length < 2) {
                    showNotification('CSV file is empty or has no data rows', 'error');
                    setIsImporting(false);
                    return;
                }

                // Parse header row
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
                console.log('📋 Headers detected:', headers);

                const students = [];

                // Parse data rows
                for (let i = 1; i < lines.length; i++) {
                    try {
                        const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));

                        if (values.length < 2) continue; // Skip empty rows

                        const student = {
                            name: values[headers.indexOf('name')] || values[0] || 'Unknown',
                            rollNumber: values[headers.indexOf('rollnumber')] || values[headers.indexOf('roll')] || values[1] || `STD-${Date.now()}`,
                            class: values[headers.indexOf('class')] || values[headers.indexOf('grade')] || values[2] || 'N/A',
                            section: values[headers.indexOf('section')] || values[3] || 'A',
                            fatherName: values[headers.indexOf('fathername')] || values[headers.indexOf('father')] || values[4] || '',
                            phone: values[headers.indexOf('phone')] || values[headers.indexOf('contact')] || values[5] || '',
                            email: values[headers.indexOf('email')] || values[6] || '',
                            address: values[headers.indexOf('address')] || values[7] || ''
                        };

                        students.push(student);
                    } catch (rowError) {
                        console.error('Row parse error:', rowError);
                    }
                }

                console.log('👥 Students parsed:', students.length, students);

                if (students.length === 0) {
                    showNotification('No valid student data found in CSV', 'error');
                    setIsImporting(false);
                    return;
                }

                // Send to backend API
                console.log('🚀 Sending to API...');
                const response = await fetch('/api/students/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ students })
                });

                console.log('📡 API Response status:', response.status);
                const result = await response.json();
                console.log('📦 API Result:', result);

                if (result.success) {
                    setImportStats({ success: result.data.success, errors: result.data.errors });
                    showNotification(`Imported ${result.data.success} students to database!`, 'success');
                    setShowImportModal(false); // Close modal on success
                } else {
                    showNotification(result.message || 'Import failed', 'error');
                }

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('❌ CSV Import error:', error);
                showNotification('Failed to parse or upload CSV file', 'error');
            } finally {
                setIsImporting(false);
            }
        };
        reader.onerror = (error) => {
            console.error('❌ FileReader error:', error);
            showNotification('Error reading file', 'error');
            setIsImporting(false);
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const templateCSV = `name,rollNumber,class,section,phone,email
Ahmad Ali,PGC-2024-001,FSc Pre-Medical,A,03001234567,ahmad.ali@example.com
Fatima Khan,PGC-2024-002,FSc Pre-Engineering,B,03009876543,fatima.khan@example.com
Usman Ahmed,PGC-2024-003,ICS,A,03331112233,usman.ahmed@example.com
Ayesha Malik,PGC-2024-004,FSc Pre-Medical,C,03214567890,ayesha.malik@example.com
Hassan Raza,PGC-2024-005,Commerce,A,03125551234,hassan.raza@example.com`;

        const blob = new Blob([templateCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students_template.csv';
        link.click();
        URL.revokeObjectURL(url);
        showNotification('Template downloaded!', 'success');
    };

    const handleStaffCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csvText = event.target.result;
                const lines = csvText.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    showNotification('CSV file is empty or has no data rows', 'error');
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));

                let successCount = 0;
                let errorCount = 0;

                for (let i = 1; i < lines.length; i++) {
                    try {
                        const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));

                        if (values.length < 2) continue;

                        const teacher = {
                            name: values[headers.indexOf('name')] || values[0] || 'Unknown',
                            designation: values[headers.indexOf('designation')] || values[headers.indexOf('position')] || values[1] || 'Teacher',
                            department: values[headers.indexOf('department')] || values[headers.indexOf('dept')] || values[2] || 'General',
                            qualification: values[headers.indexOf('qualification')] || values[3] || '',
                            experience: values[headers.indexOf('experience')] || values[4] || '',
                            phone: values[headers.indexOf('phone')] || values[headers.indexOf('contact')] || values[5] || '',
                            email: values[headers.indexOf('email')] || values[6] || '',
                            subjects: (values[headers.indexOf('subjects')] || values[7] || '').split(';').filter(s => s.trim()),
                            status: 'Active',
                            createdAt: new Date().toISOString()
                        };

                        addItem(STORAGE_KEYS.TEACHERS, teacher);
                        successCount++;
                    } catch (rowError) {
                        errorCount++;
                    }
                }

                setStaffImportStats({ success: successCount, errors: errorCount });
                showNotification(`Imported ${successCount} staff members successfully!`, 'success');

                if (staffFileInputRef.current) {
                    staffFileInputRef.current.value = '';
                }
            } catch (error) {
                showNotification('Failed to parse CSV file', 'error');
            }
        };
        reader.readAsText(file);
    };

    const downloadStaffTemplate = () => {
        const templateCSV = `name,designation,department,qualification,experience,phone,email,subjects
Dr. Ahmad Hassan,Professor,Computer Science,PhD Computer Science,15 years,03001234567,ahmad@pgc.edu,Programming;Database;AI
Ms. Fatima Zahra,Lecturer,Mathematics,MSc Mathematics,8 years,03009876543,fatima@pgc.edu,Calculus;Algebra
Mr. Imran Ali,Assistant Professor,Physics,MPhil Physics,10 years,03331112233,imran@pgc.edu,Mechanics;Thermodynamics`;

        const blob = new Blob([templateCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'staff_template.csv';
        link.click();
        URL.revokeObjectURL(url);
        showNotification('Staff template downloaded!', 'success');
    };

    const Toggle = ({ enabled, onChange }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
        >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
        </button>
    );

    return (
        <div className="space-y-3">
            {/* Header */}
            <div
                className="rounded-lg p-4 shadow-lg"
                style={{ background: `linear-gradient(to right, var(--color-primary-main), var(--color-primary-dark))` }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Settings</h1>
                            <p className="text-xs text-primary-100">Manage your account and system preferences</p>
                        </div>
                    </div>
                    <div className="hidden sm:block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                        <span className="text-xs text-primary-100 font-medium">Admin Portal v1.0</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* Left Column */}
                <div className="space-y-3">

                    {/* Account Security */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-primary-600" />
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Account Security</h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handlePasswordChange} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                            required
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            required
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-semibold"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* System Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary-600" />
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">System Preferences</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {[
                                { key: 'darkMode', label: 'Dark Mode', desc: 'Toggle theme', value: darkMode, action: toggleDarkMode, icon: darkMode ? Sun : Moon },
                                { key: 'maintenanceMode', label: 'Maintenance', desc: 'Disable public access', value: settings.maintenanceMode },
                                { key: 'resultPortalEnabled', label: 'Result Portal', desc: 'Enable student results', value: settings.resultPortalEnabled },
                                { key: 'admissionsOpen', label: 'Admissions', desc: 'Accept applications', value: settings.admissionsOpen },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between px-4 py-2.5">
                                    <div className="flex items-center gap-3">
                                        {item.icon && <item.icon className="w-4 h-4 text-gray-400" />}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <Toggle
                                        enabled={item.value}
                                        onChange={item.action || (() => handleSettingChange(item.key, !item.value))}
                                    />
                                </div>
                            ))}

                            {/* Hero Style Toggle */}
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <Palette className="w-4 h-4 text-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Hero Style</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Page header appearance</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setHeroStyle('classic');
                                            showNotification('Hero style set to Classic', 'success');
                                        }}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${heroStyle === 'classic'
                                            ? 'bg-secondary-600 text-white border-secondary-600'
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-secondary-400'
                                            }`}
                                    >
                                        <span className="block">Classic</span>
                                        <span className="block text-[10px] opacity-80 mt-0.5">Solid Teal</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setHeroStyle('modern');
                                            showNotification('Hero style set to Modern', 'success');
                                        }}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${heroStyle === 'modern'
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-400'
                                            }`}
                                    >
                                        <span className="block">Modern</span>
                                        <span className="block text-[10px] opacity-80 mt-0.5">Gradients</span>
                                    </button>
                                </div>
                            </div>

                            {/* Site Color Theme */}
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="w-4 h-4 text-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Site Theme</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Color scheme for entire site</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {colorThemes && Object.entries(colorThemes).map(([key, theme]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setColorTheme(key);
                                                showNotification(`Theme changed to ${theme.name}`, 'success');
                                            }}
                                            className={`relative p-2.5 rounded-lg border-2 transition-all ${colorTheme === key
                                                ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-200 dark:ring-primary-800'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            {/* Color Preview Dots */}
                                            <div className="flex gap-1.5 mb-2">
                                                <div
                                                    className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10"
                                                    style={{ backgroundColor: theme.primary.main }}
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10"
                                                    style={{ backgroundColor: theme.secondary.main }}
                                                />
                                            </div>
                                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 text-left">
                                                {theme.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-left">
                                                {theme.description}
                                            </p>
                                            {colorTheme === key && (
                                                <div className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">

                    {/* Notifications */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-primary-600" />
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <div className="flex items-center justify-between px-4 py-2.5">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Alerts</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">New admission notifications</p>
                                </div>
                                <Toggle
                                    enabled={settings.emailAlerts}
                                    onChange={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                                />
                            </div>
                            <div className="flex items-center justify-between px-4 py-2.5">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Browser Alerts</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Desktop notifications</p>
                                </div>
                                <Toggle
                                    enabled={settings.systemNotifications}
                                    onChange={() => {
                                        if (!settings.systemNotifications && "Notification" in window) {
                                            Notification.requestPermission().then(permission => {
                                                if (permission === 'granted') {
                                                    handleSettingChange('systemNotifications', true);
                                                    new Notification('Notifications Enabled');
                                                }
                                            });
                                        } else {
                                            handleSettingChange('systemNotifications', false);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-primary-600" />
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Data Management</h2>
                            </div>
                        </div>
                        <div className="p-3 space-y-2">
                            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Backup Data</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {settings.lastBackup
                                            ? `Last: ${new Date(settings.lastBackup).toLocaleDateString()}`
                                            : 'No backups yet'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleExportData}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-medium"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export
                                </button>
                            </div>
                            {/* Import Students from CSV */}
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Import Students</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Upload CSV file (name,rollNumber,class,section...)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {importStats && (
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                            {importStats.success} added
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setShowImportModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium cursor-pointer"
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        Import
                                    </button>
                                </div>
                            </div>
                            {/* Import Staff from CSV */}
                            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Import Staff</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Upload CSV file (name,designation,department...)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {staffImportStats && (
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                            {staffImportStats.success} added
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setShowStaffImportModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium cursor-pointer"
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Data Confirmation */}
            <ConfirmDialog
                isOpen={clearDataDialog}
                title="Clear All Data"
                message="Are you sure you want to delete ALL data? This action cannot be undone. Demo data will be reloaded after clearing."
                onConfirm={handleClearData}
                onCancel={() => setclearDataDialog(false)}
                confirmText="Clear All Data"
                type="danger"
            />

            {/* Import Students Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-blue-600 p-3 sm:p-4 flex items-center justify-between sticky top-0">
                            <div className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-white" />
                                <h3 className="text-base sm:text-lg font-bold text-white">Import Students</h3>
                            </div>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="text-white/80 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">How to Import:</h4>
                                <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                                    <li>Download the template file below</li>
                                    <li>Open in Excel or Google Sheets</li>
                                    <li>Fill in student data (keep headers)</li>
                                    <li>Save as CSV file</li>
                                    <li>Upload the CSV file</li>
                                </ol>
                            </div>

                            {/* Expected Format */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV Format:</h4>
                                <code className="text-xs text-gray-600 dark:text-gray-400 block overflow-x-auto">
                                    name, rollNumber, class, section, phone, email
                                </code>
                            </div>

                            {/* Download Template */}
                            <button
                                onClick={downloadTemplate}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Download Template (students_template.csv)</span>
                            </button>

                            {/* Upload Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVImport}
                                    disabled={isImporting}
                                    className="hidden"
                                    id="csv-upload-modal"
                                />
                                <label
                                    htmlFor="csv-upload-modal"
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isImporting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                >
                                    <Upload className={`w-5 h-5 ${isImporting ? 'animate-pulse' : ''}`} />
                                    <span className="font-semibold">{isImporting ? 'Uploading...' : 'Choose CSV File & Upload'}</span>
                                </label>
                            </div>

                            {/* Import Stats */}
                            {importStats && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        ✓ Successfully imported <strong>{importStats.success}</strong> students
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Import Staff Modal */}
            {showStaffImportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-3 sm:p-4 flex items-center justify-between sticky top-0">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-white" />
                                <h3 className="text-base sm:text-lg font-bold text-white">Import Staff/Teachers</h3>
                            </div>
                            <button
                                onClick={() => setShowStaffImportModal(false)}
                                className="text-white/80 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Instructions */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">How to Import:</h4>
                                <ol className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1 list-decimal list-inside">
                                    <li>Download the template file below</li>
                                    <li>Open in Excel or Google Sheets</li>
                                    <li>Fill in staff data (keep headers)</li>
                                    <li>For multiple subjects, separate with semicolon (;)</li>
                                    <li>Save as CSV file and upload</li>
                                </ol>
                            </div>

                            {/* Expected Format */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV Format:</h4>
                                <code className="text-xs text-gray-600 dark:text-gray-400 block overflow-x-auto">
                                    name, designation, department, qualification, experience, phone, email, subjects
                                </code>
                            </div>

                            {/* Download Template */}
                            <button
                                onClick={downloadStaffTemplate}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Download Template (staff_template.csv)</span>
                            </button>

                            {/* Upload Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <input
                                    ref={staffFileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        handleStaffCSVImport(e);
                                        setShowStaffImportModal(false);
                                    }}
                                    className="hidden"
                                    id="staff-csv-upload-modal"
                                />
                                <label
                                    htmlFor="staff-csv-upload-modal"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span className="font-semibold">Choose CSV File & Upload</span>
                                </label>
                            </div>

                            {/* Import Stats */}
                            {staffImportStats && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        ✓ Successfully imported <strong>{staffImportStats.success}</strong> staff members
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
