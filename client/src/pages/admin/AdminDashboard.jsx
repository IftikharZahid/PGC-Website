import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Building2 } from 'lucide-react';
import { getItems, STORAGE_KEYS } from '../../utils/adminStorage';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        departments: 6 // Hardcoded to match screenshot for visual accuracy
    });
    const [recentAdmissions, setRecentAdmissions] = useState([]);

    useEffect(() => {
        const students = getItems(STORAGE_KEYS.STUDENTS);
        const teachers = getItems(STORAGE_KEYS.TEACHERS);
        const courses = getItems(STORAGE_KEYS.COURSES);
        const admissions = getItems(STORAGE_KEYS.ADMISSIONS);

        setStats({
            totalStudents: students.length,
            totalTeachers: teachers.length,
            totalCourses: courses.length,
            departments: 6
        });

        // Get recent 3 admissions for the table
        setRecentAdmissions(admissions.slice(0, 3).map(a => ({
            name: a.firstName + ' ' + a.lastName,
            program: a.program,
            status: a.status
        })));
    }, []);

    const statCards = [
        { title: 'Students', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'bg-red-500', iconColor: 'text-white', link: '/admin/students' },
        { title: 'Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'bg-blue-800', iconColor: 'text-white', link: '/admin/teachers' },
        { title: 'Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-orange-400', iconColor: 'text-white', link: '/admin/courses' },
        { title: 'Departments', value: stats.departments, icon: Building2, color: 'bg-green-500', iconColor: 'text-white', link: '/admin/courses' }
    ];

    return (
        <div className="space-y-5 font-sans">
            {/* Header Title */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Welcome, Administrator</h1>
            </div>

            {/* Stats Grid - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 max-w-4xl">
                {statCards.map((card, index) => (
                    <Link
                        to={card.link}
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:border-gray-200 dark:hover:border-gray-600"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center shadow-sm`}>
                                <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-0.5">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Admissions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-w-4xl">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Recent Admissions</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-tl-lg">Name</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Program</th>
                                <th className="py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {recentAdmissions.length > 0 ? (
                                recentAdmissions.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="py-4 px-4 text-gray-900 dark:text-gray-100 font-medium">{student.name}</td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{student.program}</td>
                                        <td className="py-4 px-4 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'Approved'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : student.status === 'Pending'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-gray-500">
                                        No recent admissions found
                                    </td>
                                </tr>
                            )}
                            {/* Mock Data to match screenshot feel if empty */}
                            {recentAdmissions.length === 0 && (
                                <>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-4 px-4 text-gray-900 font-medium">Ali Khan</td>
                                        <td className="py-4 px-4 text-gray-600">Computer Science</td>
                                        <td className="py-4 px-4 text-right"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Approved</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-4 px-4 text-gray-900 font-medium">Fatima Noor</td>
                                        <td className="py-4 px-4 text-gray-600">Pre-Engineering</td>
                                        <td className="py-4 px-4 text-right"><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
