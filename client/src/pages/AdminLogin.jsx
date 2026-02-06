import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, UserCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getItems, STORAGE_KEYS } from '../utils/adminStorage';
import logo from '../assets/punjab-college-logo.png';
import loginEducation from '../assets/login-education.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout, user } = useAuth();

    // Tab state - 'admin' or 'teacher'
    const [activeTab, setActiveTab] = useState(location.state?.role || 'admin');

    // Get the redirect path from location state
    const from = location.state?.from || '/admin-dashboard';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState({ type: '', text: '' });

    // Check if user is already logged in
    if (user) {
        return (
            <div className="min-h-screen relative bg-[#f2ebe3] dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:pt-16 sm:pb-0">
                {/* Animated SVG Background */}
                {/* Animated SVG Background */}
                <svg
                    viewBox="0 0 1600 900"
                    preserveAspectRatio="none"
                    className="w-full h-full absolute top-0 left-0"
                >
                    <defs>
                        <linearGradient id="backGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6b1412" />
                            <stop offset="50%" stopColor="#8c1f1b" />
                            <stop offset="100%" stopColor="#b52a22" />
                        </linearGradient>

                        <linearGradient id="midGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a5241f" />
                            <stop offset="50%" stopColor="#c63a2e" />
                            <stop offset="100%" stopColor="#e44d3b" />
                        </linearGradient>

                        <linearGradient id="frontGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#d65a30" />
                            <stop offset="55%" stopColor="#f06f3c" />
                            <stop offset="100%" stopColor="#ff9558" />
                        </linearGradient>
                    </defs>

                    <path
                        fill="url(#backGradient)"
                        d="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z"
                    >
                        <animate attributeName="d" dur="26s" repeatCount="indefinite" values="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z;M1600 0 C1420 120 1220 240 920 360 C620 480 320 620 0 900 C200 780 440 660 740 520 C1060 380 1340 280 1520 200 C1600 160 1600 120 1600 80 Z;M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z" />
                    </path>
                    <path
                        fill="url(#midGradient)"
                        d="M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z"
                    >
                        <animate attributeName="d" dur="32s" repeatCount="indefinite" values="M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z;M1600 100 C1360 260 1100 380 780 480 C480 580 240 720 0 900 C240 820 500 720 780 580 C1100 440 1380 340 1540 280 C1600 240 1600 200 1600 160 Z;M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z" />
                    </path>
                    <path
                        fill="url(#frontGradient)"
                        d="M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z"
                    >
                        <animate attributeName="d" dur="38s" repeatCount="indefinite" values="M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z;M1600 200 C1280 400 1000 540 660 640 C400 720 220 800 0 900 C280 860 560 780 840 660 C1140 520 1420 420 1560 360 C1600 320 1600 280 1600 240 Z;M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z" />
                    </path>
                </svg>

                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 text-center relative z-10 animate-fade-in border border-white/50 backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Already Logged In</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                        You are currently logged in as <span className="font-semibold text-primary-700 dark:text-primary-400">{user.name}</span> ({user.role}).
                        <br />
                        Please logout first to access a different account.
                    </p>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <button
                            onClick={() => {
                                const dashboardPath = user.role === 'student' ? '/student-dashboard' :
                                    user.role === 'teacher' ? '/teacher-dashboard' :
                                        '/admin-dashboard';
                                navigate(dashboardPath);
                            }}
                            className="w-full py-2.5 sm:py-3 bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white rounded-lg font-bold transition-colors shadow-md text-sm sm:text-base"
                        >
                            Continue to Dashboard
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                setFormData({ email: '', password: '', rememberMe: false });
                            }}
                            className="w-full py-2.5 sm:py-3 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 active:bg-red-200 transition-colors text-sm sm:text-base"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userData = null;

            // Validate credentials
            if (activeTab === 'admin') {
                // Admin Login via API (credentials stored in database)
                const response = await fetch('/api/settings/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Invalid admin credentials');
                }

                userData = result.data;
            } else {
                // Teacher Login via API
                const response = await fetch('/api/auth/teacher-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Invalid teacher credentials');
                }

                userData = result.data;
            }

            // Store user data in context and localStorage
            login(userData);

            // Redirect based on role
            const redirectPath = activeTab === 'admin' ? '/admin-dashboard' : '/teacher-dashboard';
            navigate(redirectPath, { replace: true });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotPasswordMessage({ type: '', text: '' });
        setForgotPasswordLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: forgotPasswordEmail,
                    role: activeTab
                }),
            });

            const data = await response.json();

            if (!response.ok && response.status !== 200) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            setForgotPasswordMessage({
                type: 'success',
                text: data.message
            });

            // Clear form
            setForgotPasswordEmail('');

            // Close modal after 3 seconds
            setTimeout(() => {
                setShowForgotPasswordModal(false);
                setForgotPasswordMessage({ type: '', text: '' });
            }, 3000);

        } catch (err) {
            setForgotPasswordMessage({
                type: 'error',
                text: err.message
            });
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    // Clear form when switching tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({ email: '', password: '', rememberMe: false });
        setError('');
        setShowPassword(false);
    };

    return (
        <div className="min-h-screen relative bg-[#f2ebe3] dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:py-0">
            {/* Animated SVG Background */}
            <svg
                viewBox="0 0 1600 900"
                preserveAspectRatio="none"
                className="w-full h-full absolute top-0 left-0"
            >
                <defs>
                    <linearGradient id="backGradient1" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6b1412" />
                        <stop offset="50%" stopColor="#8c1f1b" />
                        <stop offset="100%" stopColor="#b52a22" />
                    </linearGradient>

                    <linearGradient id="midGradient1" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a5241f" />
                        <stop offset="50%" stopColor="#c63a2e" />
                        <stop offset="100%" stopColor="#e44d3b" />
                    </linearGradient>

                    <linearGradient id="frontGradient1" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#d65a30" />
                        <stop offset="55%" stopColor="#f06f3c" />
                        <stop offset="100%" stopColor="#ff9558" />
                    </linearGradient>
                </defs>

                <path
                    fill="url(#backGradient1)"
                    d="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z"
                >
                    <animate attributeName="d" dur="26s" repeatCount="indefinite" values="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z;M1600 0 C1420 120 1220 240 920 360 C620 480 320 620 0 900 C200 780 440 660 740 520 C1060 380 1340 280 1520 200 C1600 160 1600 120 1600 80 Z;M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z" />
                </path>
                <path
                    fill="url(#midGradient1)"
                    d="M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z"
                >
                    <animate attributeName="d" dur="32s" repeatCount="indefinite" values="M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z;M1600 100 C1360 260 1100 380 780 480 C480 580 240 720 0 900 C240 820 500 720 780 580 C1100 440 1380 340 1540 280 C1600 240 1600 200 1600 160 Z;M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z" />
                </path>
                <path
                    fill="url(#frontGradient1)"
                    d="M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z"
                >
                    <animate attributeName="d" dur="38s" repeatCount="indefinite" values="M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z;M1600 200 C1280 400 1000 540 660 640 C400 720 220 800 0 900 C280 860 560 780 840 660 C1140 520 1420 420 1560 360 C1600 320 1600 280 1600 240 Z;M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z" />
                </path>
            </svg>

            <div className="relative z-10 w-full max-w-6xl px-0 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 h-full mt-4 sm:mt-8 lg:mt-16">
                {/* LEFT SECTION: Quote & Education Illustrator */}
                <div className="lg:w-1/2 hidden lg:block relative">
                    <div className="absolute top-0 left-0 -translate-x-10 -translate-y-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl rounded-bl-none z-0"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4 drop-shadow-sm">
                            "The Future of the World is in the <span className="text-primary-700 dark:text-primary-400 relative inline-block">
                                Classroom
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span> Today."
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 italic font-medium mb-8 border-l-4 border-primary-500 pl-4 py-1">
                            – Unknown
                        </p>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full filter blur-2xl transform scale-90"></div>
                            <img
                                src={loginEducation}
                                alt="Education Illustration"
                                className="w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 hover:rotate-1"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION: Login Card */}
                <div className="w-full lg:w-auto flex flex-col items-center">
                    {/* Main Card */}
                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-800 w-full max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl sm:rounded-[2rem] shadow-2xl p-4 sm:p-6 my-2 sm:my-4 border border-white/50 backdrop-blur-sm relative z-20">
                        {/* Header Section */}
                        <div className="text-center bg-white dark:bg-gray-800 mb-3 sm:mb-4">
                            <img src={logo} alt="Punjab College Logo" className="h-12 sm:h-16 mx-auto mb-2 sm:mb-3 object-contain" />
                            <h1 className="text-lg sm:text-xl font-serif font-bold text-secondary-900 dark:text-white mb-0.5 sm:mb-1 tracking-wide">Welcome to the Portal</h1>
                            <h2 className="text-gray-500 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">Please sign in to access your dashboard</h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 dark:border-gray-700 mx-0 mb-3 sm:mb-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-t-lg overflow-hidden">
                            <button
                                className={`flex-1 py-2.5 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold transition-all border-b-2 ${activeTab === 'admin'
                                    ? 'text-primary-700 border-primary-700 bg-white dark:bg-gray-800 shadow-sm'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => handleTabChange('admin')}
                            >
                                <Building2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'admin' ? 'text-primary-700' : 'text-gray-400'}`} />
                                Admin Login
                            </button>
                            <button
                                className={`flex-1 py-2.5 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold transition-all border-b-2 ${activeTab === 'teacher'
                                    ? 'text-primary-700 border-primary-700 bg-white dark:bg-gray-800 shadow-sm'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => handleTabChange('teacher')}
                            >
                                <UserCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'teacher' ? 'text-primary-700' : 'text-gray-400'}`} />
                                Teacher Login
                            </button>
                        </div>

                        {/* Form Section */}
                        <div className="pb-1 sm:pb-2">
                            {error && (
                                <div className="mb-3 sm:mb-4 p-2 sm:p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300 text-[11px] sm:text-xs">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                                        {activeTab === 'admin' ? 'Admin Email' : 'Teacher Email'}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder={activeTab === 'admin' ? 'admin@pgc.edu.pk' : 'teacher@pgc.edu.pk'}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all pr-10"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                                    <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="peer h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-primary-600 checked:bg-primary-600 hover:border-primary-600"
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">Remember me</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 sm:py-2.5 bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white font-bold rounded-lg shadow-md shadow-primary-700/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide text-[11px] sm:text-xs mt-1 sm:mt-2"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            <span>Signing In...</span>
                                        </div>
                                    ) : (
                                        `SIGN IN`
                                    )}
                                </button>

                            </form>
                            {/* Footer Help Text */}
                            <div className="mt-3 sm:mt-4 text-center space-y-1.5 sm:space-y-2">
                                <div className="relative flex py-0.5 sm:py-1 items-center">
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                                    <span className="flex-shrink-0 mx-2 sm:mx-3 text-gray-400 dark:text-gray-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Support</span>
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                                </div>
                                <a href="mailto:IftikharXahid@gmail.com" className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-md text-primary-700 text-[10px] sm:text-[11px] font-bold transition-colors">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Contact IT Services
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </div>
    );
};

export default AdminLogin;
