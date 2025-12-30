import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell } from 'lucide-react';
import { getItems, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import AnnouncementForm from '../../components/admin/AnnouncementForm';
import SuccessDialog from '../../components/admin/SuccessDialog';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [successDialog, setSuccessDialog] = useState(null);
    const { setNotification } = useAdmin();

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = () => {
        const data = getItems(STORAGE_KEYS.ANNOUNCEMENTS);
        setAnnouncements(data);
    };

    const handleAdd = () => {
        setEditingAnnouncement(null);
        setShowForm(true);
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setShowForm(true);
    };

    const handleDelete = (announcement) => {
        setDeleteConfirm(announcement);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteItem(STORAGE_KEYS.ANNOUNCEMENTS, deleteConfirm.id);
            setNotification({ type: 'success', message: 'Announcement deleted successfully!' });
            loadAnnouncements();
            setDeleteConfirm(null);
        }
    };

    const handleSave = (formData) => {
        if (editingAnnouncement) {
            updateItem(STORAGE_KEYS.ANNOUNCEMENTS, editingAnnouncement.id, formData);
            setSuccessDialog({
                title: 'Announcement Updated',
                message: 'The announcement has been successfully updated.'
            });
        } else {
            addItem(STORAGE_KEYS.ANNOUNCEMENTS, formData);
            setSuccessDialog({
                title: 'Announcement Added',
                message: 'The new announcement has been successfully created.'
            });
        }
        setShowForm(false);
        setEditingAnnouncement(null);
        loadAnnouncements();
    };

    const columns = [
        { key: 'title', label: 'Title', sortable: true },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (type) => (
                <span className={`px - 2 py - 1 rounded - full text - xs font - medium ${type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    type === 'event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        type === 'facility' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    } `}>
                    {type}
                </span>
            )
        },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'link', label: 'Link', sortable: false },
    ];

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Announcements</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage college announcements</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Announcement</span>
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={announcements}
                compact={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Search announcements..."
                emptyMessage="No announcements found. Add one to get started!"
            />

            {/* Form Modal */}
            {showForm && (
                <AnnouncementForm
                    announcement={editingAnnouncement}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingAnnouncement(null);
                    }}
                />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Delete Announcement"
                    message={`Are you sure you want to delete "${deleteConfirm.title}" ? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}

            {/* Success Dialog */}
            {successDialog && (
                <SuccessDialog
                    isOpen={!!successDialog}
                    title={successDialog.title}
                    message={successDialog.message}
                    onConfirm={() => setSuccessDialog(null)}
                />
            )}
        </div>
    );
};

export default AnnouncementsPage;
