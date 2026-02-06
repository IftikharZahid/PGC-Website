import React, { useState, useEffect } from 'react';
import { getItems, updateItem, STORAGE_KEYS, initializeDemoData } from '../../utils/adminStorage';
import { Save, RefreshCw, Image as ImageIcon, Users, ExternalLink, Check } from 'lucide-react';

const AdminGalleryPage = ({ section = 'Home' }) => {
    const [images, setImages] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [savingId, setSavingId] = useState(null);

    // activeTab is now derived from props
    const activeTab = section;
    const isFacultySection = activeTab === 'Faculty';

    useEffect(() => {
        // Ensure data is initialized
        initializeDemoData();
        loadData();
    }, [activeTab]);

    const loadData = () => {
        setLoading(true);
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

    const handleSave = async (id) => {
        setSavingId(id);
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isFacultySection) {
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                updateItem(STORAGE_KEYS.TEACHERS, id, { image: teacher.image });
                showSuccess(`Updated ${teacher.name}`);
            }
        } else {
            const image = images.find(img => img.id === id);
            if (image) {
                updateItem(STORAGE_KEYS.GALLERY, id, { url: image.url });
                showSuccess(`Updated ${image.title}`);
            }
        }
        setSavingId(null);
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const getSectionColor = (section) => {
        switch (section) {
            case 'Hero': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Intro': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'News': return 'bg-green-50 text-green-700 border-green-200';
            case 'Faculty': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Seminars': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Unified Render for both Faculty and Gallery
    const displayItems = isFacultySection ? teachers : images.filter(img => img.section === activeTab);
    const isEmpty = displayItems.length === 0;

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {isFacultySection ? <Users className="w-5 h-5 text-primary-600" /> : <ImageIcon className="w-5 h-5 text-primary-600" />}
                        {activeTab} Gallery
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage {isFacultySection ? 'faculty photos' : 'gallery images'} • {displayItems.length} items
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadData}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 z-50">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {/* Unified Grid */}
            {isEmpty ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    {isFacultySection ? (
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    ) : (
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    )}
                    <p className="text-gray-500 dark:text-gray-400">No items found for this section.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayItems.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
                            <div className="flex p-3 gap-3">
                                {/* Small Preview - Horizontal Layout for ALL items */}
                                <div className="relative w-24 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 group hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
                                    {(isFacultySection ? item.image : item.url) ? (
                                        <img
                                            src={isFacultySection ? item.image : item.url}
                                            alt={isFacultySection ? item.name : item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/150?text=No+Img';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                        </div>
                                    )}

                                    {/* Preview Overlay for Gallery items */}
                                    {!isFacultySection && item.url && (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                                        >
                                            <ExternalLink className="w-4 h-4 drop-shadow-md" />
                                        </a>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    {isFacultySection ? (
                                        // Faculty Content
                                        <>
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate pr-2">{item.name}</h3>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.designation}</p>
                                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 w-fit truncate max-w-full">
                                                {item.department}
                                            </span>
                                        </>
                                    ) : (
                                        // Gallery Content
                                        <>
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate pr-2" title={item.title}>{item.title}</h3>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${getSectionColor(item.section)}`}>
                                                    {item.section}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1 truncate">ID: {item.id}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Edit URL Input */}
                            <div className="px-3 pb-3 pt-0">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={(isFacultySection ? item.image : item.url) || ''}
                                        onChange={(e) => handleUrlChange(item.id, e.target.value)}
                                        placeholder="Image URL..."
                                        className="w-full pl-2 pr-8 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    />
                                    <button
                                        onClick={() => handleSave(item.id)}
                                        disabled={savingId === item.id}
                                        className={`absolute right-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${savingId === item.id ? 'text-primary-600 animate-pulse' : 'text-gray-400 hover:text-primary-600'}`}
                                        title="Save URL"
                                    >
                                        {savingId === item.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminGalleryPage;
