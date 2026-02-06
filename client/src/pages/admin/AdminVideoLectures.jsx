import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Trash2, Edit2, Plus, Video, Clock, Layout, ChevronDown, ChevronRight, X, PlayCircle, MoreVertical } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
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
                // Auto-expand the first week if none are expanded and weeks exist
                if (mapped.length > 0 && Object.keys(expandedWeeks).length === 0) {
                    setExpandedWeeks({ [mapped[0].courseId]: true });
                }
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

    const prepareEditWeek = (week, e) => {
        e.stopPropagation();
        setEditingWeek(week);
        setWeekForm({ title: week.title, id: week.id });
        setIsWeekModalOpen(true);
    };

    const prepareDeleteWeek = (weekId, e) => {
        e.stopPropagation();
        handleDeleteWeek(weekId);
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

    const prepareAddLesson = (weekId, e) => {
        if (e) e.stopPropagation();
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Video Lectures</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organize courses and video content</p>
                </div>
                <button
                    onClick={() => {
                        setEditingWeek(null);
                        setWeekForm({ title: '', id: '' });
                        setIsWeekModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                </button>
            </div>

            {/* Courses List */}
            {weeks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4">
                        <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No courses available</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm text-center">Start by adding a new course to organize your video lessons.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {weeks.map(week => (
                        <div
                            key={week.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                        >
                            {/* Course Header */}
                            <div
                                className="flex flex-col sm:flex-row sm:items-center p-4 gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                onClick={() => toggleWeek(week.id)}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`p-1.5 rounded-full transition-transform duration-200 ${expandedWeeks[week.id] ? 'bg-primary-50 dark:bg-primary-900/20 rotate-90' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                        <ChevronRight className={`w-4 h-4 ${expandedWeeks[week.id] ? 'text-primary-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{week.title}</h3>
                                            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">
                                                {week.id}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {week.lessons?.length || 0} lessons
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-9 sm:pl-0 border-t sm:border-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0">
                                    <button
                                        onClick={(e) => prepareEditWeek(week, e)}
                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                        title="Edit Course"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => prepareDeleteWeek(week.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Course"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                    <button
                                        onClick={(e) => prepareAddLesson(week.id, e)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Lesson</span>
                                    </button>
                                </div>
                            </div>

                            {/* Lessons List */}
                            {expandedWeeks[week.id] && (
                                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-2 sm:p-4 animate-in slide-in-from-top-1">
                                    {week.lessons && week.lessons.length > 0 ? (
                                        <div className="grid gap-2">
                                            {week.lessons.map((lesson, idx) => (
                                                <div
                                                    key={lesson.id}
                                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                                                >
                                                    {/* Lesson Index */}
                                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500 font-mono">
                                                        {idx + 1}
                                                    </span>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{lesson.title}</h4>
                                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700/50">
                                                                <Video className="w-3 h-3 text-primary-500" />
                                                                <span className="font-mono">{lesson.videoId}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700/50">
                                                                <Clock className="w-3 h-3 text-orange-500" />
                                                                <span className="font-mono">{lesson.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-t sm:border-0 border-gray-100 dark:border-gray-700 pt-2 sm:pt-0 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                                                        <button
                                                            onClick={() => prepareEditLesson(week.id, lesson)}
                                                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(week.id, lesson.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                            <PlayCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No lessons in this course yet.</p>
                                            <button
                                                onClick={() => prepareAddLesson(week.id)}
                                                className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                                            >
                                                Add First Lesson
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Course Edit/Create Modal */}
            {isWeekModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {editingWeek ? 'Edit Course' : 'New Course'}
                            </h2>
                            <button onClick={() => setIsWeekModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveWeek} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    value={weekForm.title}
                                    onChange={e => setWeekForm({ ...weekForm, title: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                                    placeholder="e.g. Introduction to CS"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Course ID</label>
                                <input
                                    type="text"
                                    required
                                    value={weekForm.id}
                                    onChange={e => setWeekForm({ ...weekForm, id: e.target.value })}
                                    disabled={!!editingWeek}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                                    placeholder="e.g. cs101"
                                />
                                {editingWeek && <p className="text-[10px] text-gray-400 mt-1">ID cannot be changed</p>}
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsWeekModalOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lesson Edit/Create Modal */}
            {isLessonModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50 rounded-t-xl">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {editingLesson ? 'Edit Lesson' : 'New Lesson'}
                            </h2>
                            <button onClick={() => setIsLessonModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="lessonForm" onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Lesson Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={lessonForm.title}
                                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                                        placeholder="Brief title for the lesson"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">YouTube ID</label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={lessonForm.videoId}
                                            onChange={e => setLessonForm({ ...lessonForm, videoId: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 font-mono"
                                            placeholder="dQw4w9WgXcQ"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Duration</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={lessonForm.duration}
                                            onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 font-mono"
                                            placeholder="10:30"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <ReactQuill
                                            theme="snow"
                                            value={lessonForm.description}
                                            onChange={(content) => setLessonForm({ ...lessonForm, description: content })}
                                            modules={modules}
                                            formats={formats}
                                            className="h-48 mb-10" // mb-10 to account for quill toolbar height issue
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 rounded-b-xl flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsLessonModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="lessonForm"
                                className="px-6 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm transition-colors"
                            >
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
