import { useState } from 'react';
import { Plus, BookOpen, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import CourseForm from '../../components/admin/CourseForm';
import { getItems, deleteItem, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const CoursesPage = () => {
    const loadCourses = () => getItems(STORAGE_KEYS.COURSES);

    const [courses, setCourses] = useState(loadCourses());
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, course: null });
    const { showNotification } = useAdmin();

    const refresh = () => setCourses(loadCourses());

    // loadCourses removed


    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = (course) => {
        setDeleteDialog({ isOpen: true, course });
    };

    const confirmDelete = () => {
        try {
            deleteItem(STORAGE_KEYS.COURSES, deleteDialog.course.id);
            logActivity('Course Deleted', `Deleted course: ${deleteDialog.course.courseName}`);
            showNotification('Course deleted successfully', 'success');
            refresh();
            setDeleteDialog({ isOpen: false, course: null });
        } catch (_) {
            showNotification('Failed to delete course', 'error');
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCourse(null);
        refresh();
    };

    const columns = [
        { key: 'courseId', label: 'Course ID', sortable: true },
        { key: 'courseName', label: 'Course Name', sortable: true },
        { key: 'duration', label: 'Duration', sortable: true },
        { key: 'semesters', label: 'Semesters', sortable: true },
        {
            key: 'subjects',
            label: 'Subjects',
            sortable: false,
            render: (value) => (
                <span className="text-gray-600 dark:text-gray-400">{value.length} subjects</span>
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
                        title="Edit Course"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete Course"
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
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Course Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Manage courses and subjects</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Add Course
                </button>
            </div>

            <DataTable
                columns={columns}
                data={courses}
                compact={true}
                searchPlaceholder="Search courses..."
                emptyMessage="No courses found. Add your first course!"
            />

            {showForm && <CourseForm course={editingCourse} onClose={closeForm} />}

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Course"
                message={`Are you sure you want to delete ${deleteDialog.course?.courseName}?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, course: null })}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default CoursesPage;
