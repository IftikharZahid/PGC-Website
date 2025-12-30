import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, Save } from 'lucide-react';
import { getItems, addItem, updateItem, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';

const TeacherResults = () => {
    const { user } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Set default subject on load
    useEffect(() => {
        if (user?.subjects?.length > 0 && !selectedSubject) {
            setSelectedSubject(user.subjects[0]);
        }
    }, [user]);

    // Fetch data when subject changes
    useEffect(() => {
        if (!selectedSubject) return;
        loadData();
    }, [selectedSubject]);

    const loadData = () => {
        setLoading(true);
        try {
            const allStudents = getItems(STORAGE_KEYS.STUDENTS) || [];
            const allCourses = getItems(STORAGE_KEYS.COURSES) || [];
            const allResults = getItems(STORAGE_KEYS.RESULTS) || [];

            // 1. Find courses that include this subject
            const relevantCourseNames = allCourses
                .filter(c => c.subjects && c.subjects.includes(selectedSubject))
                .map(c => c.courseName);

            // 2. Filter students enrolled in those courses
            // If no courses found (e.g. subject not assigned to course yet), show no students or all?
            // User requested "all students added by admin... relevant marks".
            // Let's filter by course if mapping exists, otherwise fallback to all active students to be safe.
            let relevantStudents = allStudents.filter(s => s.status === 'Active');

            if (relevantCourseNames.length > 0) {
                relevantStudents = relevantStudents.filter(s => relevantCourseNames.includes(s.course));
            }

            // 3. Merge with results
            const mergedData = relevantStudents.map(student => {
                const result = allResults.find(r =>
                    r.studentId === student.id &&
                    r.subject === selectedSubject
                );

                return {
                    ...student,
                    resultId: result?.id,
                    midTerm: result?.midTerm || 0,
                    finalTerm: result?.finalTerm || 0,
                    total: result?.total || 0,
                    grade: result?.grade || '-'
                };
            });

            setStudents(mergedData);
        } catch (error) {
            console.error("Error loading results:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (studentId, field, value) => {
        const numValue = Math.min(Math.max(Number(value), 0), field === 'midTerm' ? 100 : 100); // Simple clamp, or remove limit

        setStudents(prev => prev.map(s => {
            if (s.id !== studentId) return s;

            const mid = field === 'midTerm' ? numValue : s.midTerm;
            const final = field === 'finalTerm' ? numValue : s.finalTerm;
            // logic for total, assume simplistically mid + final for now (or whatever user wants)
            // Let's assume total = mid + final.
            const total = mid + final;

            let grade = 'F';
            if (total >= 85) grade = 'A';
            else if (total >= 80) grade = 'A-';
            else if (total >= 75) grade = 'B+';
            else if (total >= 70) grade = 'B';
            else if (total >= 65) grade = 'C+';
            else if (total >= 60) grade = 'C';
            else if (total >= 50) grade = 'D';

            return { ...s, [field]: numValue, total, grade };
        }));
    };

    const saveGrades = () => {
        try {
            students.forEach(student => {
                // Calculate derived fields for Admin Results compatibility
                const totalMarks = 100;
                const obtainedMarks = student.total;
                const percentage = Number(((obtainedMarks / totalMarks) * 100).toFixed(2));

                const resultData = {
                    studentId: student.id,
                    studentName: student.name,
                    subject: selectedSubject,
                    midTerm: student.midTerm,
                    finalTerm: student.finalTerm,
                    total: student.total,
                    grade: student.grade,
                    rollNo: student.rollNo,
                    course: student.course,
                    // Admin Page Compatibility Fields
                    totalMarks,
                    obtainedMarks,
                    percentage,
                    isPublished: false // Teacher saves are pending approval
                };

                if (student.resultId) {
                    updateItem(STORAGE_KEYS.RESULTS, student.resultId, resultData);
                } else {
                    // Check existence to prevent duplicate inserts during same session before refresh
                    const existing = getItems(STORAGE_KEYS.RESULTS).find(r => r.studentId === student.id && r.subject === selectedSubject);
                    if (existing) {
                        updateItem(STORAGE_KEYS.RESULTS, existing.id, resultData);
                    } else {
                        addItem(STORAGE_KEYS.RESULTS, resultData);
                    }
                }
            });
            logActivity('Grades Updated', `Updated grades for ${selectedSubject}`);
            setIsEditing(false);
            loadData();
            // Optional: Show toast component if available, using alert for now as per previous simple implementation style or no-op
        } catch (error) {
            console.error('Error saving grades:', error);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            saveGrades();
        } else {
            setIsEditing(true);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Exam Results</h1>
                    <p className="text-gray-500">View and update student grades</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadData}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={toggleEdit}
                        className={`${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'} text-white px-4 py-2 rounded-lg transition-colors shadow-sm min-w-[140px] flex items-center justify-center gap-2`}
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : null}
                        {isEditing ? 'Save Grades' : 'Enter Grades'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none min-w-[200px]"
                    disabled={!user?.subjects || user.subjects.length === 0}
                >
                    {user?.subjects && user.subjects.length > 0 ? (
                        user.subjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                        ))
                    ) : (
                        <option value="">No subjects assigned</option>
                    )}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Mid Term</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Final Term</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>

                                        {/* Mid Term */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={student.midTerm}
                                                    onChange={(e) => handleGradeChange(student.id, 'midTerm', e.target.value)}
                                                    className="w-20 text-center border border-gray-300 rounded p-1 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            ) : student.midTerm}
                                        </td>

                                        {/* Final Term */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={student.finalTerm}
                                                    onChange={(e) => handleGradeChange(student.id, 'finalTerm', e.target.value)}
                                                    className="w-20 text-center border border-gray-300 rounded p-1 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            ) : student.finalTerm}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">{student.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${student.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                                                student.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                    student.grade === '-' ? 'bg-gray-100 text-gray-500' :
                                                        student.grade === 'F' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No students found for this subject.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherResults;
