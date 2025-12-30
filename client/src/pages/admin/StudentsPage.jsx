import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StudentForm from '../../components/admin/StudentForm';
import { getItems, deleteItem, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, student: null });
    const { showNotification, refreshTrigger } = useAdmin();
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [rollNoFilter, setRollNoFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');

    useEffect(() => {
        loadStudents();

        const handleRefresh = () => loadStudents();
        window.addEventListener('storage', handleRefresh);
        window.addEventListener('focus', handleRefresh);

        return () => {
            window.removeEventListener('storage', handleRefresh);
            window.removeEventListener('focus', handleRefresh);
        };
    }, [refreshTrigger]);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/students');
            const data = await response.json();

            if (data.success) {
                const mapped = data.data.map(s => ({
                    ...s,
                    id: s._id,
                    rollNo: s.rollNo || s.studentId || 'N/A',
                    course: s.class ? s.class.split(' - ')[0] : '',
                    semester: s.class ? s.class.split(' - ')[1] : '',
                    status: s.status || 'Active'
                }));
                setStudents(mapped);
            }
        } catch (error) {
            console.error('Failed to load students', error);
            showNotification('Failed to load students', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique classes for dropdown
    const uniqueClasses = useMemo(() => {
        const classes = students.map(s => s.class).filter(Boolean);
        return [...new Set(classes)].sort();
    }, [students]);

    // Filtered students
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesRollNo = !rollNoFilter ||
                (s.rollNo && s.rollNo.toLowerCase().includes(rollNoFilter.toLowerCase())) ||
                (s.studentId && s.studentId.toLowerCase().includes(rollNoFilter.toLowerCase()));
            const matchesClass = !classFilter || s.class === classFilter;
            return matchesRollNo && matchesClass;
        });
    }, [students, rollNoFilter, classFilter]);

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowForm(true);
    };

    const handleDelete = (student) => {
        setDeleteDialog({ isOpen: true, student });
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`/api/students/${deleteDialog.student.id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                logActivity('Student Deleted', `Deleted student: ${deleteDialog.student.name}`);
                showNotification('Student deleted successfully', 'success');
                loadStudents();
                setDeleteDialog({ isOpen: false, student: null });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showNotification('Failed to delete student', 'error');
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingStudent(null);
        loadStudents();
    };

    const columns = [
        { key: 'rollNo', label: 'Roll No', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'course', label: 'Course', sortable: true },
        { key: 'semester', label: 'Semester', sortable: true },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'phone', label: 'Phone', sortable: false },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'Active'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        title="Edit Student"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete Student"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Student Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Manage all student records</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Student
                </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Roll No Search */}
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Roll No</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                value={rollNoFilter}
                                onChange={(e) => setRollNoFilter(e.target.value)}
                                placeholder="Search roll number..."
                                className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Class Filter */}
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Class</label>
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                        >
                            <option value="">All Classes</option>
                            {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(rollNoFilter || classFilter) && (
                        <button
                            onClick={() => { setRollNoFilter(''); setClassFilter(''); }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}

                    {/* Stats */}
                    <div className="flex gap-2 ml-auto">
                        <span className="px-2.5 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {filteredStudents.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredStudents}
                compact={true}
                loading={isLoading}
                searchable={false}
                emptyMessage="No students found. Add your first student!"
            />

            {/* Student Form Modal */}
            {showForm && (
                <StudentForm
                    student={editingStudent}
                    onClose={closeForm}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Student"
                message={`Are you sure you want to delete ${deleteDialog.student?.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, student: null })}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default StudentsPage;
