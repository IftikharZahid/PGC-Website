import { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Table2, X, Save, ChevronLeft } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ResultForm from '../../components/admin/ResultForm';
import { logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';
import {
    useGetResultsQuery,
    useDeleteResultMutation,
    useTogglePublishResultMutation,
    useUpdateResultMutation
} from '../../store/api/resultsApi';

const ResultsPage = () => {
    // RTK Query hooks
    const { data: resultsData, isLoading, isError, error: queryError } = useGetResultsQuery();
    const [deleteResult] = useDeleteResultMutation();
    const [togglePublishResult] = useTogglePublishResultMutation();
    const [updateResult] = useUpdateResultMutation();

    const results = resultsData?.data || [];

    const [showForm, setShowForm] = useState(false);
    const [editingResult, setEditingResult] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, result: null });
    const { showNotification } = useAdmin();

    // Sheet View State
    const [showSheetView, setShowSheetView] = useState(false);
    const [sheetData, setSheetData] = useState([]);
    const [isSavingSheet, setIsSavingSheet] = useState(false);

    // Column Resizing State
    const [columnWidths, setColumnWidths] = useState({});
    const [resizing, setResizing] = useState(null);

    // Constants
    const MIN_COLUMN_WIDTH = 50;
    const DEFAULT_WIDTHS = {
        index: 40,
        rollName: 180,
        fatherName: 140,
        subject: 70,
        total: 60,
        obtained: 60,
        percentage: 60,
        grade: 50,
        position: 50
    };

    // Filters
    const [searchFilter, setSearchFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Error handling
    useEffect(() => {
        if (isError) {
            showNotification(queryError?.data?.message || 'Failed to fetch results', 'error');
        }
    }, [isError, queryError]);

    // Unique values for filters
    const uniqueCourses = useMemo(() => {
        return [...new Set(results.map(r => r.class).filter(Boolean))].sort();
    }, [results]);

    // Filtered results
    const filteredResults = useMemo(() => {
        return results.filter(r => {
            const rName = r.name || '';
            const rRoll = r.roll || '';
            const rClass = r.class || '';

            const matchesSearch = !searchFilter ||
                rName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                rRoll.toLowerCase().includes(searchFilter.toLowerCase());

            const matchesCourse = !courseFilter || rClass === courseFilter;

            const matchesStatus = !statusFilter ||
                (statusFilter === 'published' && r.isPublished) ||
                (statusFilter === 'unpublished' && !r.isPublished);

            return matchesSearch && matchesCourse && matchesStatus;
        });
    }, [results, searchFilter, courseFilter, statusFilter]);

    const handleEdit = (result) => {
        setEditingResult(result);
        setShowForm(true);
    };

    const handleDelete = (result) => { setDeleteDialog({ isOpen: true, result }); };

    const confirmDelete = async () => {
        try {
            await deleteResult(deleteDialog.result._id).unwrap();
            logActivity('Result Deleted', `Deleted result for: ${deleteDialog.result.name}`);
            showNotification('Result deleted successfully', 'success');
            setDeleteDialog({ isOpen: false, result: null });
        } catch (error) {
            showNotification(error.data?.message || 'Failed to delete result', 'error');
        }
    };

    const togglePublish = async (result) => {
        const id = result._id || result.id;
        try {
            const data = await togglePublishResult(id).unwrap();
            const newStatus = data.data.isPublished;
            logActivity('Result Publication Toggled', `${newStatus ? 'Published' : 'Unpublished'} result for: ${result.name}`);
            showNotification(`Result ${newStatus ? 'published' : 'unpublished'} successfully`, 'success');
        } catch (error) {
            showNotification(error.data?.message || 'Failed to toggle status', 'error');
        }
    };


    const closeForm = () => { setShowForm(false); setEditingResult(null); };

    // Mobile Detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Column Resize Handlers
    const handleResizeStart = (e, key) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent sorting or other events
        const startX = e.pageX;
        const startWidth = columnWidths[key] || DEFAULT_WIDTHS[key] || 100;
        setResizing({ key, startX, startWidth });
    };

    const handleResizeMove = (e) => {
        if (!resizing) return;
        const diff = e.pageX - resizing.startX;
        const newWidth = Math.max(MIN_COLUMN_WIDTH, resizing.startWidth + diff);
        setColumnWidths(prev => ({
            ...prev,
            [resizing.key]: newWidth
        }));
    };

    const handleResizeEnd = () => {
        setResizing(null);
    };

    const handleKeyDown = (e, index, colKey) => {
        // Define navigation order
        const subjectKeys = allSubjects.map(s => `subject_${s}`);
        const colOrder = ['name', 'roll', 'fatherName', ...subjectKeys];
        const colIndex = colOrder.indexOf(colKey);

        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextRowIndex = index + 1;
            if (nextRowIndex < sheetData.length) {
                const nextInputId = `sheet-input-${nextRowIndex}-${colKey}`;
                const nextInput = document.getElementById(nextInputId);
                if (nextInput) {
                    nextInput.focus();
                    if (e.key === 'Enter') nextInput.select();
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevRowIndex = index - 1;
            if (prevRowIndex >= 0) {
                const prevInputId = `sheet-input-${prevRowIndex}-${colKey}`;
                const prevInput = document.getElementById(prevInputId);
                if (prevInput) {
                    prevInput.focus();
                    prevInput.select();
                }
            }
        } else if (e.key === 'ArrowRight') {
            // For text inputs, only navigate if cursor is at the end
            if (e.target.type === 'text') {
                if (e.target.selectionStart < e.target.value.length) return;
            }

            e.preventDefault();
            if (colIndex < colOrder.length - 1) {
                const nextColKey = colOrder[colIndex + 1];
                const nextInputId = `sheet-input-${index}-${nextColKey}`;
                const nextInput = document.getElementById(nextInputId);
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        } else if (e.key === 'ArrowLeft') {
            // For text inputs, only navigate if cursor is at the start
            if (e.target.type === 'text') {
                if (e.target.selectionStart > 0) return;
            }

            e.preventDefault();
            if (colIndex > 0) {
                const prevColKey = colOrder[colIndex - 1];
                const prevInputId = `sheet-input-${index}-${prevColKey}`;
                const prevInput = document.getElementById(prevInputId);
                if (prevInput) {
                    prevInput.focus();
                    prevInput.select();
                }
            }
        }
    };

    // Add global event listeners for resize drag
    useEffect(() => {
        if (resizing) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);
            return () => {
                window.removeEventListener('mousemove', handleResizeMove);
                window.removeEventListener('mouseup', handleResizeEnd);
            };
        }
    }, [resizing]);

    // Sheet View Functions
    const getFormattedSheetData = (sourceResults) => {
        return sourceResults.map(r => ({
            _id: r._id,
            roll: r.roll || '',
            name: r.name || '',
            fatherName: r.fatherName || '',
            class: r.class || '',
            session: r.session || '',
            marks: { ...r.marks } || {},
            totalMarks: r.totalMarks || 0,
            obtainedMarks: r.obtainedMarks || 0,
            percentage: r.percentage || 0,
            grade: r.grade || '',
            position: r.position || '',
            isPublished: r.isPublished || false
        }));
    };

    const openSheetView = () => {
        const data = getFormattedSheetData(filteredResults);

        // Initialize column widths if not set (or if subjects changed)
        setColumnWidths(prev => {
            const newWidths = { ...prev };
            // Ensure core columns have defaults
            Object.keys(DEFAULT_WIDTHS).forEach(k => {
                if (!newWidths[k]) newWidths[k] = DEFAULT_WIDTHS[k];
            });
            // Ensure subject columns have defaults
            const subjects = new Set();
            data.forEach(r => {
                if (r.marks) Object.keys(r.marks).forEach(s => subjects.add(s));
            });
            subjects.forEach(s => {
                if (!newWidths[`subject_${s}`]) newWidths[`subject_${s}`] = DEFAULT_WIDTHS.subject;
            });
            return newWidths;
        });

        setSheetData(data);
        setShowSheetView(true);
    };

    const handleSheetClassChange = (newClass) => {
        setCourseFilter(newClass);
        // We need to re-filter based on the "base" results from API + search + NEW class + status
        // Since `filteredResults` is derived, we can't just use it directly after setting state (async).
        // Instead, we manually filter from `results` here for immediate UI update, 
        // OR rely on `useEffect` but `sheetData` is separate state.

        // Better approach: Re-run the filter logic on `results` with the new class
        let filtered = results;
        if (searchFilter) {
            const lowerDate = searchFilter.toLowerCase();
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(lowerDate) ||
                item.roll?.toLowerCase().includes(lowerDate)
            );
        }
        if (newClass) {
            filtered = filtered.filter(item => item.class === newClass);
        }
        if (statusFilter) {
            filtered = filtered.filter(item => statusFilter === 'published' ? item.isPublished : !item.isPublished);

        }

        const data = getFormattedSheetData(filtered);
        setSheetData(data);
    };

    const updateSheetCell = (index, field, value, subject = null) => {
        setSheetData(prev => {
            const updated = [...prev];
            if (subject) {
                // Update subject mark
                updated[index].marks = {
                    ...updated[index].marks,
                    [subject]: value === '' ? 0 : Number(value)
                };
                // Recalculate totals
                const marks = updated[index].marks;
                const obtained = Object.values(marks).reduce((sum, m) => sum + (Number(m) || 0), 0);
                const total = Object.keys(marks).length * 100; // Assuming 100 max per subject
                updated[index].obtainedMarks = obtained;
                updated[index].totalMarks = total;
                updated[index].percentage = total > 0 ? ((obtained / total) * 100).toFixed(2) : 0;
                updated[index].grade = calculateGrade(updated[index].percentage);
            } else {
                updated[index] = {
                    ...updated[index],
                    [field]: value
                };
            }
            return updated;
        });
    };

    const calculateGrade = (percentage) => {
        const p = Number(percentage);
        if (p >= 90) return 'A+';
        if (p >= 80) return 'A';
        if (p >= 70) return 'B';
        if (p >= 60) return 'C';
        if (p >= 50) return 'D';
        if (p >= 40) return 'E';
        return 'F';
    };

    const saveSheetData = async () => {
        setIsSavingSheet(true);
        try {
            // Save each modified result
            const promises = sheetData.map(item => updateResult({
                id: item._id,
                name: item.name,
                roll: item.roll,
                fatherName: item.fatherName,
                class: item.class,
                session: item.session,
                marks: item.marks,
                totalMarks: item.totalMarks,
                obtainedMarks: item.obtainedMarks,
                percentage: item.percentage,
                grade: item.grade
            }).unwrap());

            await Promise.all(promises);
            showNotification('Sheet data saved successfully', 'success');
            setShowSheetView(false);
        } catch (error) {
            showNotification('Failed to save sheet data', 'error');
        } finally {
            setIsSavingSheet(false);
        }
    };



    // Get all unique subjects from results
    const allSubjects = useMemo(() => {
        const subjects = new Set();
        filteredResults.forEach(r => {
            if (r.marks) {
                Object.keys(r.marks).forEach(s => subjects.add(s));
            }
        });
        return Array.from(subjects).sort();
    }, [filteredResults]);

    // Stats
    const publishedCount = filteredResults.filter(r => r.isPublished).length;

    // Define columns matching the Mongoose Schema EXACTLY
    const columns = [
        { key: 'name', label: 'Student', sortable: true },
        { key: 'roll', label: 'Roll No', sortable: true },
        { key: 'class', label: 'Class', sortable: true },
        { key: 'session', label: 'Session', sortable: true },
        {
            key: 'obtainedMarks',
            label: 'Marks',
            sortable: true,
            render: (v, row) => `${row.obtainedMarks || 0}/${row.totalMarks || 0}`
        },
        {
            key: 'percentage',
            label: '%',
            sortable: true,
            render: (v) => `${Number(v || 0).toFixed(1)}%`
        },
        { key: 'grade', label: 'Grade', sortable: true },
        {
            key: 'isPublished',
            label: 'Status',
            sortable: true,
            render: (value, row) => (
                <button
                    onClick={(e) => { e.stopPropagation(); togglePublish(row); }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${value ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                    {value ? 'Published' : 'Draft'}
                </button>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEdit(row)} className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(row)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
            )
        }
    ];

    const getRowClassName = (row) => row.isPublished ? '' : 'bg-gray-50 dark:bg-gray-800/50 opacity-75 grayscale';

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Results Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Manage student exam results</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={openSheetView}
                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors font-semibold text-xs shadow-sm"
                    >
                        <Table2 className="w-3.5 h-3.5" /> SheetView
                    </button>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-semibold text-xs shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add Result
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student / Roll No</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                placeholder="Search students..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Course Filter */}
                    <div className="min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Class</label>
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">All Classes</option>
                            {uniqueCourses.map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">All Statuses</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Draft</option>
                        </select>
                    </div>

                    {/* Stats Badge */}
                    <div className="flex gap-2 ml-auto">
                        <div className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-[10px] font-semibold border border-primary-100 dark:border-primary-800">
                            Total: {filteredResults.length}
                        </div>
                        <div className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-[10px] font-semibold border border-green-100 dark:border-green-800">
                            Pub: {publishedCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredResults}
                loading={isLoading}
                compact={true}
                disablePagination={true} // Show all records in scrollable view
                emptyMessage="No results found matching your filters."
                searchable={false} // We have a custom search bar
                rowClassName={getRowClassName}
            />

            {/* Modals */}
            {showForm && (
                <ResultForm
                    result={editingResult}
                    onClose={closeForm}
                />
            )}

            {deleteDialog.isOpen && (
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    title="Delete Result"
                    message={`Are you sure you want to delete the result for ${deleteDialog.result?.name}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialog({ isOpen: false, result: null })}
                    confirmText="Delete Result"
                    type="danger"
                />
            )}

            {/* Sheet View Modal */}
            {showSheetView && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-[98vw] h-full sm:h-[95vh] flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Sheet Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-20">
                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                <button
                                    onClick={() => setShowSheetView(false)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                                <div>
                                    <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex flex-wrap items-center gap-1 sm:gap-2">
                                        <Table2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
                                        <span>Result of</span>
                                        <select
                                            value={courseFilter}
                                            onChange={(e) => handleSheetClassChange(e.target.value)}
                                            className="ml-0.5 text-xs sm:text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 outline-none hover:border-gray-400 font-bold text-primary-600 cursor-pointer py-0.5 max-w-[120px] sm:max-w-none truncate"
                                        >
                                            <option value="">All Classes</option>
                                            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </h2>
                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                        Session {filteredResults[0]?.session || 'Current Session'} • {sheetData.length} Records • Editable
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={saveSheetData}
                                    disabled={isSavingSheet}
                                    className={`flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-1.5 text-white rounded-lg transition-all font-medium text-xs sm:text-sm shadow-sm ${isSavingSheet
                                        ? 'bg-primary-400 cursor-wait'
                                        : 'bg-primary-600 hover:bg-primary-700 hover:shadow active:scale-95'
                                        }`}
                                >
                                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {isSavingSheet ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => setShowSheetView(false)}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Sheet Table Container */}
                        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50 relative select-none">
                            <table className="text-xs border-separate border-spacing-0 table-fixed" style={{ width: 'max-content' }}>
                                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-20 shadow-sm h-10">
                                    <tr>
                                        {[
                                            { key: 'index', label: '#', fixed: true, left: 0 },
                                            { key: 'rollName', label: 'Roll No & Name', fixed: !isMobile, left: columnWidths['index'] || DEFAULT_WIDTHS['index'] },
                                            { key: 'fatherName', label: 'Father Name' },
                                            ...allSubjects.map(s => ({ key: `subject_${s}`, label: s, isSubject: true, realKey: s })),
                                            { key: 'total', label: 'Total' },
                                            { key: 'obtained', label: 'Obt.' },
                                            { key: 'percentage', label: '%' },
                                            { key: 'grade', label: 'Grd' },
                                            { key: 'position', label: 'Pos' }
                                        ].map((col, idx) => {
                                            const width = columnWidths[col.key] || DEFAULT_WIDTHS[col.isSubject ? 'subject' : col.key] || 100;
                                            const isResizing = resizing?.key === col.key;

                                            // Determine styles for sticky columns
                                            const style = {
                                                width: `${width}px`,
                                                minWidth: `${width}px`,
                                                maxWidth: `${width}px`,
                                            };

                                            if (col.fixed) {
                                                style.position = 'sticky';
                                                style.left = col.left;
                                                style.zIndex = 30;
                                            }

                                            return (
                                                <th
                                                    key={col.key}
                                                    style={style}
                                                    className={`
                                                        relative px-2 py-2 text-center font-bold text-gray-700 dark:text-gray-300 border-b border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800
                                                        ${col.fixed ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                                                        ${col.isSubject ? 'bg-white/50 dark:bg-gray-800/50' : ''}
                                                    `}
                                                >
                                                    <div className="truncate px-1">{col.label}</div>

                                                    {/* Resizer Handle */}
                                                    <div
                                                        onMouseDown={(e) => handleResizeStart(e, col.key)}
                                                        className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-primary-500/50 active:bg-primary-500 z-40 transition-colors ${isResizing ? 'bg-primary-500' : 'bg-transparent'}`}
                                                    />
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sheetData.map((row, index) => (
                                        <tr key={row._id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors bg-white dark:bg-gray-900 h-10">
                                            {/* Index Column */}
                                            <td
                                                style={{ width: columnWidths['index'] || DEFAULT_WIDTHS['index'], left: 0 }}
                                                className="sticky z-10 bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 px-2 border-b border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-center font-mono text-[10px]"
                                            >
                                                {index + 1}
                                            </td>

                                            {/* Roll & Name Column */}
                                            <td
                                                style={{ width: columnWidths['rollName'] || DEFAULT_WIDTHS['rollName'], left: columnWidths['index'] || DEFAULT_WIDTHS['index'] }}
                                                className={`${!isMobile ? 'sticky z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''} bg-white dark:bg-gray-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 px-0 border-b border-r border-gray-200 dark:border-gray-700`}
                                            >
                                                <div className="flex flex-col px-2 justify-center h-full">
                                                    <input
                                                        id={`sheet-input-${index}-name`}
                                                        type="text"
                                                        value={row.name}
                                                        onChange={(e) => updateSheetCell(index, 'name', e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, index, 'name')}
                                                        placeholder="Name"
                                                        className="w-full bg-transparent font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-xs truncate"
                                                    />
                                                    <input
                                                        id={`sheet-input-${index}-roll`}
                                                        type="text"
                                                        value={row.roll}
                                                        onChange={(e) => updateSheetCell(index, 'roll', e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, index, 'roll')}
                                                        placeholder="Roll No"
                                                        className="w-full bg-transparent text-[10px] text-gray-500 dark:text-gray-400 focus:outline-none font-mono truncate"
                                                    />
                                                </div>
                                            </td>

                                            {/* Father Name */}
                                            <td style={{ width: columnWidths['fatherName'] || DEFAULT_WIDTHS['fatherName'] }} className="px-0 border-b border-r border-gray-200 dark:border-gray-700">
                                                <input
                                                    id={`sheet-input-${index}-fatherName`}
                                                    type="text"
                                                    value={row.fatherName || ''}
                                                    onChange={(e) => updateSheetCell(index, 'fatherName', e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, index, 'fatherName')}
                                                    className="w-full h-full px-2 bg-transparent text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-inset focus:ring-primary-500 outline-none transition-all placeholder-gray-300 truncate"
                                                    placeholder="Father Name"
                                                />
                                            </td>

                                            {/* Subjects */}
                                            {allSubjects.map(subject => {
                                                const width = columnWidths[`subject_${subject}`] || DEFAULT_WIDTHS.subject;
                                                return (
                                                    <td key={subject} style={{ width }} className="px-0 border-b border-r border-gray-200 dark:border-gray-700">
                                                        <input
                                                            id={`sheet-input-${index}-subject_${subject}`}
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={row.marks?.[subject] || ''}
                                                            onChange={(e) => updateSheetCell(index, null, e.target.value, subject)}
                                                            onKeyDown={(e) => handleKeyDown(e, index, `subject_${subject}`)}
                                                            className={`w-full h-full px-1 text-center bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-inset focus:ring-primary-500 outline-none transition-all font-mono ${!row.marks?.[subject] ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                );
                                            })}

                                            {/* Calculated Columns */}
                                            <td style={{ width: columnWidths['total'] || DEFAULT_WIDTHS['total'] }} className="px-1 border-b border-r border-gray-200 dark:border-gray-700 text-center font-medium text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 font-mono truncate">
                                                {row.totalMarks || 0}
                                            </td>
                                            <td style={{ width: columnWidths['obtained'] || DEFAULT_WIDTHS['obtained'] }} className="px-1 border-b border-r border-gray-200 dark:border-gray-700 text-center font-bold text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-gray-800/50 font-mono truncate">
                                                {row.obtainedMarks || 0}
                                            </td>
                                            <td style={{ width: columnWidths['percentage'] || DEFAULT_WIDTHS['percentage'] }} className="px-1 border-b border-r border-gray-200 dark:border-gray-700 text-center font-bold text-primary-600 dark:text-primary-400 bg-green-50/30 dark:bg-green-900/10 font-mono truncate">
                                                {Number(row.percentage || 0).toFixed(1)}%
                                            </td>
                                            <td style={{ width: columnWidths['grade'] || DEFAULT_WIDTHS['grade'] }} className={`px-1 border-b border-r border-gray-200 dark:border-gray-700 text-center font-bold bg-purple-50/30 dark:bg-purple-900/10 truncate ${row.grade === 'A+' || row.grade === 'A' ? 'text-green-600 dark:text-green-400' : row.grade === 'F' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {row.grade || '-'}
                                            </td>
                                            <td style={{ width: columnWidths['position'] || DEFAULT_WIDTHS['position'] }} className="px-1 border-b border-gray-200 dark:border-gray-700 text-center font-semibold text-gray-600 dark:text-gray-400 bg-orange-50/30 dark:bg-orange-900/10 text-[10px] truncate">
                                                {row.position ? `#${row.position}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sheet Footer */}
                        <div className="px-4 sm:px-6 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-500"></div> Editable Cells</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div> Auto-calculated</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Subjects: <strong className="text-gray-900 dark:text-gray-100">{allSubjects.length}</strong>
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Students: <strong className="text-gray-900 dark:text-gray-100">{sheetData.length}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
