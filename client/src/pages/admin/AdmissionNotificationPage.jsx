import { useState, useEffect } from 'react';
import { Save, ClipboardList, Eye, EyeOff, Plus, Trash2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useGetAdmissionNotificationQuery, useUpdateAdmissionNotificationMutation } from '../../store/api/admissionNotificationApi';
import logo from '../../assets/punjab-college-logo.png';

const AdmissionNotificationPage = () => {
    const { data: notificationData, isLoading: isFetching } = useGetAdmissionNotificationQuery();
    const [updateNotification, { isLoading: isSaving }] = useUpdateAdmissionNotificationMutation();

    const [notification, setNotification] = useState({
        session: '',
        requirements: [],
        importantNote: '',
        buttonText: '',
        enabled: true
    });
    const [newRequirement, setNewRequirement] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Sync state with fetched data
    useEffect(() => {
        if (notificationData?.success && notificationData?.data) {
            setNotification({
                session: notificationData.data.session || '',
                requirements: notificationData.data.requirements || [],
                importantNote: notificationData.data.importantNote || '',
                buttonText: notificationData.data.buttonText || '',
                enabled: notificationData.data.enabled !== undefined ? notificationData.data.enabled : true
            });
        }
    }, [notificationData]);

    const handleChange = (field, value) => {
        setNotification(prev => ({ ...prev, [field]: value }));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setNotification(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };

    const removeRequirement = (index) => {
        setNotification(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setSaveSuccess(false);
        setError(null);

        try {
            await updateNotification(notification).unwrap();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving admission notification:', err);
            setError(err.data?.message || 'Failed to save admission notification');
        }
    };

    if (isFetching) {
        return (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading admission notification settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg shadow-md">
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admission Notification</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage admission page requirements popup</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-2">Status:</span>
                    <button
                        onClick={() => handleChange('enabled', !notification.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${notification.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notification.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
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
                {/* Left Column: Form Controls */}
                <div className="lg:col-span-7 space-y-5">

                    {/* Session & Button Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Basic Settings</h3>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Badge</label>
                                    <input
                                        type="text"
                                        value={notification.session || ''}
                                        onChange={(e) => handleChange('session', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="e.g. Session 2025-2027"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Button Text</label>
                                    <input
                                        type="text"
                                        value={notification.buttonText || ''}
                                        onChange={(e) => handleChange('buttonText', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="e.g. Continue to Application"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Important Note</label>
                                <textarea
                                    value={notification.importantNote || ''}
                                    onChange={(e) => handleChange('importantNote', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                                    placeholder="e.g. Please bring original documents..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-green-500" />
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Requirements List</h3>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                {notification.requirements?.length || 0} items
                            </span>
                        </div>

                        <div className="p-4 space-y-3">
                            {/* Add New Requirement */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Add a requirement..."
                                />
                                <button
                                    onClick={addRequirement}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Requirements List */}
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {notification.requirements?.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 group">
                                        <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{req}</span>
                                        <button
                                            onClick={() => removeRequirement(index)}
                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md transform active:scale-[0.98] ${saveSuccess
                            ? 'bg-green-600 text-white shadow-green-500/30'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'
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

                {/* Right Column: Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                                <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-green-500" /> Live Preview
                                </h2>
                                <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Actual size</span>
                            </div>

                            {notification.enabled ? (
                                <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[350px] backdrop-blur-sm">
                                    {/* Mock Modal */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-[280px] animate-in fade-in zoom-in duration-200">
                                        <div className="p-4 flex flex-col items-center text-center">
                                            {/* Logo */}
                                            <div className="w-12 h-12 mb-2 relative">
                                                <div className="absolute inset-0 bg-white rounded-full ring-2 ring-primary-500 shadow-lg"></div>
                                                <img src={logo} alt="Logo" className="w-full h-full object-contain relative z-10" />
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                                Admission Requirements
                                            </h3>
                                            {notification.session && (
                                                <span className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3">
                                                    {notification.session}
                                                </span>
                                            )}

                                            {/* Requirements */}
                                            <div className="w-full text-left space-y-1.5 mb-3">
                                                {notification.requirements?.slice(0, 5).map((req, index) => (
                                                    <div key={index} className="flex items-center gap-1.5 p-1.5 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                                                        <span className="w-3 h-3 rounded-full bg-green-500 text-white text-[8px] flex items-center justify-center">✓</span>
                                                        <span className="text-[10px] text-gray-700 dark:text-gray-300 truncate">{req}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Important Note */}
                                            {notification.importantNote && (
                                                <div className="w-full p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 mb-3">
                                                    <div className="flex items-start gap-1.5">
                                                        <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                                                        <p className="text-[9px] text-amber-800 dark:text-amber-300 text-left line-clamp-2">
                                                            {notification.importantNote}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium text-[10px] py-2 px-3 rounded-lg shadow-sm">
                                                {notification.buttonText || 'Continue'}
                                            </button>
                                        </div>
                                        <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[250px] bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                                    <EyeOff className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-500">Notification is disabled</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg p-3">
                            <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                                <strong>Note:</strong> This notification appears on the Admissions page when students first visit. Changes are saved to the database.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionNotificationPage;
