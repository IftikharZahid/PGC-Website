import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { addItem, updateItem, getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const CourseForm = ({ course, onClose }) => {
    const { showNotification } = useAdmin();
    const [formData, setFormData] = useState({
        courseId: '',
        courseName: '',
        duration: '',
        semesters: 4,
        subjects: []
    });
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    // Predefined course-to-subjects mapping
    const COURSE_SUBJECTS_MAP = {
        'ICS (Computer Science)': ['English', 'Computer Science', 'Mathematics', 'Physics', 'Urdu', 'Islamiyat', 'Tarjuma tul Quran'],
        'FSC-PM FSc Pre-Medical': ['English', 'Urdu', 'Islamiyat', 'Tarjuma tul Quran', 'Biology', 'Chemistry', 'Physics'],
        'FSc Pre-Medical': ['English', 'Urdu', 'Islamiyat', 'Tarjuma tul Quran', 'Biology', 'Chemistry', 'Physics'],
        'FSc Pre-Engineering': ['English', 'Urdu', 'Islamiyat', 'Tarjuma tul Quran', 'Mathematics', 'Chemistry', 'Physics'],
        'I.Com (Commerce)': ['Accounting', 'Economics', 'Business Studies', 'English', 'Urdu', 'Islamiyat'],
        'FA.IT': ['Urdu', 'Islamiyat Compulsory', 'English', 'Civics', 'Islamiyat Optional', 'Health and Physical', 'Computer Science'],
        'FA': ['Urdu', 'Islamiyat Compulsory', 'English', 'Civics', 'Islamiyat Optional', 'Health and Physical']
    };

    useEffect(() => {
        const subjects = getItems(STORAGE_KEYS.SUBJECTS);
        setAvailableSubjects(subjects.map(s => s.subjectName));

        if (course) {
            setFormData({
                courseId: course.courseId || '',
                courseName: course.courseName || '',
                duration: course.duration || '',
                semesters: course.semesters || 4,
                subjects: course.subjects || []
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-populate subjects when course name matches
        if (name === 'courseName' && COURSE_SUBJECTS_MAP[value]) {
            const requiredSubjects = COURSE_SUBJECTS_MAP[value];

            // Ensure all required subjects exist in the subjects list
            const existingSubjects = getItems(STORAGE_KEYS.SUBJECTS);
            const existingSubjectNames = existingSubjects.map(s => s.subjectName);

            requiredSubjects.forEach(subjectName => {
                if (!existingSubjectNames.includes(subjectName)) {
                    // Create the missing subject
                    const newSubject = {
                        subjectName,
                        subjectCode: subjectName.substring(0, 3).toUpperCase(),
                        totalMarks: 100,
                        passingMarks: 33
                    };
                    addItem(STORAGE_KEYS.SUBJECTS, newSubject);
                }
            });

            // Update available subjects and auto-assign to course
            const updatedSubjects = getItems(STORAGE_KEYS.SUBJECTS);
            setAvailableSubjects(updatedSubjects.map(s => s.subjectName));
            setFormData(prev => ({ ...prev, subjects: requiredSubjects }));

            showNotification(`Auto-populated ${requiredSubjects.length} subjects for ${value}`, 'success');
        }
    };

    const addSubject = () => {
        if (selectedSubject && !formData.subjects.includes(selectedSubject)) {
            setFormData(prev => ({ ...prev, subjects: [...prev.subjects, selectedSubject] }));
            setSelectedSubject('');
        }
    };

    const removeSubject = (subject) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s !== subject)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            if (course) {
                updateItem(STORAGE_KEYS.COURSES, course.id, formData);
                logActivity('Course Updated', `Updated course: ${formData.courseName}`);
                showNotification('Course updated successfully', 'success');
            } else {
                addItem(STORAGE_KEYS.COURSES, formData);
                logActivity('Course Added', `Added new course: ${formData.courseName}`);
                showNotification('Course added successfully', 'success');
            }
            onClose();
        } catch (error) {
            showNotification('Failed to save course', 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {course ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form - Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-4 sm:p-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course ID *</label>
                                    <input
                                        type="text"
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="FSC-PE"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Name *</label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="FSc Pre-Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration *</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="2 years"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Semesters *</label>
                                    <input
                                        type="number"
                                        name="semesters"
                                        value={formData.semesters}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="8"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subjects</label>
                                    <div className="flex gap-2 mb-2">
                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="">Select Subject</option>
                                            {availableSubjects
                                                .filter(subject => !formData.subjects.includes(subject))
                                                .map(subject => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))
                                            }
                                        </select>
                                        <button
                                            type="button"
                                            onClick={addSubject}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.subjects.map(subject => (
                                            <span key={subject} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-sm flex items-center gap-2">
                                                {subject}
                                                <button type="button" onClick={() => removeSubject(subject)} className="hover:text-red-600">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions - Fixed Footer */}
                        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 text-sm"
                            >
                                {course ? 'Update Course' : 'Add Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;
