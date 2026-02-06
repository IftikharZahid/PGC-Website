import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/punjab-college-logo.png";
import logoDark from "../assets/pgc-footer-logo.png";
import placeholder from "../assets/student-portrait.png";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(true); // Default to true until fetched

  // Fetch admission status
  useEffect(() => {
    const fetchAdmissionStatus = async () => {
      try {
        const response = await fetch('/api/settings/admissionsOpen');
        const data = await response.json();
        if (data.success) {
          setAdmissionsOpen(data.data.value !== false);
        }
      } catch (error) {
        console.error('Failed to fetch admission status:', error);
      }
    };
    fetchAdmissionStatus();
  }, []);



  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Programs', path: '/programs' },
    { name: 'Campus Life', path: '/campus-life' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' }, // Positioned at end for prominence
  ];

  return (
    <header className="fixed w-full z-50 font-sans transition-all duration-300">


      {/* Main Navbar */}
      <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 py-1 sm:py-2`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img className="h-9 w-auto sm:h-10 md:h-12 lg:h-14 transition-transform group-hover:scale-105 rounded-lg" src={isDarkMode ? logoDark : logo} alt="PUNJAB COLLEGE" />
              <div className="ml-2 sm:ml-3 md:ml-4 flex flex-col justify-center">
                <span className="text-sm sm:text-base md:text-base lg:text-xl font-serif font-bold text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-primary-600 transition-colors">
                  PUNJAB COLLEGE
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-0.5 font-bold">
                  Fort Abbas
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4 xl:space-x-6">
              {navLinks.map((link) => {
                // Special styling for Admissions button
                if (link.name === 'Admissions') {
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative inline-flex items-center gap-1.5 xl:gap-2 px-3 lg:px-4 xl:px-5 py-1.5 lg:py-1.5 xl:py-2 ${admissionsOpen ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-gray-500 cursor-not-allowed'} text-white hover:!text-white font-bold text-xs lg:text-xs xl:text-sm uppercase tracking-wide rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 group overflow-hidden`}
                    >
                      <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {admissionsOpen ? (
                        <>
                          <span className="animate-pulse relative inline-flex h-2 w-2 rounded-full bg-white mr-1"></span>
                          <span className="relative z-10">Apply Now</span>
                        </>
                      ) : (
                        <span className="relative z-10">Admissions Closed</span>
                      )}
                    </Link>
                  );
                }

                // Regular styling for other links
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-[10px] lg:text-xs xl:text-sm font-bold uppercase tracking-wide px-2 lg:px-2 py-2 transition-colors duration-200 group
                      ${location.pathname === link.path
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${location.pathname === link.path ? 'scale-x-100' : ''}`}></span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-4 lg:h-5 xl:h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 lg:mx-1 xl:mx-2"></div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-500 hover:text-secondary-700 dark:text-gray-400 dark:hover:text-secondary-400 transition-colors p-1"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Login/Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-1 lg:space-x-2 text-gray-700 dark:text-gray-200 hover:text-secondary-700 focus:outline-none"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-yellow-500 to-violet-600 rounded-full blur-[1px] opacity-75 group-hover:opacity-100 animate-spin-slow transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full bg-white dark:bg-gray-800 p-[2px]">
                        <img
                          src={user.image || user.profilePicture || placeholder}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <span className="font-semibold text-[10px] lg:text-xs xl:text-sm truncate max-w-[80px] lg:max-w-none">{user.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-40 lg:w-44 xl:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 animate-fade-in z-50">
                      <Link
                        to={user.role === 'admin' ? '/admin-dashboard' : user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                        className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs xl:text-sm"
                      >
                        Dashboard
                      </Link>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 text-xs xl:text-sm">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/student-login" className="bg-primary-600 text-white hover:!text-white px-3 lg:px-4 xl:px-5 py-1.5 lg:py-1.5 xl:py-2 rounded-full font-bold text-[10px] lg:text-xs xl:text-sm hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">
                  Student Portal
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2 sm:space-x-4">
              {/* Mobile theme toggle */}
              <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                {isDarkMode ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-200 hover:text-secondary-700 focus:outline-none p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg animate-fade-in-down">
            <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                if (link.name === 'Admissions') {
                  return (
                    <div key={link.name} className="px-1 py-1">
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${admissionsOpen
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                      >
                        {admissionsOpen && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        {admissionsOpen ? 'Apply Now' : 'Admissions Closed'}
                      </Link>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors active:scale-[0.98] ${location.pathname === link.path
                      ? 'text-secondary-700 bg-secondary-50 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-secondary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 px-2 sm:px-3">
                {user ? (
                  <div>
                    <Link
                      to={user.role === 'admin' ? '/admin-dashboard' : user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="relative group flex-shrink-0">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-yellow-500 to-violet-600 rounded-full blur-[1px] opacity-75 group-hover:opacity-100 animate-spin-slow transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 p-[2px]">
                          <img
                            src={user.image || user.profilePicture || placeholder}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 truncate">View Dashboard</p>
                      </div>
                    </Link>
                    <div className="pl-14">
                      <button onClick={logout} className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline">Logout</button>
                    </div>
                  </div>
                ) : (
                  <Link to="/student-login" className="block w-full text-center px-4 py-2.5 sm:py-2 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors">
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
