import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ResultForm from '../../components/admin/ResultForm';
import { getItems, deleteItem, updateItem, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const ResultsPage = () => {
    const loadResults = () => {
        const data = getItems(STORAGE_KEYS.RESULTS) || [];
        return data.sort((a, b) => {
            const rollA = (a && a.rollNo) ? a.rollNo : '';
            const rollB = (b && b.rollNo) ? b.rollNo : '';
            return rollA.localeCompare(rollB, undefined, { numeric: true });
        });
    };

    const [results, setResults] = useState(loadResults());
    const [showForm, setShowForm] = useState(false);
    const [editingResult, setEditingResult] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, result: null });
    const { showNotification } = useAdmin();

    // Filters
    const [searchFilter, setSearchFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const refresh = () => setResults(loadResults());

    // Unique values for filters
    const uniqueCourses = useMemo(() => [...new Set(results.map(r => r.course).filter(Boolean))].sort(), [results]);
    const uniqueSemesters = useMemo(() => [...new Set(results.map(r => r.semester).filter(Boolean))].sort(), [results]);

    // Filtered results
    const filteredResults = useMemo(() => {
        return results.filter(r => {
            const matchesSearch = !searchFilter ||
                r.studentName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                r.rollNo?.toLowerCase().includes(searchFilter.toLowerCase());
            const matchesCourse = !courseFilter || r.course === courseFilter;
            const matchesSemester = !semesterFilter || r.semester === semesterFilter;
            const matchesStatus = !statusFilter ||
                (statusFilter === 'published' && r.isPublished) ||
                (statusFilter === 'unpublished' && !r.isPublished);
            return matchesSearch && matchesCourse && matchesSemester && matchesStatus;
        });
    }, [results, searchFilter, courseFilter, semesterFilter, statusFilter]);

    const handleEdit = (result) => { setEditingResult(result); setShowForm(true); };
    const handleDelete = (result) => { setDeleteDialog({ isOpen: true, result }); };

    const confirmDelete = () => {
        try {
            deleteItem(STORAGE_KEYS.RESULTS, deleteDialog.result.id);
            logActivity('Result Deleted', `Deleted result for: ${deleteDialog.result.studentName}`);
            showNotification('Result deleted successfully', 'success');
            refresh();
            setDeleteDialog({ isOpen: false, result: null });
        } catch {
            showNotification('Failed to delete result', 'error');
        }
    };

    const togglePublish = (result) => {
        try {
            const newStatus = !result.isPublished;
            updateItem(STORAGE_KEYS.RESULTS, result.id, { isPublished: newStatus });
            logActivity('Result Publication Toggled', `${newStatus ? 'Published' : 'Unpublished'} result for: ${result.studentName}`);
            showNotification(`Result ${newStatus ? 'published' : 'unpublished'} successfully`, 'success');
            refresh();
        } catch {
            showNotification('Failed to toggle publication status', 'error');
        }
    };

    const closeForm = () => { setShowForm(false); setEditingResult(null); refresh(); };

    // Stats
    const publishedCount = filteredResults.filter(r => r.isPublished).length;

    const columns = [
        { key: 'studentName', label: 'Student', sortable: true },
        { key: 'rollNo', label: 'Roll No', sortable: true },
        { key: 'course', label: 'Course', sortable: true },
        { key: 'semester', label: 'Semester', sortable: true },
        { key: 'obtainedMarks', label: 'Marks', sortable: true, render: (v, row) => `${v}/${row.totalMarks}` },
        { key: 'percentage', label: '%', sortable: true, render: (v) => `${Number(v).toFixed(1)}%` },
        { key: 'grade', label: 'Grade', sortable: true },
        {
            key: 'isPublished', label: 'Status', sortable: true,
            render: (value, row) => (
                <button onClick={() => togglePublish(row)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${value ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    {value ? 'Published' : 'Draft'}
                </button>
            )
        },
        {
            key: 'actions', label: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="flex gap-1">
                    <button onClick={() => handleEdit(row)} className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(row)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Results Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Manage student exam results</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm">
                    <Plus className="w-4 h-4" /> Add Result
                </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Search */}
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student / Roll No</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search..." className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none" />
                        </div>
                    </div>

                    {/* Course */}
                    <div className="min-w-[120px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Course</label>
                        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All</option>
                            {uniqueCourses.map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>

                    {/* Semester */}
                    <div className="min-w-[100px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Semester</label>
                        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All</option>
                            {uniqueSemesters.map(s => (<option key={s} value={s}>{s}</option>))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="min-w-[100px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Draft</option>
                        </select>
                    </div>

                    {/* Clear */}
                    {(searchFilter || courseFilter || semesterFilter || statusFilter) && (
                        <button onClick={() => { setSearchFilter(''); setCourseFilter(''); setSemesterFilter(''); setStatusFilter(''); }} className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Clear</button>
                    )}

                    {/* Stats */}
                    <div className="flex gap-1.5 ml-auto">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px] font-bold">{publishedCount} Published</span>
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-[10px] font-bold">{filteredResults.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={filteredResults} compact={true} emptyMessage="No results found." searchable={false} />

            {showForm && <ResultForm result={editingResult} onClose={closeForm} />}

            {deleteDialog.isOpen && (
                <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Result" message={`Delete result for ${deleteDialog.result?.studentName}?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, result: null })} confirmText="Delete" type="danger" />
            )}
        </div>
    );
};

export default ResultsPage;
