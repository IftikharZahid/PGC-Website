import { useState, useEffect, useMemo } from 'react';
import { Check, X, Search, Calendar, Users, Save, RefreshCw, Clock, Filter } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import {
    useGetAttendanceClassesQuery,
    useGetAttendanceStudentsQuery,
    useGetAttendanceByClassAndDateQuery,
    useSaveAttendanceMutation
} from '../../store/api/attendanceApi';

const AttendancePage = () => {
    const { showNotification } = useAdmin();
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // RTK Query hooks
    const { data: classesData } = useGetAttendanceClassesQuery();
    const classes = classesData?.success ? classesData.data : [];

    // Fetch students for the selected class (or all)
    const { data: studentsData, isLoading: isLoadingStudents } = useGetAttendanceStudentsQuery(selectedClass);
    const students = useMemo(() => studentsData?.success ? studentsData.data : [], [studentsData]);

    // Fetch attendance records for the date/class
    const { data: recordsData, isLoading: isLoadingRecords } = useGetAttendanceByClassAndDateQuery(
        { className: selectedClass, date: selectedDate }
    );

    const [saveAttendanceMutation, { isLoading: isSaving }] = useSaveAttendanceMutation();

    // Populate local attendance state when data arrives covering BOTH students and records
    useEffect(() => {
        if (students.length > 0 && recordsData?.success) {
            const currentRecords = recordsData.data;
            const initialAttendance = {};
            students.forEach(s => {
                const record = currentRecords.find(r => r.student === s._id);
                initialAttendance[s._id] = record ? record.status : 'Present';
            });
            setAttendance(initialAttendance);
        } else if (students.length > 0) {
            // Default to Present if no records fetched yet (or empty)
            const initialAttendance = {};
            students.forEach(s => {
                initialAttendance[s._id] = 'Present';
            });
            setAttendance(initialAttendance);
        }
    }, [students, recordsData]);

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

        try {
            const records = students.map(s => ({
                studentId: s._id,
                studentName: s.name,
                rollNo: s.rollNo || s.studentId,
                class: s.class,
                status: attendance[s._id] || 'Present'
            }));

            await saveAttendanceMutation({ date: selectedDate, records }).unwrap();
            showNotification('Attendance saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save attendance', error);
            showNotification(error.data?.message || 'Failed to save attendance', 'error');
        }
    };

    const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'Absent').length;
    const lateCount = Object.values(attendance).filter(s => s === 'Late').length;

    // Filtered students for display
    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [students, searchTerm]);

    // Standardized Status Badge
    const StatusBadge = ({ type, count, color }) => (
        <div className={`px-3 py-1 rounded-md border flex items-center gap-2 ${color}`}>
            <span className="text-xs font-bold uppercase tracking-wider">{type}</span>
            <span className="text-sm font-bold bg-white/50 px-1.5 rounded">{count}</span>
        </div>
    );

    const columns = [
        {
            key: 'rollNo',
            label: 'Roll No',
            sortable: true,
            width: '100px',
            render: (value) => <span className="font-mono text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">{value || '-'}</span>
        },
        {
            key: 'name',
            label: 'Student',
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{value}</div>
                    <div className="text-[10px] text-gray-400">{row.class}</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '200px',
            align: 'center',
            render: (_, row) => (
                <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5 w-fit mx-auto">
                    {[
                        { id: 'Present', icon: Check, color: 'text-emerald-600 bg-white dark:bg-gray-600 shadow-sm', hover: 'hover:text-emerald-500' },
                        { id: 'Absent', icon: X, color: 'text-red-600 bg-white dark:bg-gray-600 shadow-sm', hover: 'hover:text-red-500' },
                        { id: 'Late', icon: Clock, color: 'text-amber-600 bg-white dark:bg-gray-600 shadow-sm', hover: 'hover:text-amber-500' }
                    ].map(status => (
                        <button
                            key={status.id}
                            onClick={() => toggleAttendance(row._id, status.id)}
                            className={`p-1.5 rounded-md transition-all ${attendance[row._id] === status.id ? status.color : `text-gray-400 dark:text-gray-500 ${status.hover}`
                                }`}
                            title={`Mark ${status.id}`}
                        >
                            <status.icon className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    ))}
                </div>
            )
        }
    ];

    const isLoading = isLoadingStudents || isLoadingRecords;

    return (
        <div className="space-y-4 max-w-[1400px] mx-auto">
            {/* Header Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

                    {/* Left: Title & Quick Stats */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <span className="bg-primary-50 dark:bg-primary-900/20 p-1.5 rounded-lg text-primary-600"><Users className="w-5 h-5" /></span>
                                Attendance
                            </h1>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                        <div className="flex gap-2">
                            <StatusBadge type="P" count={presentCount} color="bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" />
                            <StatusBadge type="A" count={absentCount} color="bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" />
                            <StatusBadge type="L" count={lateCount} color="bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button
                            onClick={() => markAllAs('Present')}
                            disabled={students.length === 0}
                            className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                            Mark All Present
                        </button>
                        <button
                            onClick={() => markAllAs('Absent')}
                            disabled={students.length === 0}
                            className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                            Mark All Absent
                        </button>
                        <button
                            onClick={() => markAllAs('Late')}
                            disabled={students.length === 0}
                            className="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                            Mark All Late
                        </button>
                        <button
                            onClick={saveAttendance}
                            disabled={isSaving || students.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-sm min-w-[100px] justify-center"
                        >
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-transparent"
                        />
                    </div>

                    <div className="flex gap-2 flex-1 sm:flex-none overflow-x-auto">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shrink-0">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-sm bg-transparent outline-none text-gray-900 dark:text-gray-100 border-none p-0 focus:ring-0 w-[130px]"
                            />
                        </div>

                        <div className="relative min-w-[180px] shrink-0">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredStudents}
                    loading={isLoading}
                    compact={true}
                    searchable={false}
                    emptyMessage="No students found matching your criteria."
                    disablePagination={true}
                />
            </div>

            <div className="text-center text-xs text-gray-400 py-2">
                Showing {filteredStudents.length} students · {selectedDate}
            </div>
        </div>
    );
};

export default AttendancePage;
