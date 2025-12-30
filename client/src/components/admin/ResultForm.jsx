import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { addItem, updateItem, getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const ResultForm = ({ result, onClose }) => {
    const { showNotification } = useAdmin();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchRollNo, setSearchRollNo] = useState('');
    const [formData, setFormData] = useState({
        studentName: '',
        rollNo: '',
        course: '',
        semester: '',
        marks: {},
        maxMarks: {},
        isPublished: false,
        locked: false
    });

    useEffect(() => {
        // Load students from API
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/students');
                const data = await response.json();

                if (data.success) {
                    // Map API data to match expected format
                    const mapped = data.data.map(s => ({
                        ...s,
                        id: s._id,
                        rollNo: s.rollNo || s.studentId || 'N/A',
                        course: s.class ? s.class.split(' - ')[0] : '',
                        semester: s.class ? s.class.split(' - ')[1] : '',
                        name: s.name
                    }));
                    setStudents(mapped);
                    setFilteredStudents(mapped);

                    // Extract unique courses
                    const uniqueCourses = [...new Set(mapped.map(s => s.course).filter(Boolean))];
                    setCourses(uniqueCourses);
                }
            } catch (error) {
                console.error('Failed to load students:', error);
                // Fallback to localStorage if API fails
                const studentList = getItems(STORAGE_KEYS.STUDENTS);
                setStudents(studentList);
                setFilteredStudents(studentList);
                const uniqueCourses = [...new Set(studentList.map(s => s.course).filter(Boolean))];
                setCourses(uniqueCourses);
            }
        };

        fetchStudents();

        // Load subjects from localStorage (still managed locally)
        const subjectList = getItems(STORAGE_KEYS.SUBJECTS);
        setSubjects(subjectList);

        // Always initialize maxMarks with subject defaults
        const defaultMaxMarks = {};
        subjectList.forEach(s => {
            defaultMaxMarks[s.id] = s.totalMarks || 100;
        });

        if (result) {
            // Merge existing maxMarks with defaults (existing values take priority)
            const mergedMaxMarks = { ...defaultMaxMarks, ...(result.maxMarks || {}) };
            setFormData({
                studentName: result.studentName || '',
                rollNo: result.rollNo || '',
                course: result.course || '',
                semester: result.semester || '',
                marks: result.marks || {},
                maxMarks: mergedMaxMarks,
                isPublished: result.isPublished || result.published || false,
                locked: result.locked || false
            });
        } else {
            setFormData(prev => ({ ...prev, maxMarks: defaultMaxMarks }));
        }
    }, [result]);

    // Filter students based on course and roll number search
    useEffect(() => {
        let filtered = students;

        if (selectedCourse) {
            filtered = filtered.filter(s => s.course === selectedCourse);
        }

        if (searchRollNo.trim()) {
            const searchLower = searchRollNo.toLowerCase();
            filtered = filtered.filter(s =>
                s.rollNo?.toLowerCase().includes(searchLower) ||
                s.name?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredStudents(filtered);
    }, [selectedCourse, searchRollNo, students]);

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        const student = students.find(s => s.id === studentId);
        if (student) {
            setFormData(prev => ({
                ...prev,
                studentName: student.name,
                rollNo: student.rollNo,
                course: student.course,
                semester: student.semester
            }));
        }
    };

    const handleMarkChange = (subjectId, value) => {
        setFormData(prev => ({
            ...prev,
            marks: {
                ...prev.marks,
                [subjectId]: parseInt(value) || 0
            }
        }));
    };

    const handleMaxMarkChange = (subjectId, value) => {
        setFormData(prev => ({
            ...prev,
            maxMarks: {
                ...prev.maxMarks,
                [subjectId]: parseInt(value) || 100
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for duplicate roll number
        const existingResults = getItems(STORAGE_KEYS.RESULTS);
        const duplicate = existingResults.find(r =>
            r.rollNo.toLowerCase() === formData.rollNo.toLowerCase() &&
            (!result || r.id !== result.id) // Ignore self when editing
        );

        if (duplicate) {
            showNotification(`Result for Roll No ${formData.rollNo} already exists!`, 'error');
            return;
        }

        const totalMarks = Object.values(formData.maxMarks).reduce((sum, max) => sum + (parseInt(max) || 100), 0);
        const obtainedMarks = Object.values(formData.marks).reduce((sum, mark) => sum + (parseInt(mark) || 0), 0);
        const percentage = (obtainedMarks / totalMarks) * 100;

        // Calculate grade (standardized scale)
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else if (percentage >= 40) grade = 'E';

        const resultData = {
            ...formData,
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            maxMarks: formData.maxMarks
        };

        try {
            if (result) {
                updateItem(STORAGE_KEYS.RESULTS, result.id, resultData);
                logActivity('Result Updated', `Updated result for: ${formData.studentName}`);
                showNotification('Result updated successfully', 'success');
            } else {
                addItem(STORAGE_KEYS.RESULTS, resultData);
                logActivity('Result Added', `Added result for: ${formData.studentName}`);
                showNotification('Result added successfully', 'success');
            }
            onClose();
        } catch (error) {
            showNotification('Failed to save result', 'error');
        }
    };

    const clearFilters = () => {
        setSelectedCourse('');
        setSearchRollNo('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {result ? 'Edit Result' : 'Add New Result'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form - Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-4 sm:p-6 flex-1 space-y-4">
                            {/* Student Selection */}
                            {!result && (
                                <>
                                    {/* Search & Filter Section */}
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Find Student</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Class/Course Filter */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Filter by Class</label>
                                                <select
                                                    value={selectedCourse}
                                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                                >
                                                    <option value="">All Classes</option>
                                                    {courses.map(course => (
                                                        <option key={course} value={course}>{course}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Search by Roll Number */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search by Roll No / Name</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={searchRollNo}
                                                        onChange={(e) => setSearchRollNo(e.target.value)}
                                                        placeholder="Enter roll number or name..."
                                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filter Info & Clear */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Found <span className="font-semibold text-primary-600">{filteredStudents.length}</span> students
                                            </span>
                                            {(selectedCourse || searchRollNo) && (
                                                <button
                                                    type="button"
                                                    onClick={clearFilters}
                                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Student Selection Dropdown */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Student *</label>
                                        <select
                                            onChange={handleStudentChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                            required
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                {filteredStudents.length === 0
                                                    ? 'No students found'
                                                    : `Select from ${filteredStudents.length} students`
                                                }
                                            </option>
                                            {filteredStudents.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.rollNo} - {s.name} ({s.course})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Student Info (Read-only) */}
                            {formData.studentName && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Student Name</p>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{formData.studentName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Roll Number</p>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{formData.rollNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Course</p>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{formData.course}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Semester</p>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{formData.semester}</p>
                                    </div>
                                </div>
                            )}

                            {/* Marks Entry */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Enter Marks
                                </h3>
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    {/* Header Row */}
                                    <div className="grid grid-cols-3 gap-2 p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Subject</div>
                                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase text-center">Max Marks</div>
                                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase text-center">Obtained</div>
                                    </div>
                                    {/* Subject Rows */}
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {subjects.map(subject => (
                                            <div key={subject.id} className="grid grid-cols-3 gap-2 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {subject.subjectName}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={formData.maxMarks[subject.id] || subject.totalMarks || 100}
                                                    onChange={(e) => handleMaxMarkChange(subject.id, e.target.value)}
                                                    className="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                    placeholder="100"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={formData.maxMarks[subject.id] || subject.totalMarks || 100}
                                                    value={formData.marks[subject.id] || ''}
                                                    onChange={(e) => handleMarkChange(subject.id, e.target.value)}
                                                    className="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none font-semibold"
                                                    placeholder="0"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                {Object.keys(formData.marks).length > 0 && (
                                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Total: </span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {Object.values(formData.marks).reduce((sum, mark) => sum + (parseInt(mark) || 0), 0)}
                                            </span>
                                            <span className="text-gray-400"> / {Object.values(formData.maxMarks).reduce((sum, max) => sum + (parseInt(max) || 100), 0)}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Percentage: </span>
                                            <span className="font-bold text-primary-600">
                                                {(() => {
                                                    const total = Object.values(formData.maxMarks).reduce((sum, max) => sum + (parseInt(max) || 100), 0);
                                                    const obtained = Object.values(formData.marks).reduce((sum, mark) => sum + (parseInt(mark) || 0), 0);
                                                    return total > 0 ? ((obtained / total) * 100).toFixed(1) : '0.0';
                                                })()}%
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                                disabled={!formData.studentName}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 text-sm"
                            >
                                {result ? 'Update Result' : 'Add Result'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResultForm;
