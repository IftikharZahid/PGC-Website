import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    CalendarCheck,
    FileText,
    BarChart2,
    User,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/punjab-college-logo.png';

const TeacherSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher-dashboard' },
        { icon: BookOpen, label: 'My Classes', path: '/teacher/classes' },
        { icon: CalendarCheck, label: 'Attendance', path: '/teacher/attendance' },
        { icon: FileText, label: 'Assignments', path: '/teacher/assignments' },
        { icon: BarChart2, label: 'Results', path: '/teacher/results' },
        { icon: User, label: 'Profile', path: '/teacher/profile' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden glass-effect"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64 
                    bg-primary-900 text-white
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    shadow-xl flex flex-col
                    bg-noise
                `}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), linear-gradient(to bottom, #842318, #a0271b)`
                }}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-primary-800/50 bg-primary-900/50 backdrop-blur-sm">
                    <img src={logo} alt="PGC Logo" className="h-8 w-auto bg-white rounded-full p-0.5" />
                    <span className="font-serif font-bold text-lg tracking-wide text-primary-50">Teacher Panel</span>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                ${isActive(item.path)
                                    ? 'bg-primary-800/50 text-white shadow-lg border-l-4 border-primary-400'
                                    : 'text-primary-200 hover:bg-white/10 hover:text-white'
                                }
                            `}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-primary-300' : 'text-primary-400 group-hover:text-primary-200'}`}
                            />
                            <span className="font-medium text-sm tracking-wide">{item.label}</span>

                            {/* Arrow for non-dashboard items if needed, copying style from screenshot > */}
                            {item.path !== '/teacher-dashboard' && isActive(item.path) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Footer User Profile Summary or decorative */}
                <div className="p-4 border-t border-primary-800/50 bg-primary-900/30">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold ring-2 ring-primary-600/50 overflow-hidden">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                "T"
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-100 truncate">{user?.name || 'Faculty Member'}</p>
                            <p className="text-xs text-primary-300 truncate">{user?.designation || 'Online'}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default TeacherSidebar;
