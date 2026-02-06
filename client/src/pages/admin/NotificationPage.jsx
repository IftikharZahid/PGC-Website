import { useState, useEffect } from 'react';
import { Save, Bell, Eye, EyeOff, Link as LinkIcon, Type, FileText, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useGetNotificationQuery, useUpdateNotificationMutation } from '../../store/api/notificationsApi';

const NotificationPage = () => {
    const { data: notificationData, isLoading: isFetching } = useGetNotificationQuery();
    const [updateNotification, { isLoading: isSaving }] = useUpdateNotificationMutation();

    const [notification, setNotification] = useState({
        title: '',
        session: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        imageUrl: '',
        enabled: true
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Sync state with fetching data
    useEffect(() => {
        if (notificationData?.success && notificationData?.data) {
            setNotification({
                title: notificationData.data.title || '',
                session: notificationData.data.session || '',
                description: notificationData.data.description || '',
                buttonText: notificationData.data.buttonText || '',
                buttonLink: notificationData.data.buttonLink || '',
                imageUrl: notificationData.data.imageUrl || '',
                enabled: notificationData.data.enabled !== undefined ? notificationData.data.enabled : true
            });
        }
    }, [notificationData]);

    const handleChange = (field, value) => {
        setNotification(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaveSuccess(false);
        setError(null);

        try {
            await updateNotification(notification).unwrap();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving notification:', err);
            setError(err.data?.message || 'Failed to save notification');
        }
    };

    // Initial loading or error
    if (isFetching) {
        return (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading notification settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 rounded-lg shadow-md">
                        <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Notification</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage homepage popup announcement</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-2">Status:</span>
                    <button
                        onClick={() => handleChange('enabled', !notification.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${notification.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notification.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </button>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${notification.enabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                        {notification.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Column: Form Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-5">

                    {/* Main Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notification Content</h3>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={notification.title || ''}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                            placeholder="e.g. Admissions Open"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Badge / Session</label>
                                    <input
                                        type="text"
                                        value={notification.session || ''}
                                        onChange={(e) => handleChange('session', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Fall 2025"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                <textarea
                                    value={notification.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none placeholder:text-gray-400"
                                    placeholder="Enter the main message for the notification..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action & Media Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-primary-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Action & Image</h3>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Button Text</label>
                                    <input
                                        type="text"
                                        value={notification.buttonText || ''}
                                        onChange={(e) => handleChange('buttonText', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="e.g. Apply Now"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Button Link</label>
                                    <input
                                        type="text"
                                        value={notification.buttonLink || ''}
                                        onChange={(e) => handleChange('buttonLink', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="e.g. /admissions"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Advertisement Image URL</span>
                                    <span className="text-gray-400 font-normal">Optional</span>
                                </label>
                                <input
                                    type="text"
                                    value={notification.imageUrl || ''}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono text-xs"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md transform active:scale-[0.98] ${saveSuccess
                            ? 'bg-green-600 text-white shadow-green-500/30'
                            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving Changes...' : saveSuccess ? 'Changes Saved!' : 'Save Notification'}
                    </button>
                </div>

                {/* Right Column: Preview (5 cols) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                                <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-primary-500" /> Live Preview
                                </h2>
                                <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Actual size</span>
                            </div>

                            {notification.enabled ? (
                                <div className="bg-gray-900/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] backdrop-blur-sm">
                                    {/* Mock Modal */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-[280px] animate-in fade-in zoom-in duration-200">
                                        <div className="p-5 flex flex-col items-center text-center">
                                            {/* Preview Logo */}
                                            <div className="w-12 h-12 mb-3 relative shrink-0">
                                                <div className="absolute inset-0 bg-white rounded-full ring-2 ring-red-500"></div>
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative z-10">
                                                    <Bell className="w-6 h-6 text-red-500" />
                                                </div>
                                            </div>

                                            <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                                                {notification.title || 'Notification Title'}
                                            </h3>

                                            {notification.session && (
                                                <div className="inline-block bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 tracking-wide uppercase">
                                                    {notification.session}
                                                </div>
                                            )}

                                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 leading-relaxed line-clamp-4">
                                                {notification.description || 'This is how your notification description will appear.'}
                                            </p>

                                            {notification.imageUrl && (
                                                <div className="w-full mb-3 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={notification.imageUrl}
                                                        alt="Preview"
                                                        className="w-full h-24 object-cover"
                                                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}

                                            <button className="w-full bg-primary-700 text-white font-medium text-xs py-2 px-4 rounded-lg shadow-sm">
                                                {notification.buttonText || 'Button'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[250px] bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                                    <EyeOff className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-500">Notification is disabled</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                <strong>Synced:</strong> Changes are saved to the database and will appear on all devices immediately after refresh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
