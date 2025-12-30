import { Plus, FileText, Calendar, MoreVertical } from 'lucide-react';

const TeacherAssignments = () => {
    const assignments = [
        { id: 1, title: 'Web Project Phase 1', class: 'BS Computer Science - Semester 6', dueDate: '2025-01-15', submitted: 35, total: 45, status: 'Active' },
        { id: 2, title: 'C++ Programming Basics', class: 'ICS - Part 1', dueDate: '2025-01-10', submitted: 48, total: 50, status: 'Active' },
        { id: 3, title: 'Database ER Diagram', class: 'BS IT - Semester 4', dueDate: '2024-12-28', submitted: 40, total: 40, status: 'Closed' },
        { id: 4, title: 'Physics Numerical Problem Set', class: 'FSc Pre-Engineering', dueDate: '2025-01-05', submitted: 20, total: 55, status: 'Active' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
                    <p className="text-gray-500">Manage classwork and homework</p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Assignment
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                                <p className="text-sm text-gray-500">{assignment.class}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        Due: {assignment.dueDate}
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${assignment.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {assignment.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-800">{assignment.submitted}/{assignment.total}</p>
                                <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    View Submissions
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherAssignments;
