import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/punjab-college-logo.png';
import loginEducation from '../assets/login-education.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout, user } = useAuth();

    const from = location.state?.from || '/student-dashboard';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already logged in
    if (user) {
        return (
            <div className="min-h-screen relative bg-[#c49f84] dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:pt-16 sm:pb-0">
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
                    </defs>
                    <path
                        fill="url(#backGradient)"
                        d="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z"
                    />
                </svg>

                <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 text-center animate-fade-in border border-white/50 backdrop-blur-sm">
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
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.data);
            navigate(from, { replace: true });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

                {/* BACK RIBBON */}
                <path
                    fill="url(#backGradient1)"
                    d="M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z"
                >
                    <animate
                        attributeName="d"
                        dur="26s"
                        repeatCount="indefinite"
                        values="
            M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z;
            M1600 0 C1420 120 1220 240 920 360 C620 480 320 620 0 900 C200 780 440 660 740 520 C1060 380 1340 280 1520 200 C1600 160 1600 120 1600 80 Z;
            M1600 0 C1400 100 1200 220 900 340 C600 460 300 600 0 900 C180 760 420 640 720 500 C1040 360 1320 260 1500 180 C1580 140 1600 100 1600 60 Z
            "
                    />
                </path>

                {/* MIDDLE RIBBON */}
                <path
                    fill="url(#midGradient1)"
                    d="M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z"
                >
                    <animate
                        attributeName="d"
                        dur="32s"
                        repeatCount="indefinite"
                        values="
            M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z;
            M1600 100 C1360 260 1100 380 780 480 C480 580 240 720 0 900 C240 820 500 720 780 580 C1100 440 1380 340 1540 280 C1600 240 1600 200 1600 160 Z;
            M1600 80 C1340 240 1080 360 760 460 C460 560 220 700 0 900 C220 800 480 700 760 560 C1080 420 1360 320 1520 260 C1600 220 1600 180 1600 140 Z
            "
                    />
                </path>

                {/* FRONT RIBBON */}
                <path
                    fill="url(#frontGradient1)"
                    d="M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z"
                >
                    <animate
                        attributeName="d"
                        dur="38s"
                        repeatCount="indefinite"
                        values="
            M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z;
            M1600 200 C1280 400 1000 540 660 640 C400 720 220 800 0 900 C280 860 560 780 840 660 C1140 520 1420 420 1560 360 C1600 320 1600 280 1600 240 Z;
            M1600 180 C1260 380 980 520 640 620 C380 700 200 780 0 900 C260 840 540 760 820 640 C1120 500 1400 400 1540 340 C1600 300 1600 260 1600 220 Z
            "
                    />
                </path>
            </svg>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl px-0 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 h-full mt-4 sm:mt-8 lg:mt-16">

                {/* LEFT SECTION – Image with Quote */}
                <div className="lg:w-1/2 hidden lg:block relative">
                    {/* Quote Text */}
                    <div className="mb-4">
                        <div className="flex items-start">
                            <span className="text-6xl text-[#4a4a4a] font-serif leading-none mr-2">"</span>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-serif italic text-[#4a4a4a] leading-tight">
                                    The Future of the World<br />
                                    is in the Classroom Today.
                                </h1>
                            </div>
                            <span className="text-6xl text-[#4a4a4a] font-serif leading-none ml-2">"</span>
                        </div>
                        <p className="text-lg text-[#c45c3e] italic mt-3 ml-8">
                            ~ Inspired to Learn ~
                        </p>
                    </div>
                    {/* Education Image */}
                    <img
                        src={loginEducation}
                        alt="Education"
                        className="w-full max-w-lg h-auto object-contain ml-12"
                    />
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                            <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-primary-800 dark:text-primary-200 font-bold tracking-wider animate-pulse">SIGNING IN...</p>
                        </div>
                    </div>
                )}

                {/* RIGHT SECTION – LOGIN CARD */}
                <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl sm:rounded-[2rem] shadow-2xl p-4 sm:p-6 my-2 sm:my-4 border border-white/50 backdrop-blur-sm relative z-20">

                        {/* Logo area */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <img src={logo} alt="PGC Logo" className="h-12 sm:h-16 w-auto object-contain" />
                        </div>

                        <div className="text-center mb-2 sm:mb-3">
                            <h2 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white font-serif mb-0.5 sm:mb-1">
                                Student Portal
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                                Please sign in to your dashboard
                            </p>
                        </div>

                        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                            {/* Error Message */}
                            {error && (
                                <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-primary-600 rounded-r-lg flex items-start gap-2 sm:gap-3 text-red-800 dark:text-red-300 text-[11px] sm:text-xs animate-fade-in">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    Email / Student ID
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none pr-10 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 014.134-5.411z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-[10px] sm:text-sm">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 transition-colors"
                                    />
                                    <span>Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white font-bold py-2.5 sm:py-3 rounded-lg text-[11px] sm:text-sm tracking-wide transition-all shadow-lg shadow-primary-700/30 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                SIGN IN
                            </button>
                        </form>


                        <div className="relative my-3 sm:my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] sm:text-xs">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">Having trouble?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <a href="mailto:IftikharXahid@gmail.com" className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 active:text-primary-900 transition-colors uppercase tracking-wider group">
                                Contact IT Support Services
                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
