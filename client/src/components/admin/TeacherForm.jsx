import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getItems, STORAGE_KEYS, logActivity } from '../../utils/adminStorage';
import { useAdmin } from '../../context/AdminContext';
import { useCreateTeacherMutation, useUpdateTeacherMutation } from '../../store/api/teachersApi';

const TeacherForm = ({ teacher, onClose }) => {
    const { showNotification } = useAdmin();
    // RTK Query Mutations
    const [createTeacher] = useCreateTeacherMutation();
    const [updateTeacher] = useUpdateTeacherMutation();

    const [formData, setFormData] = useState({
        name: '',
        subjects: [],
        qualification: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        experience: '',
        image: '',
        password: '',
        status: 'Active'
    });
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [subjectInput, setSubjectInput] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    useEffect(() => {
        // Load available subjects from local storage (keeping this for now as subjects might be static)
        const subjects = getItems(STORAGE_KEYS.SUBJECTS);
        setAvailableSubjects(subjects.map(s => s.subjectName));

        if (teacher) {
            setFormData({
                name: teacher.name || '',
                subjects: teacher.subjects || [],
                qualification: teacher.qualification || '',
                email: teacher.email || '',
                phone: teacher.phone || '',
                designation: teacher.designation || '',
                department: teacher.department || '',
                experience: teacher.experience || '',
                image: teacher.image || '',
                password: '', // Don't pre-fill password
                status: teacher.status || 'Active'
            });
            setIsEditingPassword(false); // Reset password editing state
        }
    }, [teacher]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSubject = () => {
        if (subjectInput && !formData.subjects.includes(subjectInput)) {
            setFormData(prev => ({
                ...prev,
                subjects: [...prev.subjects, subjectInput]
            }));
            setSubjectInput('');
        }
    };

    const removeSubject = (subject) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s !== subject)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.subjects.length === 0) {
            showNotification('Please add at least one subject', 'warning');
            return;
        }

        // Sanitize data
        const emailLower = formData.email.trim().toLowerCase();

        // 1. Check Admin Conflict
        if (emailLower === 'iftikharzahid@outlook.com') {
            showNotification('This email is registered as an Administrator', 'error');
            return;
        }

        try {
            // Proceed to save to Backend
            const dataToSave = {
                ...formData,
                email: formData.email.trim(),
            };

            // Only include password if it was actually entered (for new teachers or password changes)
            if (formData.password && formData.password.trim()) {
                dataToSave.password = formData.password.trim();
            }

            if (teacher) {
                // UPDATE
                await updateTeacher({ id: teacher.id || teacher._id, ...dataToSave }).unwrap();
                logActivity('Teacher Updated', `Updated teacher: ${dataToSave.name}`);
                showNotification('Teacher updated successfully', 'success');
            } else {
                // CREATE
                await createTeacher(dataToSave).unwrap();
                logActivity('Teacher Added', `Added new teacher: ${dataToSave.name}`);
                showNotification('Teacher added successfully', 'success');
            }
            onClose();
        } catch (error) {
            console.error(error);
            showNotification(error.data?.message || 'Failed to save teacher', 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {teacher ? 'Edit Teacher' : 'Add New Teacher'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form - Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-4 sm:p-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="Enter teacher name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Qualification *</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="PhD, MSc, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="teacher@pgc.edu.pk"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Password {!teacher && '*'}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={teacher && !isEditingPassword ? '●●●●●●●●' : formData.password}
                                        onChange={(e) => {
                                            if (teacher && !isEditingPassword) {
                                                // First keystroke when editing - clear the dots and start fresh
                                                setIsEditingPassword(true);
                                                setFormData(prev => ({ ...prev, password: e.target.value.replace('●', '') }));
                                            } else {
                                                handleChange(e);
                                            }
                                        }}
                                        onFocus={() => {
                                            if (teacher && !isEditingPassword) {
                                                setIsEditingPassword(true);
                                                setFormData(prev => ({ ...prev, password: '' }));
                                            }
                                        }}
                                        required={!teacher}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder={teacher ? "Click to change password" : "Set login password"}
                                    />
                                    {teacher && !isEditingPassword && (
                                        <p className="text-xs text-gray-500 mt-1">Click to change password</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="0300-1234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Designation *</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g. Senior Lecturer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Department *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="General">General</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Humanities">Humanities</option>
                                        <option value="Islamic Studies">Islamic Studies</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Experience *</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g. 5+ Years"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="https://... or /assets/..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to use default initials avatar</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subjects *</label>
                                    <div className="flex gap-2 mb-2">
                                        <select
                                            value={subjectInput}
                                            onChange={(e) => setSubjectInput(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                        >
                                            <option value="">Select Subject</option>
                                            {availableSubjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={addSubject}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.subjects.map(subject => (
                                            <span key={subject} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 rounded-full text-sm flex items-center gap-2">
                                                {subject}
                                                <button type="button" onClick={() => removeSubject(subject)} className="hover:text-red-600">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions - Fixed Footer */}
                        <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 text-sm"
                            >
                                {teacher ? 'Update Teacher' : 'Add Teacher'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherForm;
