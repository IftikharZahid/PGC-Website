import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AnnouncementForm = ({ announcement, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        type: 'general',
        link: '/news'
    });

    useEffect(() => {
        if (announcement) {
            setFormData(announcement);
        }
    }, [announcement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    };

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            setFormData(prev => ({ ...prev, date: formatted }));
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                        {announcement ? 'Edit Announcement' : 'Add New Announcement'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-4 sm:p-6 space-y-4 flex-1">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                    required
                                >
                                    <option value="general">General</option>
                                    <option value="exam">Exam</option>
                                    <option value="event">Event</option>
                                    <option value="facility">Facility</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formatDateForInput(formData.date)}
                                    onChange={handleDateChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content || ''}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm resize-none"
                                    placeholder="Enter full announcement details..."
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link *
                                </label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                    placeholder="/news"
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions - Fixed Footer */}
                        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm text-sm"
                            >
                                {announcement ? 'Update' : 'Add'} Announcement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementForm;
