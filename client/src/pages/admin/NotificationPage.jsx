import { useState, useEffect } from 'react';
import { Save, Bell, Eye, EyeOff, Link as LinkIcon, Type, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/adminStorage';

const NotificationPage = () => {
    const [notification, setNotification] = useState({
        title: 'Admissions Open',
        session: 'Fall 2025 Session',
        description: 'Secure your future at Punjab Group of Colleges. Applications are now open.',
        buttonText: 'Apply Now',
        buttonLink: '/admissions',
        imageUrl: '',
        enabled: true
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // Load notification data from localStorage and merge with defaults
        const savedNotification = localStorage.getItem(STORAGE_KEYS.NOTIFICATION);
        if (savedNotification) {
            const saved = JSON.parse(savedNotification);
            // Merge with defaults to ensure all fields exist
            setNotification(prev => ({
                ...prev,
                ...saved,
                buttonLink: saved.buttonLink || '/admissions',
                imageUrl: saved.imageUrl || ''
            }));
        }
    }, []);

    const handleChange = (field, value) => {
        setNotification(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);

        localStorage.setItem(STORAGE_KEYS.NOTIFICATION, JSON.stringify(notification));

        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 500);
    };

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Notification Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage the popup notification on Home page
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Form Section - 3 cols on large screens */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${notification.enabled
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    {notification.enabled ? (
                                        <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                        Notification Status
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        {notification.enabled ? 'Visible on Home page' : 'Hidden from visitors'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleChange('enabled', !notification.enabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${notification.enabled
                                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${notification.enabled ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                Content
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Title */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                    <Type className="w-3 h-3" /> Title
                                </label>
                                <input
                                    type="text"
                                    value={notification.title || ''}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                                    placeholder="Admissions Open"
                                />
                            </div>

                            {/* Session */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                    Badge Text
                                </label>
                                <input
                                    type="text"
                                    value={notification.session || ''}
                                    onChange={(e) => handleChange('session', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                                    placeholder="Fall 2025 Session"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                <FileText className="w-3 h-3" /> Description
                            </label>
                            <textarea
                                value={notification.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all resize-none"
                                placeholder="Enter notification description..."
                            />
                        </div>
                    </div>

                    {/* Advertisement Image Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="w-4 h-4 text-primary-500" />
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                Advertisement Image
                            </h2>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                                Image URL
                            </label>
                            <input
                                type="text"
                                value={notification.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                                placeholder="https://example.com/ad-image.jpg or /src/assets/image.png"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Enter the URL of your advertisement image (leave empty to show logo)
                            </p>
                        </div>

                        {/* Image Preview */}
                        {notification.imageUrl && (
                            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                                <img
                                    src={notification.imageUrl}
                                    alt="Ad Preview"
                                    className="max-h-32 rounded-lg mx-auto object-contain"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <LinkIcon className="w-4 h-4 text-primary-500" />
                            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                Button Settings
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={notification.buttonText || ''}
                                    onChange={(e) => handleChange('buttonText', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                                    placeholder="Apply Now"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                                    Button Link
                                </label>
                                <input
                                    type="text"
                                    value={notification.buttonLink || ''}
                                    onChange={(e) => handleChange('buttonLink', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                                    placeholder="/admissions"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${saveSuccess
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                            }`}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Save Changes'}
                    </button>
                </div>

                {/* Preview Section - 2 cols on large screens */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 lg:sticky lg:top-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-4">
                            Live Preview
                        </h2>

                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 flex items-center justify-center min-h-[320px]">
                            {notification.enabled ? (
                                <div className="w-full max-w-xs bg-white dark:bg-gray-700 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-600 transform scale-90 sm:scale-100">
                                    <div className="flex flex-col items-center text-center p-5">
                                        {/* Logo - White background with red circle */}
                                        <div className="w-14 h-14 mb-3 relative">
                                            <div className="absolute inset-0 bg-white rounded-full ring-2 ring-red-500"></div>
                                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative z-10">
                                                <Bell className="w-7 h-7 text-red-500" />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-1">
                                            {notification.title || 'Title'}
                                        </h3>
                                        <div className="inline-block bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 tracking-wide uppercase">
                                            {notification.session || 'Session'}
                                        </div>
                                        {notification.description && (
                                            <p className="text-gray-500 dark:text-gray-300 text-xs mb-3 leading-relaxed">
                                                {notification.description}
                                            </p>
                                        )}

                                        {/* Ad Image Preview */}
                                        {notification.imageUrl && (
                                            <div className="w-full mb-3 rounded-lg overflow-hidden">
                                                <img
                                                    src={notification.imageUrl}
                                                    alt="Ad Preview"
                                                    className="w-full h-auto max-h-24 object-cover rounded-lg"
                                                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}

                                        <button className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium text-xs py-2 px-4 rounded-lg">
                                            {notification.buttonText || 'Button'}
                                        </button>
                                    </div>
                                    <div className="h-1 w-full bg-primary-700"></div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 dark:text-gray-500">
                                    <EyeOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="font-medium text-sm">Notification Disabled</p>
                                    <p className="text-xs">Enable to see preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
