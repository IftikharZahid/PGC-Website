import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import pgcLogo from '../../assets/pgc-logo.png';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    FileText,
    UserPlus,
    X,
    ChevronLeft,
    ChevronRight,
    Bell,
    BellRing,
    Banknote,
    DollarSign,
    Video,
    Image as ImageIcon,
    CalendarCheck
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse, sidebarWidth, setSidebarWidth }) => {
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const sidebarRef = useRef(null);

    const menuItems = [
        { path: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/students', icon: Users, label: 'Students' },
        { path: '/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
        { path: '/admin/teachers', icon: GraduationCap, label: 'Teachers' },
        { path: '/admin/salaries', icon: Banknote, label: 'Salaries' },
        { path: '/admin/fees', icon: DollarSign, label: 'Fees' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { path: '/admin/results', icon: FileText, label: 'Results' },
        { path: '/admin/admissions', icon: UserPlus, label: 'Admissions' },
        { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
        { path: '/admin/notification', icon: BellRing, label: 'Notification' },
        { path: '/admin/video-lectures', icon: Video, label: 'Video Lectures' },
        {
            label: 'Gallery',
            icon: ImageIcon,
            isSubmenu: true,
            items: [
                { path: '/admin/gallery/home', label: 'Home Page' },
                { path: '/admin/gallery/faculty', label: 'Faculty' },
                { path: '/admin/gallery/campus-life', label: 'Campus Life' },
                { path: '/admin/gallery/about', label: 'About Us' },
                { path: '/admin/gallery/seminars', label: 'Seminars' },
                { path: '/admin/gallery/research', label: 'Research' }
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const galleryItem = menuItems.find(item => item.isSubmenu);
        if (galleryItem?.items.some(sub => location.pathname === sub.path)) {
            setExpandedMenu('Gallery');
        }
    }, [location.pathname]);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
            )}

            {/* Sidebar - Matching Dashboard Color Scheme */}
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    transform transition-all duration-300 ease-in-out z-50 flex flex-col shadow-lg
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ width: isCollapsed ? '56px' : '200px' }}
            >
                {/* Header - Red accent like dashboard Students card */}
                <div className={`h-12 flex-shrink-0 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'} bg-red-500 text-white`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded">
                                <img src={pgcLogo} alt="PGC" className="w-5 h-5 object-contain" />
                            </div>
                            <span className="text-sm font-bold">Admin Panel</span>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="bg-white p-0.5 rounded">
                            <img src={pgcLogo} alt="PGC" className="w-5 h-5 object-contain" />
                        </div>
                    )}
                    <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 custom-scrollbar">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;

                        // Submenu
                        if (item.isSubmenu) {
                            const isSubmenuActive = item.items.some(sub => location.pathname === sub.path);
                            const isExpanded = expandedMenu === item.label;

                            return (
                                <div key={index}>
                                    <button
                                        onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-2 rounded-lg transition-all text-xs
                                            ${isSubmenuActive
                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}
                                        `}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <div className={`flex items-center ${isCollapsed ? '' : 'gap-2.5'}`}>
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            {!isCollapsed && <span className="font-medium">{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        )}
                                    </button>

                                    {isExpanded && !isCollapsed && (
                                        <div className="mt-0.5 ml-4 pl-2 border-l-2 border-gray-200 dark:border-gray-600 space-y-0.5">
                                            {item.items.map(subItem => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                                    className={`block px-2.5 py-1.5 text-[11px] rounded transition-colors
                                                        ${location.pathname === subItem.path
                                                            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-medium'
                                                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                                                    `}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Regular menu item
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && onClose()}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} px-2.5 py-2 rounded-lg transition-all text-xs
                                    ${active
                                        ? 'bg-red-500 text-white font-semibold shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 font-medium'}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Button */}
                <div className="hidden lg:block p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onToggleCollapse}
                        className="w-full flex items-center justify-center p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[9px] text-gray-400 font-medium">Punjab Group of Colleges</p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default AdminSidebar;
