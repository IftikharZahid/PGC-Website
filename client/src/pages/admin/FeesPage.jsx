import { useState, useEffect, useMemo } from 'react';
import { DollarSign, Plus, Check, X as XIcon, Edit2, Trash2, Search } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FeeForm from '../../components/admin/FeeForm';
import { getItems, updateItem, deleteItem, STORAGE_KEYS, logActivity, addItem, initializeDemoData } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const FeesPage = () => {
    const loadFees = () => {
        initializeDemoData();
        return getItems(STORAGE_KEYS.FEES);
    };

    const [fees, setFees] = useState(loadFees());
    const [showForm, setShowForm] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, fee: null });
    const [showPaymentDialog, setShowPaymentDialog] = useState({ isOpen: false, fee: null });

    // Filters
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');

    // Payment form state
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const { showNotification, refreshTrigger } = useAdmin();

    const refresh = () => { setFees(loadFees()); };

    useEffect(() => {
        if (refreshTrigger) refresh();
    }, [refreshTrigger]);

    // Get unique courses
    const uniqueCourses = useMemo(() => {
        const courses = fees.map(f => f.course).filter(Boolean);
        return [...new Set(courses)].sort();
    }, [fees]);

    // Filtered fees
    const filteredFees = useMemo(() => {
        return fees.filter(f => {
            const matchesSearch = !searchFilter ||
                f.studentName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                f.rollNo?.toLowerCase().includes(searchFilter.toLowerCase());
            const matchesStatus = !statusFilter || f.status === statusFilter;
            const matchesCourse = !courseFilter || f.course === courseFilter;
            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [fees, searchFilter, statusFilter, courseFilter]);

    const handleEdit = (fee) => { setEditingFee(fee); setShowForm(true); };
    const handleDelete = (fee) => { setDeleteDialog({ isOpen: true, fee }); };

    const confirmDelete = () => {
        try {
            deleteItem(STORAGE_KEYS.FEES, deleteDialog.fee.id);
            logActivity('Fee Record Deleted', `Deleted fee record for: ${deleteDialog.fee.studentName}`);
            showNotification('Fee record deleted successfully', 'success');
            refresh();
            setDeleteDialog({ isOpen: false, fee: null });
        } catch (_) {
            showNotification('Failed to delete fee record', 'error');
        }
    };

    const handleRecordPayment = (fee) => {
        setShowPaymentDialog({ isOpen: true, fee });
        setPaymentAmount('');
        setPaymentMethod('Cash');
    };

    const confirmPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (!amount || amount <= 0) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }
        const fee = showPaymentDialog.fee;
        const newPaidAmount = (fee.paidAmount || 0) + amount;
        const newBalance = fee.totalFee - newPaidAmount;
        const payment = { date: new Date().toISOString(), amount, method: paymentMethod, receiptNo: `REC-${Date.now()}` };
        const status = newBalance <= 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : 'unpaid';

        updateItem(STORAGE_KEYS.FEES, fee.id, {
            paidAmount: newPaidAmount, balance: newBalance, status,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            paymentHistory: [...(fee.paymentHistory || []), payment]
        });

        logActivity('Payment Recorded', `Recorded payment of Rs.${amount} for ${fee.studentName}`);
        showNotification(`Payment of Rs.${amount} recorded successfully`, 'success');
        setShowPaymentDialog({ isOpen: false, fee: null });
        refresh();
    };

    const markAsPaid = (fee) => {
        const payment = { date: new Date().toISOString(), amount: fee.balance, method: 'Complete Payment', receiptNo: `REC-${Date.now()}` };
        updateItem(STORAGE_KEYS.FEES, fee.id, {
            paidAmount: fee.totalFee, balance: 0, status: 'paid',
            lastPaymentDate: new Date().toISOString().split('T')[0],
            paymentHistory: [...(fee.paymentHistory || []), payment]
        });
        logActivity('Fee Marked Paid', `Marked fee as paid for ${fee.studentName}`);
        showNotification(`Fee marked as paid for ${fee.studentName}`, 'success');
        refresh();
    };

    const closeForm = () => { setShowForm(false); setEditingFee(null); refresh(); };

    // Stats based on filtered data
    const totalCollected = filteredFees.reduce((sum, f) => sum + (parseFloat(f.paidAmount) || 0), 0);
    const totalOutstanding = filteredFees.reduce((sum, f) => sum + (parseFloat(f.balance) || 0), 0);
    const paidCount = filteredFees.filter(f => f.status === 'paid').length;

    const columns = [
        { key: 'studentName', label: 'Student', sortable: true },
        { key: 'rollNo', label: 'Roll No', sortable: true },
        { key: 'course', label: 'Course', sortable: true },
        { key: 'totalFee', label: 'Total', sortable: true, render: (v) => `Rs.${(v || 0).toLocaleString()}` },
        { key: 'paidAmount', label: 'Paid', sortable: true, render: (v) => `Rs.${(v || 0).toLocaleString()}` },
        { key: 'balance', label: 'Balance', sortable: true, render: (v) => `Rs.${(v || 0).toLocaleString()}` },
        {
            key: 'status', label: 'Status', sortable: true,
            render: (value) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${value === 'paid' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : value === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unpaid'}
                </span>
            )
        },
        {
            key: 'actions', label: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="flex gap-1">
                    {row.status !== 'paid' && (
                        <>
                            <button onClick={() => handleRecordPayment(row)} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Record Payment"><DollarSign className="w-3.5 h-3.5" /></button>
                            <button onClick={() => markAsPaid(row)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded" title="Mark Paid"><Check className="w-3.5 h-3.5" /></button>
                        </>
                    )}
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
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Fee Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Track and manage student fee payments</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm">
                    <Plus className="w-4 h-4" /> Add Record
                </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Search */}
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student / Roll No</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search..." className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none" />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-[120px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </div>

                    {/* Course Filter */}
                    <div className="min-w-[140px]">
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Course</label>
                        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none">
                            <option value="">All Courses</option>
                            {uniqueCourses.map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>

                    {/* Clear */}
                    {(searchFilter || statusFilter || courseFilter) && (
                        <button onClick={() => { setSearchFilter(''); setStatusFilter(''); setCourseFilter(''); }} className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Clear</button>
                    )}

                    {/* Stats */}
                    <div className="flex gap-1.5 ml-auto">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px] font-bold">Collected: Rs.{totalCollected.toLocaleString()}</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-[10px] font-bold">Due: Rs.{totalOutstanding.toLocaleString()}</span>
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-[10px] font-bold">{paidCount}/{filteredFees.length}</span>
                    </div>
                </div>
            </div>

            {/* Fee Records Table */}
            <DataTable columns={columns} data={filteredFees} compact={true} emptyMessage="No fee records found." searchable={false} />

            {/* Fee Form */}
            {showForm && <FeeForm fee={editingFee} onClose={closeForm} />}

            {/* Delete Confirmation */}
            <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Fee Record" message={`Delete fee record for ${deleteDialog.fee?.studentName}?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, fee: null })} confirmText="Delete" type="danger" />

            {/* Payment Dialog */}
            {showPaymentDialog.isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Record Payment</h2>
                            <button onClick={() => setShowPaymentDialog({ isOpen: false, fee: null })} className="text-gray-400 hover:text-gray-600"><XIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm">
                                <p className="text-gray-600 dark:text-gray-400">Student: <span className="font-semibold text-gray-900 dark:text-gray-100">{showPaymentDialog.fee?.studentName}</span></p>
                                <p className="text-gray-600 dark:text-gray-400">Balance: <span className="font-semibold text-red-600">Rs.{showPaymentDialog.fee?.balance?.toLocaleString()}</span></p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
                                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} max={showPaymentDialog.fee?.balance} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter amount" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Method *</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none">
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Online Payment">Online Payment</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                            <button onClick={() => setShowPaymentDialog({ isOpen: false, fee: null })} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                            <button onClick={confirmPayment} className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700">Record</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesPage;
