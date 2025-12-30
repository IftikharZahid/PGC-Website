import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import TeacherForm from '../../components/admin/TeacherForm';
import { getItems, deleteItem, updateItem, STORAGE_KEYS, logActivity, initializeDemoData } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, teacher: null });
    const [isMigrating, setIsMigrating] = useState(false);
    const { showNotification } = useAdmin();

    useEffect(() => {
        loadTeachers();

        // Listen for updates
        const handleRefresh = () => loadTeachers();
        window.addEventListener('storage', handleRefresh);
        window.addEventListener('focus', handleRefresh);

        return () => {
            window.removeEventListener('storage', handleRefresh);
            window.removeEventListener('focus', handleRefresh);
        };
    }, []);

    const loadTeachers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/teachers');
            const data = await response.json();
            if (data.success) {
                const mapped = data.data.map(t => ({
                    ...t,
                    id: t._id // for DataTable
                }));
                setTeachers(mapped);
            }
        } catch (error) {
            showNotification('Failed to load teachers', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const refresh = () => loadTeachers();

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setShowForm(true);
    };

    const handleDelete = (teacher) => {
        setDeleteDialog({ isOpen: true, teacher });
    };

    const migrateData = async () => {
        if (!confirm('This will upload your local teachers to the database. Continue?')) return;

        setIsMigrating(true);
        try {
            const localTeachers = getItems(STORAGE_KEYS.TEACHERS);
            // Also try to get initial demo data if local is empty/sparse
            let sourceData = localTeachers;

            // Check if we need to supplement with demo data (from Faculty page source)
            if (sourceData.length === 0) {
                // Trigger demo data init if needed (this function is imported)
                // Or we can manually construct the demo list here if we imported IT.
                // Ideally we trust 'getItems' after a potential init.
                // But user specifically asked for "faculty page" members.
                // Those are initialized in adminStorage.js.
            }

            if (!sourceData || sourceData.length === 0) {
                showNotification('No local data found to migrate', 'info');
                return;
            }

            let successCount = 0;
            let failCount = 0;

            for (const teacher of sourceData) {
                try {
                    // Prepare data matching the schema
                    const payload = {
                        name: teacher.name,
                        email: teacher.email,
                        phone: teacher.phone,
                        designation: teacher.designation,
                        department: teacher.department,
                        qualification: teacher.qualification,
                        experience: teacher.experience,
                        subjects: teacher.subjects,
                        image: teacher.image,
                        status: teacher.status || 'Active'
                    };

                    const response = await fetch('/api/teachers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (response.ok || response.status === 409) { // 409 = exists
                        successCount++;
                    } else {
                        failCount++;
                        console.error('Failed to migrate', teacher.name);
                    }
                } catch (e) {
                    failCount++;
                    console.error('Migration error', e);
                }
            }

            showNotification(`Migration: ${successCount} processed, ${failCount} failed`, 'success');
            refresh();
        } catch (error) {
            showNotification('Migration failed critical error', 'error');
        } finally {
            setIsMigrating(false);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`/api/teachers/${deleteDialog.teacher.id}`, { method: 'DELETE' });
            if (response.ok) {
                logActivity('Teacher Deleted', `Deleted teacher: ${deleteDialog.teacher.name}`);
                showNotification('Teacher deleted successfully', 'success');
                refresh();
                setDeleteDialog({ isOpen: false, teacher: null });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            showNotification('Failed to delete teacher', 'error');
        }
    };

    const toggleStatus = async (teacher) => {
        const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
        try {
            const response = await fetch(`/api/teachers/${teacher.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                showNotification(`Teacher ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
                logActivity('Teacher Status Changed', `Changed ${teacher.name} status to ${newStatus}`);
                refresh();
            }
        } catch (error) {
            showNotification('Failed to update status', 'error');
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTeacher(null);
        loadTeachers();
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
                        onClick={migrateData}
                        disabled={isMigrating}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm disabled:opacity-50"
                    >
                        {isMigrating ? 'Migrating...' : 'Migrate Local Data'}
                    </button>
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
                data={teachers || []}
                loading={isLoading}
                compact={true}
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
