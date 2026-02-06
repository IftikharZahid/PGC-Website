import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const ResultForm = ({ result, onClose }) => {
    const { showNotification } = useAdmin();
    // Toggle for input mode: 'manual' or 'database'
    const [entryMode, setEntryMode] = useState('manual');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]); // All subjects from localStorage
    const [courses, setCourses] = useState([]); // Courses with their subjects
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
        locked: false,
        studentId: '' // Added studentId to formData
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
                        // Priority: Explicit Roll No -> Student ID -> N/A
                        rollNo: s.rollNo || s.studentId || 'N/A',
                        course: s.class ? s.class.split(' - ')[0] : '',
                        semester: s.class ? s.class.split(' - ')[1] : '',
                        name: s.name
                    }));
                    setStudents(mapped);
                    setFilteredStudents(mapped);
                } else {
                    // Fallback to local storage if API fails
                    const studentList = getItems(STORAGE_KEYS.STUDENTS);
                    setStudents(studentList);
                    setFilteredStudents(studentList);
                }
            } catch (error) {
                console.error('Failed to load students:', error);
                // Fallback to local storage if API fails
                const studentList = getItems(STORAGE_KEYS.STUDENTS);
                setStudents(studentList);
                setFilteredStudents(studentList);
            }
        };

        // Fetch courses with subjects from API
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses');
                const data = await response.json();

                if (data.success && data.data) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error('Failed to load courses:', error);
            }
        };

        fetchStudents();
        fetchCourses();

        // Load all subjects from localStorage as fallback
        const subjectList = getItems(STORAGE_KEYS.SUBJECTS);
        setAllSubjects(subjectList);
        setSubjects(subjectList);

        // Always initialize maxMarks with subject defaults
        const defaultMaxMarks = {};
        subjectList.forEach(s => {
            defaultMaxMarks[s.id] = s.totalMarks || 100;
        });

        if (result) {
            // Map Name-keyed marks back to ID-keyed for form state
            const marksById = {};
            const maxMarksById = {};

            // Create a lookup for subject name -> id
            const nameToId = {};
            subjectList.forEach(s => {
                nameToId[s.subjectName] = s.id;
            });

            if (result.marks) {
                Object.entries(result.marks).forEach(([name, mark]) => {
                    const id = nameToId[name];
                    if (id) marksById[id] = mark;
                });
            }

            if (result.maxMarks) {
                Object.entries(result.maxMarks).forEach(([name, max]) => {
                    const id = nameToId[name];
                    if (id) maxMarksById[id] = max;
                });
            }

            // Merge with defaults
            const mergedMaxMarks = { ...defaultMaxMarks, ...maxMarksById };

            // Edit mode: populate form
            setFormData({
                studentName: result.studentName || result.name || '',
                rollNo: result.rollNo || result.roll || '',
                course: result.course || result.class || '',
                semester: result.semester || result.session || '',
                marks: marksById,
                maxMarks: mergedMaxMarks,
                isPublished: result.isPublished || result.published || false,
                locked: result.locked || false,
                studentId: result.studentId || ''
            });
            // Editing implies manual override is okay, or we could detect if student exists
            setEntryMode('manual');
        } else {
            setFormData(prev => ({ ...prev, maxMarks: defaultMaxMarks }));
        }
    }, [result]);

    // Filter students logic (same as before)
    useEffect(() => {
        let filtered = students;
        if (selectedCourse) filtered = filtered.filter(s => s.course === selectedCourse);
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
            // Find course and load its subjects
            const selectedCourseData = courses.find(c => c.courseName === student.course || c.courseId === student.course);
            if (selectedCourseData && selectedCourseData.subjects && selectedCourseData.subjects.length > 0) {
                const courseSubjects = allSubjects.filter(s =>
                    selectedCourseData.subjects.includes(s.subjectName)
                );
                setSubjects(courseSubjects.length > 0 ? courseSubjects : allSubjects);

                // Initialize maxMarks for course subjects
                const defaultMaxMarks = {};
                courseSubjects.forEach(s => {
                    defaultMaxMarks[s.id] = s.totalMarks || 100;
                });

                setFormData(prev => ({
                    ...prev,
                    studentName: student.name,
                    rollNo: student.rollNo,
                    course: student.course,
                    semester: student.semester,
                    studentId: student.id,
                    marks: {},
                    maxMarks: defaultMaxMarks
                }));
            } else {
                // No subjects defined, use all subjects
                setSubjects(allSubjects);
                setFormData(prev => ({
                    ...prev,
                    studentName: student.name,
                    rollNo: student.rollNo,
                    course: student.course,
                    semester: student.semester,
                    studentId: student.id,
                    marks: {},
                    maxMarks: prev.maxMarks
                }));
            }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-fetch subjects when course is selected
        if (name === 'course' && value) {
            const selectedCourseData = courses.find(c => c.courseName === value || c.courseId === value);
            if (selectedCourseData && selectedCourseData.subjects && selectedCourseData.subjects.length > 0) {
                // Filter subjects based on course
                const courseSubjects = allSubjects.filter(s =>
                    selectedCourseData.subjects.includes(s.subjectName)
                );
                setSubjects(courseSubjects.length > 0 ? courseSubjects : allSubjects);

                // Reset marks when course changes
                const defaultMaxMarks = {};
                courseSubjects.forEach(s => {
                    defaultMaxMarks[s.id] = s.totalMarks || 100;
                });
                setFormData(prev => ({ ...prev, marks: {}, maxMarks: defaultMaxMarks }));
            } else {
                // No subjects defined for this course, show all
                setSubjects(allSubjects);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert ID-keyed marks to Name-keyed for storage/display
        const marksByName = {};
        const maxMarksByName = {};

        subjects.forEach(subject => {
            const mark = formData.marks[subject.id];
            const max = formData.maxMarks[subject.id];

            // Only include if marks are entered
            if (mark !== undefined && mark !== '') {
                marksByName[subject.subjectName] = parseInt(mark) || 0;
                maxMarksByName[subject.subjectName] = parseInt(max) || 100;
            }
        });

        const totalMarks = Object.values(maxMarksByName).reduce((sum, max) => sum + max, 0);
        const obtainedMarks = Object.values(marksByName).reduce((sum, mark) => sum + mark, 0);
        const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

        // Calculate grade
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else if (percentage >= 40) grade = 'E';

        // MAPPING TO BACKEND SCHEMA
        const resultData = {
            name: formData.studentName,
            roll: formData.rollNo,
            class: formData.course,
            session: formData.semester,
            marks: marksByName,       // Send Name-keyed
            maxMarks: maxMarksByName, // Send Name-keyed
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            isPublished: formData.isPublished,
            id: result?._id || result?.id,
            studentId: formData.studentId // Include studentId
        };

        try {
            let response;
            if (result) {
                // Update existing
                const id = result._id || result.id;
                response = await fetch(`/api/results/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resultData)
                });
            } else {
                // Create new
                response = await fetch('/api/results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resultData)
                });
            }

            const data = await response.json();

            if (data.success) {
                logActivity(result ? 'Result Updated' : 'Result Added', `Result for: ${formData.studentName}`);
                showNotification(result ? 'Result updated successfully' : 'Result added successfully', 'success');
                onClose();
            } else {
                showNotification(data.message || 'Failed to save result', 'error');
            }
        } catch (error) {
            console.error(error);
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

                            {/* Toggle Entry Mode */}
                            {!result && (
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
                                    <button
                                        type="button"
                                        onClick={() => { setEntryMode('manual'); setFormData(prev => ({ ...prev, studentId: '' })); }} // Clear studentId on manual
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${entryMode === 'manual' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        Manual Entry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEntryMode('database')}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${entryMode === 'database' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        Select from Database
                                    </button>
                                </div>
                            )}

                            {/* Database Selection Mode */}
                            {entryMode === 'database' && !result && (
                                <>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Find Student</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Filter by Class</label>
                                                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none">
                                                    <option value="">All Classes</option>
                                                    {courses.map(course => (<option key={course._id || course.courseId} value={course.courseName}>{course.courseName}</option>))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search by Roll No / Name</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type="text" value={searchRollNo} onChange={(e) => setSearchRollNo(e.target.value)} placeholder="Enter roll number or name..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 dark:text-gray-400">Found <span className="font-semibold text-primary-600">{filteredStudents.length}</span> students</span>
                                            {(selectedCourse || searchRollNo) && (<button type="button" onClick={clearFilters} className="text-primary-600 hover:text-primary-700 font-medium">Clear filters</button>)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Student *</label>
                                        <select onChange={handleStudentChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none" defaultValue="" required={entryMode === 'database'}>
                                            <option value="" disabled>{filteredStudents.length === 0 ? 'No students found' : `Select from ${filteredStudents.length} students`}</option>
                                            {filteredStudents.map(s => (<option key={s.id} value={s.id}>{s.rollNo} - {s.name} ({s.course})</option>))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Manual Entry Form (or Read-only Display for Database Mode) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name *</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        readOnly={entryMode === 'database' && !result}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none ${entryMode === 'database' && !result ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''}`}
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll Number *</label>
                                    <input
                                        type="text"
                                        name="rollNo"
                                        value={formData.rollNo}
                                        onChange={handleInputChange}
                                        readOnly={entryMode === 'database' && !result}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none ${entryMode === 'database' && !result ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''}`}
                                        placeholder="e.g. PGC-2024-001"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course / Class *</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        readOnly={entryMode === 'database' && !result}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none ${entryMode === 'database' && !result ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''}`}
                                        placeholder="e.g. ICS"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester / Session *</label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        readOnly={entryMode === 'database' && !result}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none ${entryMode === 'database' && !result ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''}`}
                                        placeholder="e.g. 1st Semester"
                                        required
                                    />
                                </div>
                            </div>

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
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex-shrink-0">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish Result</span>
                            </label>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.studentName}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm text-center"
                                >
                                    {result ? 'Update Result' : 'Add Result'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResultForm;
