import React, { useState, useEffect } from 'react';
import { getItems, updateItem, STORAGE_KEYS, initializeDemoData } from '../../utils/adminStorage';
import { Save, RefreshCw, Image as ImageIcon, Users } from 'lucide-react';

const AdminGalleryPage = ({ section = 'Home' }) => {
    const [images, setImages] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    // activeTab is now derived from props
    const activeTab = section;
    const isFacultySection = activeTab === 'Faculty';

    useEffect(() => {
        // Ensure data is initialized
        initializeDemoData();
        loadData();
    }, [activeTab]);

    const loadData = () => {
        if (isFacultySection) {
            // For Faculty section, load teachers instead of gallery images
            const teacherItems = getItems(STORAGE_KEYS.TEACHERS);
            setTeachers(teacherItems);
        } else {
            const galleryItems = getItems(STORAGE_KEYS.GALLERY);
            // Sort by section for better organization
            const sorted = galleryItems.sort((a, b) => a.section.localeCompare(b.section));
            setImages(sorted);
        }
        setLoading(false);
    };

    const handleUrlChange = (id, newUrl) => {
        if (isFacultySection) {
            setTeachers(teachers.map(t =>
                t.id === id ? { ...t, image: newUrl } : t
            ));
        } else {
            setImages(images.map(img =>
                img.id === id ? { ...img, url: newUrl } : img
            ));
        }
    };

    const handleSave = (id) => {
        if (isFacultySection) {
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                updateItem(STORAGE_KEYS.TEACHERS, id, { image: teacher.image });
                showSuccess(`Updated ${teacher.name}'s photo`);
            }
        } else {
            const image = images.find(img => img.id === id);
            if (image) {
                updateItem(STORAGE_KEYS.GALLERY, id, { url: image.url });
                showSuccess(`Updated ${image.title}`);
            }
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const getSectionColor = (section) => {
        switch (section) {
            case 'Hero': return 'bg-blue-100 text-blue-800';
            case 'Intro': return 'bg-purple-100 text-purple-800';
            case 'News': return 'bg-green-100 text-green-800';
            case 'Faculty': return 'bg-emerald-100 text-emerald-800';
            case 'Seminars': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    };

    // Render Faculty/Teachers view
    if (isFacultySection) {
        return (
            <div className="space-y-2">
                {/* Header */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-600" />
                            Faculty Gallery
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Manage faculty photos • {teachers.length} teachers
                        </p>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                        title="Refresh List"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {/* Success Message */}
                {successMsg && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-3 text-sm text-green-700">{successMsg}</p>
                        </div>
                    </div>
                )}

                {/* Teachers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Preview Area */}
                            <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700 relative group overflow-hidden border-b border-gray-100 dark:border-gray-700">
                                {teacher.image ? (
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Photo';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon size={40} />
                                        <span className="text-sm mt-2">No Photo</span>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(teacher.status)}`}>
                                        {teacher.status}
                                    </span>
                                </div>

                                {/* Department Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                                        {teacher.department}
                                    </span>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-3 space-y-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{teacher.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.designation}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Photo URL</label>
                                    <input
                                        type="text"
                                        value={teacher.image || ''}
                                        onChange={(e) => handleUrlChange(teacher.id, e.target.value)}
                                        placeholder="Enter image URL..."
                                        className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <button
                                    onClick={() => handleSave(teacher.id)}
                                    className="w-full flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98]"
                                >
                                    <Save size={14} />
                                    Save Photo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render regular Gallery view (non-Faculty sections)
    return (
        <div className="space-y-2">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeTab} Gallery</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage gallery images for {activeTab.toLowerCase()} section</p>
                </div>
                <button
                    onClick={loadData}
                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                    title="Refresh List"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Success Message */}
            {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md shadow-sm animate-fade-in">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="ml-3 text-sm text-green-700">{successMsg}</p>
                    </div>
                </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {images.filter(img => img.section === activeTab).map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Preview Area */}
                        <div className="aspect-video w-full bg-gray-100 relative group overflow-hidden border-b border-gray-100">
                            {item.url ? (
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={32} />
                                    <span className="text-sm mt-2">No Image Set</span>
                                </div>
                            )}

                            {/* Section Badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getSectionColor(item.section)}`}>
                                    {item.section}
                                </span>
                            </div>
                        </div>

                        {/* Edit Area */}
                        <div className="p-3 space-y-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{item.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {item.id}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image Import Path / URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item.url}
                                        onChange={(e) => handleUrlChange(item.id, e.target.value)}
                                        placeholder="/src/assets/..."
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    Use a public web URL (https://...) or a local path (/src/assets/...)
                                </p>
                            </div>

                            <button
                                onClick={() => handleSave(item.id)}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGalleryPage;
