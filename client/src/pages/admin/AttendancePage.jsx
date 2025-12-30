import { useState, useEffect } from 'react';
import { Check, X, Search, Calendar, Users, Save, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AttendancePage = () => {
    const { showNotification } = useAdmin();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [rollNoSearch, setRollNoSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [existingRecords, setExistingRecords] = useState([]);

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            loadStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClass, rollNoSearch]);

    useEffect(() => {
        if (selectedClass && selectedDate) {
            loadExistingAttendance();
        }
    }, [selectedClass, selectedDate]);

    const loadClasses = async () => {
        try {
            const response = await fetch('/api/attendance/classes');
            const data = await response.json();
            if (data.success) {
                setClasses(data.data);
            }
        } catch (error) {
            console.error('Failed to load classes', error);
        }
    };

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            let url = `/api/attendance/students?class=${encodeURIComponent(selectedClass)}`;
            if (rollNoSearch) {
                url += `&rollNo=${encodeURIComponent(rollNoSearch)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
                const initialAttendance = {};
                data.data.forEach(s => {
                    initialAttendance[s._id] = existingRecords.find(r => r.student === s._id)?.status || 'Present';
                });
                setAttendance(initialAttendance);
            }
        } catch (error) {
            console.error('Failed to load students', error);
            showNotification('Failed to load students', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const loadExistingAttendance = async () => {
        try {
            const response = await fetch(`/api/attendance?date=${selectedDate}&class=${encodeURIComponent(selectedClass)}`);
            const data = await response.json();
            if (data.success) {
                setExistingRecords(data.data);
                const updatedAttendance = { ...attendance };
                data.data.forEach(record => {
                    updatedAttendance[record.student] = record.status;
                });
                setAttendance(updatedAttendance);
            }
        } catch (error) {
            console.error('Failed to load existing attendance', error);
        }
    };

    const toggleAttendance = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const markAllAs = (status) => {
        const updated = {};
        students.forEach(s => { updated[s._id] = status; });
        setAttendance(updated);
    };

    const saveAttendance = async () => {
        if (students.length === 0) {
            showNotification('No students to save attendance for', 'warning');
            return;
        }
        setIsSaving(true);
        try {
            const records = students.map(s => ({
                studentId: s._id,
                studentName: s.name,
                rollNo: s.rollNo || s.studentId,
                class: s.class,
                status: attendance[s._id] || 'Present'
            }));

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, records })
            });

            const data = await response.json();
            if (data.success) {
                showNotification(data.message, 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Failed to save attendance', error);
            showNotification('Failed to save attendance', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'Absent').length;
    const lateCount = Object.values(attendance).filter(s => s === 'Late').length;

    return (
        <div className="space-y-2">
            {/* Compact Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Student Attendance</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Mark and manage daily attendance</p>
                </div>
                <button
                    onClick={saveAttendance}
                    disabled={isSaving || students.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </button>
            </div>

            {/* Compact Filters Row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Date */}
                    <div className="flex-1 min-w-[120px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Class */}
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                        >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    {/* Roll No Search */}
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Roll No</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                value={rollNoSearch}
                                onChange={(e) => setRollNoSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => markAllAs('Present')}
                            disabled={students.length === 0}
                            className="px-2.5 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 transition-colors"
                        >
                            All P
                        </button>
                        <button
                            onClick={() => markAllAs('Absent')}
                            disabled={students.length === 0}
                            className="px-2.5 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                        >
                            All A
                        </button>
                    </div>

                    {/* Stats Pills */}
                    {students.length > 0 && (
                        <div className="flex gap-1.5 ml-auto">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                                P: {presentCount}
                            </span>
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold">
                                A: {absentCount}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-bold">
                                L: {lateCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Student Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {!selectedClass ? (
                    <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Select a class to mark attendance</p>
                    </div>
                ) : isLoading ? (
                    <div className="p-6 text-center">
                        <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-primary-600" />
                        <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">No students found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Roll No</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">P</th>
                                    <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">A</th>
                                    <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {student.rollNo || student.studentId}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
                                            {student.name}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => toggleAttendance(student._id, 'Present')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${attendance[student._id] === 'Present'
                                                        ? 'bg-green-500 text-white shadow scale-105'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                    }`}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => toggleAttendance(student._id, 'Absent')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${attendance[student._id] === 'Absent'
                                                        ? 'bg-red-500 text-white shadow scale-105'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                    }`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => toggleAttendance(student._id, 'Late')}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs font-bold ${attendance[student._id] === 'Late'
                                                        ? 'bg-yellow-500 text-white shadow scale-105'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                                                    }`}
                                            >
                                                L
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendancePage;
