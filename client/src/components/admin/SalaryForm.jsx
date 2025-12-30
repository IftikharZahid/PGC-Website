import { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { addItem, updateItem, getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';

const SalaryForm = ({ teacher, onClose, onAddNew }) => {
    const { showNotification } = useAdmin();
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(teacher);

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        salary: '',
        accountNumber: '',
        status: 'Active'
    });

    useEffect(() => {
        // Load all teachers
        const teacherList = getItems(STORAGE_KEYS.TEACHERS);
        setTeachers(teacherList);
        setFilteredTeachers(teacherList);

        // Extract unique departments
        const uniqueDepts = [...new Set(teacherList.map(t => t.department).filter(Boolean))];
        setDepartments(uniqueDepts);

        if (teacher) {
            setFormData({
                name: teacher.name || '',
                department: teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.join(', ') : 'Staff',
                salary: teacher.salary || '',
                accountNumber: teacher.accountNumber || '',
                status: teacher.status || 'Active'
            });
        }
    }, [teacher]);

    // Filter teachers based on department and search
    useEffect(() => {
        let filtered = teachers;

        if (selectedDepartment) {
            filtered = filtered.filter(t => t.department === selectedDepartment);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name?.toLowerCase().includes(query) ||
                t.email?.toLowerCase().includes(query) ||
                t.phone?.includes(query)
            );
        }

        setFilteredTeachers(filtered);
    }, [selectedDepartment, searchQuery, teachers]);

    const handleTeacherSelect = (e) => {
        const teacherId = e.target.value;
        const selected = teachers.find(t => t.id === teacherId);

        if (selected) {
            setSelectedTeacher(selected);
            setFormData({
                name: selected.name || '',
                department: selected.subjects && selected.subjects.length > 0 ? selected.subjects.join(', ') : 'Staff',
                salary: selected.salary || '',
                accountNumber: selected.accountNumber || '',
                status: selected.status || 'Active'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedTeacher) {
            showNotification('Please select a staff member', 'error');
            return;
        }

        try {
            const updates = {
                salary: parseFloat(formData.salary) || 0,
                accountNumber: formData.accountNumber,
                status: formData.status
            };

            updateItem(STORAGE_KEYS.TEACHERS, selectedTeacher.id, updates);
            logActivity('Salary Details Updated', `Updated salary details for: ${formData.name}`);
            showNotification('Salary details updated successfully', 'success');
            onClose();
        } catch (error) {
            showNotification('Failed to update salary details', 'error');
        }
    };

    const clearFilters = () => {
        setSelectedDepartment('');
        setSearchQuery('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {teacher ? 'Edit Salary Details' : 'Set Salary Details'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Search & Filter Section - Only show when adding new */}
                        {!teacher && (
                            <>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Find Staff Member</h3>
                                        {onAddNew && (
                                            <button
                                                type="button"
                                                onClick={() => { onClose(); onAddNew(); }}
                                                className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-semibold"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Add New Teacher
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Department Filter */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Filter by Department</label>
                                            <select
                                                value={selectedDepartment}
                                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="">All Departments</option>
                                                {departments.map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Search */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search by Name / Email</label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Enter name or email..."
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filter Info */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Found <span className="font-semibold text-primary-600">{filteredTeachers.length}</span> staff members
                                        </span>
                                        {(selectedDepartment || searchQuery) && (
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

                                {/* Staff Selection Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Staff Member *</label>
                                    <select
                                        onChange={handleTeacherSelect}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            {filteredTeachers.length === 0
                                                ? 'No staff found'
                                                : `Select from ${filteredTeachers.length} staff members`
                                            }
                                        </option>
                                        {filteredTeachers.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} - {t.department || 'General'} ({t.designation || 'Staff'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Staff Info (Read-only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Staff Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Department / Subjects</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Editable Salary Fields */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Base Salary (PKR) *</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Enter salary amount"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Account Number (Optional)</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Bank Account / IBAN"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedTeacher && !teacher}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SalaryForm;
