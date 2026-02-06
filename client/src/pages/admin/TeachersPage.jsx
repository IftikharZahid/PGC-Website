import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import TeacherForm from '../../components/admin/TeacherForm';
import { logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';
import {
    useGetTeachersQuery,
    useDeleteTeacherMutation,
    useUpdateTeacherMutation
} from '../../store/api/teachersApi';

const TeachersPage = () => {
    // RTK Query hooks
    const { data: teachersData, isLoading } = useGetTeachersQuery();
    const [deleteTeacher] = useDeleteTeacherMutation();
    const [updateTeacher] = useUpdateTeacherMutation();

    const teachers = teachersData?.success ? teachersData.data.map(t => ({ ...t, id: t._id })) : [];

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, teacher: null });
    const { showNotification } = useAdmin();

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setShowForm(true);
    };

    const handleDelete = (teacher) => {
        setDeleteDialog({ isOpen: true, teacher });
    };

    const confirmDelete = async () => {
        try {
            await deleteTeacher(deleteDialog.teacher.id).unwrap();
            logActivity('Teacher Deleted', `Deleted teacher: ${deleteDialog.teacher.name}`);
            showNotification('Teacher deleted successfully', 'success');
            setDeleteDialog({ isOpen: false, teacher: null });
        } catch (error) {
            showNotification(error.data?.message || 'Failed to delete teacher', 'error');
        }
    };

    const toggleStatus = async (teacher) => {
        const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await updateTeacher({ id: teacher.id, status: newStatus }).unwrap();
            showNotification(`Teacher ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
            logActivity('Teacher Status Changed', `Changed ${teacher.name} status to ${newStatus}`);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to update status', 'error');
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTeacher(null);
    };

    const columns = [
        {
            key: 'image',
            label: 'Photo',
            sortable: false,
            width: '60px',
            render: (value) => (
                <img
                    src={value || 'https://via.placeholder.com/40'}
                    alt="Teacher"
                    className="w-10 h-10 rounded-full object-cover"
                />
            )
        },
        { key: 'name', label: 'Name', sortable: true },
        {
            key: 'subjects',
            label: 'Subjects',
            sortable: false,
            render: (value) => (
                <div className="flex flex-wrap gap-1">
                    {value && value.map((subject, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 rounded text-xs font-medium">
                            {subject}
                        </span>
                    ))}
                </div>
            )
        },
        { key: 'designation', label: 'Designation', sortable: true },
        { key: 'department', label: 'Dept', sortable: true },
        { key: 'qualification', label: 'Qualification', sortable: true },
        { key: 'phone', label: 'Phone', sortable: false },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value, row) => (
                <button
                    onClick={() => toggleStatus(row)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${value === 'Active'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                        }`}
                >
                    {value}
                </button>
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
                        title="Edit Teacher"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete Teacher"
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
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teacher Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Manage faculty and staff records</p>
                </div>
                <div className="flex gap-2">

                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Teacher
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={teachers}
                loading={isLoading}
                compact={true}
                disablePagination={true}
                searchPlaceholder="Search teachers by name, subject, email..."
                emptyMessage="No teachers found. Add your first teacher!"
            />

            {/* Teacher Form Modal */}
            {showForm && (
                <TeacherForm
                    teacher={editingTeacher}
                    onClose={closeForm}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Teacher"
                message={`Are you sure you want to delete ${deleteDialog.teacher?.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, teacher: null })}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default TeachersPage;
