import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useAdmin } from '../../context/AdminContext';
import { useGetAdmissionsQuery, useUpdateAdmissionStatusMutation } from '../../store/api/admissionsApi';

const AdmissionsPage = () => {
    // RTK Query hooks
    const { data: admissionsData, isLoading } = useGetAdmissionsQuery();
    const [updateStatus] = useUpdateAdmissionStatusMutation();

    // Map API data to table structure
    const admissions = useMemo(() => {
        if (!admissionsData?.success) return [];
        return admissionsData.data.map(app => ({
            id: app.applicationId || app._id,
            _id: app._id,
            name: app.fullName,
            fatherName: app.fatherName,
            course: app.program?.desiredCourse || 'N/A',
            previousMarks: app.academic?.gpa || 'N/A',
            email: app.email,
            phone: app.phone,
            appliedDate: new Date(app.submittedAt).toLocaleDateString(),
            status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
            fullDetails: app
        }));
    }, [admissionsData]);

    const [actionDialog, setActionDialog] = useState({ isOpen: false, admission: null, action: null });
    const { showNotification } = useAdmin();

    // Filters
    const [searchFilter, setSearchFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Unique values
    const uniqueCourses = useMemo(() => [...new Set(admissions.map(a => a.course).filter(Boolean))].sort(), [admissions]);

    // Filtered admissions
    const filteredAdmissions = useMemo(() => {
        return admissions.filter(a => {
            const matchesSearch = !searchFilter ||
                a.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                a.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                a.fatherName?.toLowerCase().includes(searchFilter.toLowerCase());
            const matchesCourse = !courseFilter || a.course === courseFilter;
            const matchesStatus = !statusFilter || a.status === statusFilter;
            return matchesSearch && matchesCourse && matchesStatus;
        });
    }, [admissions, searchFilter, courseFilter, statusFilter]);

    const handleApprove = (admission) => { setActionDialog({ isOpen: true, admission, action: 'approve' }); };
    const handleReject = (admission) => { setActionDialog({ isOpen: true, admission, action: 'reject' }); };

    const confirmAction = async () => {
        const { admission, action } = actionDialog;
        try {
            const status = action === 'approve' ? 'Approved' : 'Rejected';

            await updateStatus({ id: admission._id, status }).unwrap();

            showNotification(
                `Admission ${status.toLowerCase()}${status === 'Approved' ? ' and student created' : ''}`,
                'success'
            );

            setActionDialog({ isOpen: false, admission: null, action: null });
        } catch (error) {
            console.error('Action failed:', error);
            const errorMessage = error.data?.message || 'Failed to process admission';
            showNotification(errorMessage, 'error');
        }
    };

    // Stats
    const pendingCount = filteredAdmissions.filter(a => a.status === 'Pending').length;
    const approvedCount = filteredAdmissions.filter(a => a.status === 'Approved').length;
    const rejectedCount = filteredAdmissions.filter(a => a.status === 'Rejected').length;

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'fatherName', label: 'Father', sortable: true },
        { key: 'course', label: 'Course', sortable: true },
        { key: 'previousMarks', label: 'Marks', sortable: false },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'appliedDate', label: 'Date', sortable: true },
        {
            key: 'status', label: 'Status', sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${value === 'Approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : value === 'Rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>
                        {value}
                    </span>
                    {value === 'Pending' && (
                        <div className="flex gap-0.5">
                            <button onClick={() => handleApprove(row)} className="p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleReject(row)} className="p-0.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admissions Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Review and process admission applications</p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Search */}
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Name / Email</label>
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

                    {/* Status */}
                    <div className="min-w-[100px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Clear */}
                    {(searchFilter || courseFilter || statusFilter) && (
                        <button onClick={() => { setSearchFilter(''); setCourseFilter(''); setStatusFilter(''); }} className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Clear</button>
                    )}

                    {/* Stats */}
                    <div className="flex gap-1.5 ml-auto">
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold">{pendingCount} Pending</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px] font-bold">{approvedCount} Approved</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-[10px] font-bold">{rejectedCount} Rejected</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={filteredAdmissions} loading={isLoading} compact={true} emptyMessage="No admission applications found" searchable={false} />

            <ConfirmDialog
                isOpen={actionDialog.isOpen}
                title={actionDialog.action === 'approve' ? 'Approve Admission' : 'Reject Admission'}
                message={actionDialog.action === 'approve' ? `Approve ${actionDialog.admission?.name}? A student account will be created.` : `Reject ${actionDialog.admission?.name}?`}
                onConfirm={confirmAction}
                onCancel={() => setActionDialog({ isOpen: false, admission: null, action: null })}
                confirmText={actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
                type={actionDialog.action === 'approve' ? 'primary' : 'danger'}
            />
        </div>
    );
};

export default AdmissionsPage;
