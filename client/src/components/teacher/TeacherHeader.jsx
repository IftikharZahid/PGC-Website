import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherHeader = ({ onMenuClick }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin', { state: { role: 'teacher' } });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30 px-4 flex items-center justify-between shadow-sm">
            {/* Left: Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'Teacher'}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email || 'Faculty'}</p>
                    </div>
                    <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100 text-primary-700 overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="ml-2 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default TeacherHeader;
