import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Users, Book } from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useAuth();

    // Mock Data based on screenshot
    const stats = [
        { title: 'Classes', value: '5', icon: ClipboardList, color: 'bg-primary-50', iconColor: 'text-primary-600' },
        { title: 'Students', value: '210', icon: Users, color: 'bg-orange-100', iconColor: 'text-orange-600' },
        { title: 'Subjects', value: '3', icon: Book, color: 'bg-red-100', iconColor: 'text-red-500' },
    ];

    const classes = [
        { id: 1, name: 'BS Computer Science - Semester 6', subject: 'Web Engineering' },
        { id: 2, name: 'ICS - Programming Fundamentals', subject: 'Computer Science' },
        { id: 3, name: 'BS IT - Semester 4', subject: 'Database Systems' },
        { id: 4, name: 'FSc Pre-Engineering', subject: 'Physics' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name?.split(' ')[0] || 'Teacher'}</h1>
                <p className="text-gray-500">Here's your daily overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* My Classes Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">My Classes</h2>
                <div className="space-y-4">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">{cls.name}</h3>
                                    <p className="text-sm text-gray-500">{cls.subject}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <button className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 group-hover:border-primary-200 group-hover:text-primary-600 transition-colors">
                                        View Class
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
