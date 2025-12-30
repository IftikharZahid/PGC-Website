import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Trash2, Edit2, Plus, Video, Clock, Layout, ChevronDown } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
];

const AdminVideoLectures = () => {
    const { showNotification } = useAdmin();
    const [weeks, setWeeks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

    // Edit States
    const [editingWeek, setEditingWeek] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [selectedWeekForLesson, setSelectedWeekForLesson] = useState(null);
    const [expandedWeeks, setExpandedWeeks] = useState({});

    // Form States
    const [weekForm, setWeekForm] = useState({ title: '', id: '' });
    const [lessonForm, setLessonForm] = useState({ title: '', videoId: '', duration: '', description: '' });

    // Load data from API
    useEffect(() => {
        loadWeeks();
    }, []);

    const loadWeeks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/video-lectures/all');
            const data = await response.json();
            if (data.success) {
                // Map _id to id for compatibility
                const mapped = data.data.map(w => ({
                    ...w,
                    id: w.courseId,
                    lessons: (w.lessons || []).map(l => ({
                        ...l,
                        id: l.lessonId
                    }))
                }));
                setWeeks(mapped);
            }
        } catch (error) {
            console.error('Failed to load video lectures:', error);
            showNotification('Failed to load video lectures', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleWeek = (weekId) => {
        setExpandedWeeks(prev => ({
            ...prev,
            [weekId]: !prev[weekId]
        }));
    };

    // Week Operations
    const handleSaveWeek = async (e) => {
        e.preventDefault();
        try {
            if (editingWeek) {
                // Update existing week
                const response = await fetch(`/api/video-lectures/${editingWeek.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: weekForm.title })
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Course updated successfully', 'success');
                } else {
                    throw new Error(result.message);
                }
            } else {
                // Add new week
                const response = await fetch('/api/video-lectures', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseId: weekForm.id || `week${Date.now()}`,
                        title: weekForm.title,
                        lessons: []
                    })
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Course added successfully', 'success');
                } else {
                    throw new Error(result.message);
                }
            }
            setIsWeekModalOpen(false);
            setEditingWeek(null);
            setWeekForm({ title: '', id: '' });
            loadWeeks();
        } catch (error) {
            showNotification(error.message || 'Failed to save course', 'error');
        }
    };

    const handleDeleteWeek = async (weekId) => {
        if (window.confirm('Are you sure? This will delete all lessons in this course.')) {
            try {
                const response = await fetch(`/api/video-lectures/${weekId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Course deleted successfully', 'success');
                    loadWeeks();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                showNotification('Failed to delete course', 'error');
            }
        }
    };

    const prepareEditWeek = (week) => {
        setEditingWeek(week);
        setWeekForm({ title: week.title, id: week.id });
        setIsWeekModalOpen(true);
    };

    // Lesson Operations
    const handleSaveLesson = async (e) => {
        e.preventDefault();
        try {
            const week = weeks.find(w => w.id === selectedWeekForLesson);
            if (!week) {
                console.error('Week not found:', selectedWeekForLesson);
                return;
            }

            let updatedLessons = [...(week.lessons || [])];

            if (editingLesson) {
                // Update existing lesson
                updatedLessons = updatedLessons.map(l =>
                    l.id === editingLesson.id
                        ? { ...lessonForm, lessonId: editingLesson.id, id: editingLesson.id }
                        : l
                );
            } else {
                // Add new lesson
                const newLessonId = Date.now();
                const newLesson = {
                    ...lessonForm,
                    lessonId: newLessonId,
                    id: newLessonId
                };
                updatedLessons.push(newLesson);
            }

            // Convert back to API format
            const apiLessons = updatedLessons.map(l => ({
                lessonId: l.lessonId || l.id,
                title: l.title,
                videoId: l.videoId,
                duration: l.duration,
                description: l.description || ''
            }));

            const response = await fetch(`/api/video-lectures/${selectedWeekForLesson}/lessons`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessons: apiLessons })
            });

            const result = await response.json();
            if (result.success) {
                showNotification(editingLesson ? 'Lesson updated' : 'Lesson added', 'success');
                setIsLessonModalOpen(false);
                setEditingLesson(null);
                setLessonForm({ title: '', videoId: '', duration: '', description: '' });
                loadWeeks();
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error(err);
            showNotification('Failed to save lesson', 'error');
        }
    };

    const handleDeleteLesson = async (weekId, lessonId) => {
        if (window.confirm('Delete this lesson?')) {
            try {
                const week = weeks.find(w => w.id === weekId);
                const updatedLessons = week.lessons
                    .filter(l => l.id !== lessonId)
                    .map(l => ({
                        lessonId: l.lessonId || l.id,
                        title: l.title,
                        videoId: l.videoId,
                        duration: l.duration,
                        description: l.description || ''
                    }));

                const response = await fetch(`/api/video-lectures/${weekId}/lessons`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessons: updatedLessons })
                });

                const result = await response.json();
                if (result.success) {
                    showNotification('Lesson deleted', 'success');
                    loadWeeks();
                }
            } catch (error) {
                showNotification('Failed to delete lesson', 'error');
            }
        }
    };

    const prepareAddLesson = (weekId) => {
        setSelectedWeekForLesson(weekId);
        setEditingLesson(null);
        setLessonForm({ title: '', videoId: '', duration: '', description: '' });
        setIsLessonModalOpen(true);
    };

    const prepareEditLesson = (weekId, lesson) => {
        setSelectedWeekForLesson(weekId);
        setEditingLesson(lesson);
        setLessonForm({
            title: lesson.title,
            videoId: lesson.videoId,
            duration: lesson.duration,
            description: lesson.description || ''
        });
        setIsLessonModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Video Lectures</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage course topics and video content</p>
                </div>
                <button
                    onClick={() => {
                        setEditingWeek(null);
                        setWeekForm({ title: '', id: '' });
                        setIsWeekModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Course
                </button>
            </div>

            {weeks.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Video className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No courses yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Click "Add Course" to create your first video lecture course.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {weeks.map(week => (
                        <div key={week.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Week Header */}
                            <div
                                className="px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                onClick={() => toggleWeek(week.id)}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className={`p-1 rounded-full transition-transform duration-200 flex-shrink-0 ${expandedWeeks[week.id] ? 'rotate-0' : '-rotate-90'}`}>
                                        <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                                    </div>
                                    <div className="p-1 sm:p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex-shrink-0">
                                        <Layout className="w-3 sm:w-4 h-3 sm:h-4 text-primary-600" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">{week.title}</h3>
                                    <span className="hidden sm:inline text-[10px] sm:text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded-full text-gray-500 dark:text-gray-300 font-mono flex-shrink-0">
                                        {week.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 ml-auto" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => prepareEditWeek(week)}
                                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        title="Edit Course"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWeek(week.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        title="Delete Course"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>
                                    <button
                                        onClick={() => prepareAddLesson(week.id)}
                                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span className="hidden xs:inline">Add</span> Lesson
                                    </button>
                                </div>
                            </div>

                            {/* Lessons List - Collapsible */}
                            {expandedWeeks[week.id] && (
                                <div className="p-3 space-y-2 bg-white dark:bg-gray-800 animate-in slide-in-from-top-2 duration-200">
                                    {week.lessons && week.lessons.length > 0 ? (
                                        week.lessons.map((lesson, index) => (
                                            <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-white border border-gray-100 dark:bg-gray-700/10 dark:border-gray-700/50 rounded-lg group hover:border-primary-100 hover:bg-primary-50/10 dark:hover:bg-gray-700/30 transition-all gap-3 sm:gap-0">
                                                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                                                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 shadow-sm mt-0.5 sm:mt-0">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate pr-2">{lesson.title}</h4>
                                                        <div className="flex flex-wrap items-center gap-3 mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                                                                <Video className="w-2.5 h-2.5" />
                                                                <span className="truncate max-w-[80px] sm:max-w-none font-mono">{lesson.videoId}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                <span className="font-mono">{lesson.duration}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end gap-1 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-t sm:border-0 border-gray-100 dark:border-gray-700 pt-2 sm:pt-0 mt-1 sm:mt-0">
                                                    <button
                                                        onClick={() => prepareEditLesson(week.id, lesson)}
                                                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                                                        title="Edit Lesson"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLesson(week.id, lesson.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                                                        title="Delete Lesson"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">No lessons added yet</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Click "Add Lesson" to get started</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Week Modal */}
            {isWeekModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {editingWeek ? 'Edit Course' : 'Add New Course'}
                            </h2>
                            <button
                                onClick={() => setIsWeekModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-5">
                            <form id="weekForm" onSubmit={handleSaveWeek} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={weekForm.title}
                                        onChange={e => setWeekForm({ ...weekForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm placeholder:text-gray-400"
                                        placeholder="e.g. Week 01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Course ID (Unique)</label>
                                    <input
                                        type="text"
                                        required
                                        value={weekForm.id}
                                        onChange={e => setWeekForm({ ...weekForm, id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm placeholder:text-gray-400"
                                        placeholder="e.g. week1"
                                        disabled={editingWeek}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsWeekModalOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 border border-transparent hover:border-gray-200 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="weekForm"
                                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {isLessonModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 rounded-t-xl flex justify-between items-center flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                            </h2>
                            <button
                                onClick={() => setIsLessonModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <form id="lessonForm" onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Lesson Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={lessonForm.title}
                                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Introduction to logic"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">YouTube Video ID</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Video className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={lessonForm.videoId}
                                            onChange={e => setLessonForm({ ...lessonForm, videoId: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                            placeholder="e.g. dQw4w9WgXcQ"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">Enter the ID after 'v=' from the YouTube URL</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Duration</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={lessonForm.duration}
                                            onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                            placeholder="e.g. 10:45"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Lesson Description
                                        <span className="ml-2 text-xs font-normal text-gray-500">Rich text formatting supported</span>
                                    </label>
                                    <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 min-h-[300px] shadow-sm flex flex-col">
                                        <ReactQuill
                                            theme="snow"
                                            value={lessonForm.description}
                                            onChange={(content) => setLessonForm({ ...lessonForm, description: content })}
                                            modules={modules}
                                            formats={formats}
                                            className="flex-1 flex flex-col [&_.ql-container]:flex-1 [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-base"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsLessonModalOpen(false)}
                                className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="lessonForm"
                                className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVideoLectures;
