import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { addItem, updateItem, getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const FeeForm = ({ fee, onClose }) => {
    const { showNotification } = useAdmin();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchRollNo, setSearchRollNo] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        rollNo: '',
        course: '',
        semester: '',
        totalFee: '',
        paidAmount: 0,
        balance: '',
        status: 'unpaid',
        dueDate: '',
        feeMonth: ''
    });

    useEffect(() => {
        // Load existing students from API for selection
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/students');
                const data = await response.json();

                if (data.success) {
                    // Map API data to match expected format
                    const mapped = data.data.map(s => ({
                        ...s,
                        id: s._id,
                        rollNo: s.rollNo || s.studentId || 'N/A',
                        course: s.class ? s.class.split(' - ')[0] : '',
                        semester: s.class ? s.class.split(' - ')[1] : '',
                        name: s.name
                    }));
                    setStudents(mapped);
                    setFilteredStudents(mapped);

                    // Extract unique courses from students
                    const uniqueCourses = [...new Set(mapped.map(s => s.course).filter(Boolean))];
                    setCourses(uniqueCourses);
                }
            } catch (error) {
                console.error('Failed to load students:', error);
                // Fallback to localStorage if API fails
                const studentList = getItems(STORAGE_KEYS.STUDENTS);
                setStudents(studentList);
                setFilteredStudents(studentList);
                const uniqueCourses = [...new Set(studentList.map(s => s.course).filter(Boolean))];
                setCourses(uniqueCourses);
            }
        };

        fetchStudents();

        if (fee) {
            setFormData({
                ...fee,
                dueDate: fee.dueDate ? fee.dueDate.split('T')[0] : '',
                feeMonth: fee.feeMonth || ''
            });
        }
    }, [fee]);

    // Filter students based on course and roll number search
    useEffect(() => {
        let filtered = students;

        // Filter by course
        if (selectedCourse) {
            filtered = filtered.filter(s => s.course === selectedCourse);
        }

        // Filter by roll number search
        if (searchRollNo.trim()) {
            const searchLower = searchRollNo.toLowerCase();
            filtered = filtered.filter(s =>
                s.rollNo?.toLowerCase().includes(searchLower) ||
                s.name?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredStudents(filtered);
    }, [selectedCourse, searchRollNo, students]);

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        const selectedStudent = students.find(s => s.id === studentId);

        if (selectedStudent) {
            const feeAmount = getFeeAmountByCourse(selectedStudent.course);
            setFormData(prev => ({
                ...prev,
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                rollNo: selectedStudent.rollNo,
                course: selectedStudent.course,
                semester: selectedStudent.semester,
                totalFee: feeAmount,
                balance: feeAmount,
                paidAmount: 0,
                status: 'unpaid'
            }));
        }
    };

    const getFeeAmountByCourse = (course) => {
        const feeStructure = {
            'FSc Pre-Engineering': 50000,
            'FSc Pre-Medical': 50000,
            'ICS (Computer Science)': 55000,
            'ICS': 55000,
            'I.Com (Commerce)': 45000,
            'I.Com': 45000,
            'FA': 40000,
            'FA.IT': 45000
        };
        return feeStructure[course] || 40000;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { [name]: value };

            // Auto-calculate balance if fee/paid changes
            if (name === 'totalFee' || name === 'paidAmount') {
                const total = name === 'totalFee' ? parseFloat(value) || 0 : parseFloat(prev.totalFee) || 0;
                const paid = name === 'paidAmount' ? parseFloat(value) || 0 : parseFloat(prev.paidAmount) || 0;
                updates.balance = total - paid;
                updates.status = (total - paid) <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
            }

            return { ...prev, ...updates };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure numeric values are stored as numbers
        const processedData = {
            ...formData,
            totalFee: parseFloat(formData.totalFee) || 0,
            paidAmount: parseFloat(formData.paidAmount) || 0,
            balance: parseFloat(formData.balance) || 0
        };

        try {
            if (fee) {
                updateItem(STORAGE_KEYS.FEES, fee.id, processedData);
                logActivity('Fee Record Updated', `Updated fee for: ${formData.studentName}`);
                showNotification('Fee record updated successfully', 'success');
            } else {
                addItem(STORAGE_KEYS.FEES, {
                    ...processedData,
                    paymentHistory: [],
                    lastPaymentDate: null
                });
                logActivity('Fee Record Added', `Added new fee record for: ${formData.studentName}`);
                showNotification('Fee record added successfully', 'success');
            }
            onClose();
        } catch (error) {
            showNotification('Failed to save fee record', 'error');
        }
    };

    const clearFilters = () => {
        setSelectedCourse('');
        setSearchRollNo('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {fee ? 'Edit Fee Record' : 'Add New Fee Record'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!fee && (
                            <>
                                {/* Search & Filter Section */}
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Find Student</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Class/Course Filter */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Filter by Class</label>
                                            <select
                                                value={selectedCourse}
                                                onChange={(e) => setSelectedCourse(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="">All Classes</option>
                                                {courses.map(course => (
                                                    <option key={course} value={course}>{course}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Search by Roll Number */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search by Roll No / Name</label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={searchRollNo}
                                                    onChange={(e) => setSearchRollNo(e.target.value)}
                                                    placeholder="Enter roll number or name..."
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filter Info & Clear */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Found <span className="font-semibold text-primary-600">{filteredStudents.length}</span> students
                                        </span>
                                        {(selectedCourse || searchRollNo) && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Student Selection Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Student *</label>
                                    <select
                                        onChange={handleStudentChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            {filteredStudents.length === 0
                                                ? 'No students found'
                                                : `Select from ${filteredStudents.length} students`
                                            }
                                        </option>
                                        {filteredStudents.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.rollNo} - {s.name} ({s.course})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Student Name</label>
                                <input
                                    type="text"
                                    value={formData.studentName}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Roll No</label>
                                <input
                                    type="text"
                                    value={formData.rollNo}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course</label>
                                <input
                                    type="text"
                                    value={formData.course}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Fee *</label>
                                <input
                                    type="number"
                                    name="totalFee"
                                    value={formData.totalFee}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Paid Amount *</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Balance</label>
                                <input
                                    type="number"
                                    value={formData.balance}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Fee Month *</label>
                                <select
                                    name="feeMonth"
                                    value={formData.feeMonth}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="">Select Month</option>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                            >
                                {fee ? 'Update Record' : 'Create Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeeForm;
