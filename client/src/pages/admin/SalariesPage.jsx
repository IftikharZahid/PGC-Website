import { useState } from 'react';
import { DollarSign, Edit2, CheckCircle, Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import TeacherForm from '../../components/admin/TeacherForm'; // Reusing TeacherForm for adding new staff
import SalaryForm from '../../components/admin/SalaryForm';
import { getItems, updateItem, deleteItem, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const SalariesPage = () => {
    const loadTeachers = () => {
        const rawTeachers = getItems(STORAGE_KEYS.TEACHERS);
        return rawTeachers.map(t => ({
            ...t,
            salary: t.salary || 0,
            accountNumber: t.accountNumber || '',
            lastPaid: t.lastPaid || null,
            status: t.status || 'Active'
        }));
    };

    const [teachers, setTeachers] = useState(loadTeachers());
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, teacher: null });
    const { showNotification } = useAdmin();

    const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);

    const refresh = () => setTeachers(loadTeachers());

    const handleEditSalary = (teacher) => {
        setEditingSalary(teacher);
    };

    const handleAddSalary = () => {
        setIsAddSalaryOpen(true);
    };

    const handleDelete = (teacher) => {
        setDeleteDialog({ isOpen: true, teacher });
    };

    const confirmDelete = () => {
        try {
            deleteItem(STORAGE_KEYS.TEACHERS, deleteDialog.teacher.id);
            logActivity('Staff Deleted', `Deleted staff member: ${deleteDialog.teacher.name}`);
            showNotification('Staff member deleted successfully', 'success');
            refresh();
            setDeleteDialog({ isOpen: false, teacher: null });
        } catch (error) {
            showNotification('Failed to delete staff member', 'error');
        }
    };

    const markAsPaid = (teacher) => {
        const today = new Date().toISOString();
        updateItem(STORAGE_KEYS.TEACHERS, teacher.id, { lastPaid: today });
        logActivity('Salary Paid', `Paid salary to ${teacher.name}`);
        showNotification(`Marked ${teacher.name} as paid for this month`, 'success');
        refresh();
    };

    const markAsUnpaid = (teacher) => {
        if (window.confirm(`Are you sure you want to revert payment status for ${teacher.name}?`)) {
            updateItem(STORAGE_KEYS.TEACHERS, teacher.id, { lastPaid: null });
            logActivity('Salary Reverted', `Reverted salary status for ${teacher.name}`);
            showNotification(`Payment status reverted for ${teacher.name}`, 'info');
            refresh();
        }
    };

    const isPaidThisMonth = (dateString) => {
        if (!dateString) return false;
        const paidDate = new Date(dateString);
        const now = new Date();
        return paidDate.getMonth() === now.getMonth() &&
            paidDate.getFullYear() === now.getFullYear();
    };

    const closeModals = () => {
        setIsAddOpen(false);
        setEditingSalary(null);
        setIsAddSalaryOpen(false);
        refresh();
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
                    alt="Staff"
                    className="w-10 h-10 rounded-full object-cover"
                />
            )
        },
        { key: 'name', label: 'Staff Name', sortable: true },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
            render: (value, row) => row.subjects ? row.subjects.join(', ') : value || 'General Staff'
        },
        {
            key: 'salary',
            label: 'Base Salary',
            sortable: true,
            render: (value) => `PKR ${(value || 0).toLocaleString()}`
        },
        {
            key: 'lastPaid',
            label: 'Status (Current Month)',
            sortable: true,
            render: (value, row) => {
                const isPaid = isPaidThisMonth(value);
                const hasSalary = row.salary && row.salary > 0;

                if (!hasSalary) {
                    return (
                        <button
                            onClick={() => handleEditSalary(row)}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-xs hover:bg-orange-200 transition border border-orange-200 font-medium"
                        >
                            Set Salary
                        </button>
                    );
                }

                return isPaid ? (
                    <button
                        onClick={() => markAsUnpaid(row)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit hover:bg-green-200 transition cursor-pointer border border-transparent hover:border-green-300"
                        title="Click to revert to Unpaid"
                    >
                        <CheckCircle className="w-3 h-3" /> Paid
                    </button>
                ) : (
                    <button
                        onClick={() => markAsPaid(row)}
                        className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs hover:bg-primary-700 transition"
                    >
                        Mark as Paid
                    </button>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEditSalary(row)}
                        className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        title="Edit Salary Details"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete Staff"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];



    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Staff Salaries</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Manage payroll and salary disbursements</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-200 hidden sm:block">
                        Total Monthly: PKR {teachers.reduce((acc, t) => acc + (parseFloat(t.salary) || 0), 0).toLocaleString()}
                    </div>
                    <button
                        onClick={handleAddSalary}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                        <DollarSign className="w-5 h-5" />
                        Set Salary
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={teachers}
                compact={true}
                searchPlaceholder="Search staff..."
                emptyMessage="No staff records found."
            />

            {/* Modals */}
            {isAddOpen && (
                <TeacherForm onClose={closeModals} />
            )}

            {isAddSalaryOpen && (
                <SalaryForm
                    onClose={closeModals}
                    onAddNew={() => setIsAddOpen(true)}
                />
            )}

            {editingSalary && (
                <SalaryForm
                    teacher={editingSalary}
                    onClose={closeModals}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Staff Member"
                message={`Are you sure you want to delete ${deleteDialog.teacher?.name}? This will remove them from both the Teachers and Salary records.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, teacher: null })}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default SalariesPage;
