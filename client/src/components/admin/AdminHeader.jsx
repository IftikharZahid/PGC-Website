import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { Menu, LogOut, User, Settings, Sun, Moon, Info, X, Globe, Github, Linkedin, Mail, Code, MessageCircle } from 'lucide-react';
import developerPhoto from '../../assets/developer-photo.jpg';

const AdminHeader = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { darkMode, toggleDarkMode } = useAdmin();
    const [showDevInfo, setShowDevInfo] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const adminName = user?.name || 'College Administrator';
    const adminRole = user?.role === 'admin' ? 'Administrator' : 'Faculty Member';

    return (
        <>
            <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-0 z-30 shadow-sm transition-all duration-300">
                <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                    {/* Left: Menu button for mobile only */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Center: Mobile title */}
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 lg:hidden">Admin Panel</h2>

                    {/* Right: Admin info + Dark mode + Settings + Info + Logout */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Admin info - Display only (desktop) */}
                        <div className="hidden lg:flex items-center gap-3 px-2">
                            <div className="text-sm text-right">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 leading-tight">{adminName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{adminRole}</p>
                            </div>
                            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Settings icon button */}
                        <Link
                            to="/admin/settings"
                            className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>

                        {/* Developer Info button */}
                        <button
                            onClick={() => setShowDevInfo(true)}
                            className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Developer Info"
                        >
                            <Info className="w-5 h-5" />
                        </button>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Developer Info Modal - Compact & Responsive */}
            {showDevInfo && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm max-h-[85vh] overflow-y-auto">
                        {/* Modal Header - Ultra Compact */}
                        <div
                            className="px-3 py-2 flex items-center justify-between sticky top-0"
                            style={{ background: `linear-gradient(to right, var(--color-primary-main), var(--color-primary-dark))` }}
                        >
                            <div className="flex items-center gap-1.5">
                                <Code className="w-4 h-4 text-white" />
                                <h3 className="text-sm font-bold text-white">Developer Info</h3>
                            </div>
                            <button
                                onClick={() => setShowDevInfo(false)}
                                className="text-white/80 hover:text-white p-0.5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body - Compact */}
                        <div className="p-3 space-y-2.5">
                            {/* Developer Profile - Inline for compactness */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={developerPhoto}
                                    alt="Iftikhar Zahid"
                                    className="w-14 h-14 rounded-full object-cover shadow border-2 border-primary-500 flex-shrink-0"
                                />
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">Iftikhar Zahid</h4>
                                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Full Stack Developer</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Punjab, Pakistan</p>
                                </div>
                            </div>

                            {/* Skills - Compact Grid */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-2">
                                <h5 className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">Expertise</h5>
                                <div className="flex flex-wrap gap-1">
                                    {['JavaScript', 'React', 'React Native', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'AWS', 'Python', 'UI/UX'].map((skill) => (
                                        <span key={skill} className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-[9px] font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* About - Condensed */}
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                Passionate developer building scalable web & mobile applications with expertise in UI/UX design.
                            </p>

                            {/* Contact Links - Compact Row */}
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <a
                                    href="https://zahid.codes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                                    title="Portfolio"
                                >
                                    <Globe className="w-4 h-4 text-primary-600" />
                                </a>
                                <a
                                    href="https://github.com/IftikharZahid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    title="GitHub"
                                >
                                    <Github className="w-4 h-4 text-gray-800 dark:text-white" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/iftikhar-zahid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    title="LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4 text-blue-600" />
                                </a>
                                <a
                                    href="mailto:IftikharXahid@gmail.com"
                                    className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    title="Email"
                                >
                                    <Mail className="w-4 h-4 text-red-500" />
                                </a>
                                <a
                                    href="https://wa.me/923007971374"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                    title="WhatsApp"
                                >
                                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Footer - Minimal */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    Made with ❤️ by <a href="https://zahid.codes" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:underline">Iftikhar Zahid</a> © {new Date().getFullYear()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminHeader;
