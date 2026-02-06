import { useEffect, useState } from 'react';
import {
    Users, GraduationCap, BookOpen, Wallet,
    Plus, Bell, FileText, TrendingUp, MoreVertical,
    Calendar, ArrowUpRight, Search, Settings
} from 'lucide-react';
import { getItems, STORAGE_KEYS } from '../../utils/adminStorage';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        pendingAdmissions: 0,
        departmentDist: []
    });
    const [recentAdmissions, setRecentAdmissions] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    // Chart Data State
    const [feeData, setFeeData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);

    // Chart Colors
    const FEE_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red
    const ATTENDANCE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        const term = query.toLowerCase();
        const students = getItems(STORAGE_KEYS.STUDENTS);
        const teachers = getItems(STORAGE_KEYS.TEACHERS);
        const courses = getItems(STORAGE_KEYS.COURSES);

        const results = [];

        // Search Students
        students.forEach(s => {
            if (s.name?.toLowerCase().includes(term) || s.rollNo?.toLowerCase().includes(term)) {
                results.push({
                    type: 'Student',
                    title: s.name,
                    subtitle: `${s.program} - ${s.rollNo || 'No ID'}`,
                    link: '/admin/students',
                    id: s.id
                });
            }
        });

        // Search Teachers
        teachers.forEach(t => {
            if (t.name?.toLowerCase().includes(term) || t.subject?.toLowerCase().includes(term)) {
                results.push({
                    type: 'Teacher',
                    title: t.name,
                    subtitle: `Department: ${t.subject || 'N/A'}`,
                    link: '/admin/teachers',
                    id: t.id
                });
            }
        });

        // Search Courses
        courses.forEach(c => {
            if (c.name?.toLowerCase().includes(term) || c.code?.toLowerCase().includes(term)) {
                results.push({
                    type: 'Course',
                    title: c.name,
                    subtitle: `Code: ${c.code || 'N/A'}`,
                    link: '/admin/courses',
                    id: c.id
                });
            }
        });

        setSearchResults(results.slice(0, 8)); // Limit to 8 results
    };

    useEffect(() => {
        // Fetch all data
        const students = getItems(STORAGE_KEYS.STUDENTS);
        const teachers = getItems(STORAGE_KEYS.TEACHERS);
        const courses = getItems(STORAGE_KEYS.COURSES);
        const admissions = getItems(STORAGE_KEYS.ADMISSIONS);

        // Calculate Department Distribution
        const programs = {};
        students.forEach(s => {
            const prog = s.program || 'Other';
            programs[prog] = (programs[prog] || 0) + 1;
        });

        // Sort programs by count and take top 4
        const dist = Object.entries(programs)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([name, count]) => ({
                name,
                count,
                percentage: students.length ? Math.round((count / students.length) * 100) : 0
            }));

        setStats({
            totalStudents: students.length,
            totalTeachers: teachers.length,
            totalCourses: courses.length,
            pendingAdmissions: admissions.filter(a => a.status === 'Pending').length,
            departmentDist: dist
        });

        // Recent Admissions
        setRecentAdmissions(admissions.slice(0, 5).map(a => ({
            id: a.id,
            name: `${a.firstName} ${a.lastName}`,
            program: a.program,
            date: new Date(a.date).toLocaleDateString(),
            status: a.status
        })));

        // Mock Recent Activity (could be real if storage supported logs)
        setRecentActivity([
            { id: 1, text: 'New student registration: Ali Khan', time: '2 mins ago', type: 'student' },
            { id: 2, text: 'Fee deadline updated for Fall 2025', time: '1 hour ago', type: 'finance' },
            { id: 3, text: 'System backup completed successfully', time: '3 hours ago', type: 'system' },
            { id: 4, text: 'New teacher profile added: Dr. Ahmed', time: '5 hours ago', type: 'teacher' },
        ]);

        // Fee Collection Data (Mock - replace with API data)
        setFeeData([
            { name: 'Paid', value: 68, amount: 'Rs. 3,400,000' },
            { name: 'Partial', value: 22, amount: 'Rs. 1,100,000' },
            { name: 'Pending', value: 10, amount: 'Rs. 500,000' }
        ]);

        // Class Attendance Data (Mock - replace with API data)
        setAttendanceData([
            { class: '9th', present: 85, absent: 15 },
            { class: '10th', present: 78, absent: 22 },
            { class: '11th', present: 92, absent: 8 },
            { class: '12th', present: 88, absent: 12 }
        ]);

    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend, link }) => (
        <Link to={link || '#'} className="relative overflow-hidden bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${color} text-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{value}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 truncate">{title}</p>
                </div>
                {trend && (
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </div>
                )}
            </div>
        </Link>
    );

    const QuickAction = ({ icon: Icon, label, link, color }) => (
        <Link to={link} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-600 hover:shadow-md border border-transparent hover:border-primary-500 transition-all gap-2 group text-center h-full">
            <div className={`p-2.5 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-white/20 group-hover:text-white text-current group-hover:scale-110 transition-all`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">{label}</span>
        </Link>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, Administrator</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students, teachers..."
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64 transition-all"
                        />

                        {/* Search Results Dropdown */}
                        {showResults && searchQuery && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-96 overflow-y-auto">
                                        <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                                            Search Results
                                        </div>
                                        {searchResults.map((result, index) => (
                                            <button
                                                key={`${result.type}-${result.id}-${index}`}
                                                onClick={() => {
                                                    navigate(result.link);
                                                    setShowResults(false);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                                            >
                                                <div className={`p-2 rounded-full ${result.type === 'Student' ? 'bg-blue-100 text-blue-600' :
                                                    result.type === 'Teacher' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-green-100 text-green-600'
                                                    }`}>
                                                    {result.type === 'Student' ? <Users className="w-4 h-4" /> :
                                                        result.type === 'Teacher' ? <GraduationCap className="w-4 h-4" /> :
                                                            <BookOpen className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{result.title}</p>
                                                    <p className="text-xs text-gray-500">{result.subtitle}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link to="/admin/students" className="group p-4 bg-blue-500 rounded-xl hover:bg-blue-600 hover:shadow-lg transition-all flex flex-col items-center justify-center text-white gap-2">
                    <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Add Student</span>
                </Link>
                <Link to="/admin/notification" className="group p-4 bg-purple-500 rounded-xl hover:bg-purple-600 hover:shadow-lg transition-all flex flex-col items-center justify-center text-white gap-2">
                    <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                        <Bell className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Post Notice</span>
                </Link>
                <Link to="/admin/fees" className="group p-4 bg-green-500 rounded-xl hover:bg-green-600 hover:shadow-lg transition-all flex flex-col items-center justify-center text-white gap-2">
                    <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Collect Fees</span>
                </Link>
                <Link to="/admin/calendar" className="group p-4 bg-orange-500 rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all flex flex-col items-center justify-center text-white gap-2">
                    <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Academic Calendar</span>
                </Link>
            </div>

            {/* Stats Grid - Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents.toLocaleString()}
                    icon={Users}
                    color="bg-blue-600"
                    trend="+12%"
                    link="/admin/students"
                />
                <StatCard
                    title="Pending Admissions"
                    value={stats.pendingAdmissions}
                    icon={FileText}
                    color="bg-orange-500"
                    link="/admin/admissions"
                />
                <StatCard
                    title="Total Faculty"
                    value={stats.totalTeachers}
                    icon={GraduationCap}
                    color="bg-purple-600"
                    link="/admin/teachers"
                />
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-emerald-500"
                    link="/admin/courses"
                />
            </div>

            {/* Charts Section - Fee Collection & Attendance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Collection Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-green-500" />
                            Fee Collection Status
                        </h2>
                        <Link to="/admin/fees" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            View Details <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-32 h-32 sm:w-40 sm:h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={feeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {feeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={FEE_COLORS[index % FEE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value, name) => [`${value}%`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {feeData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: FEE_COLORS[idx] }}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
                                        <p className="text-xs text-gray-500">{item.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Class Attendance Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Class Attendance Overview
                        </h2>
                        <Link to="/admin/attendance" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            View Details <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData} barGap={8}>
                                <XAxis
                                    dataKey="class"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    formatter={(value) => [`${value}%`]}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '10px' }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                                <Bar
                                    dataKey="present"
                                    fill="#10B981"
                                    name="Present"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="absent"
                                    fill="#EF4444"
                                    name="Absent"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Recent Admissions Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Admissions</h2>
                            <Link to="/admin/admissions" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                View All <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/30">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student Name</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Program</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recentAdmissions.length > 0 ? (
                                        recentAdmissions.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                                <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{student.program}</td>
                                                <td className="px-6 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{student.date}</td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        student.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No recent admissions
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            {recentAdmissions.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recentAdmissions.map((student) => (
                                        <div key={student.id} className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.program}</p>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${student.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    student.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{student.date}</span>
                                                </div>
                                                <span className="font-medium text-primary-600 dark:text-primary-400">ID: #{student.id.toString().substring(0, 6)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No recent admissions
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Column (1/3) */}
                <div className="space-y-6">
                    {/* Department Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Student Distribution</h2>
                        <div className="space-y-4">
                            {stats.departmentDist.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs font-medium mb-1.5">
                                        <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{item.count} students ({item.percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {stats.departmentDist.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No student data available</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Tasks / Notifications */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <h2 className="font-semibold mb-2 relative z-10">System Status</h2>
                        <p className="text-primary-100 text-sm mb-4 relative z-10">All systems operational. Last backup performed today at 09:00 AM.</p>
                        <div className="flex items-center gap-2 text-xs font-medium bg-white/20 p-2 rounded-lg backdrop-blur-sm relative z-10 w-fit">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Database Connected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
