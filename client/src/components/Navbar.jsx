import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/punjab-college-logo.png";
import placeholder from "../assets/placeholder-profile.jpg";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Courses', path: '/courses' },
    { name: 'Campus Life', path: '/campus-life' },
    { name: 'Results', path: '/results' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed w-full z-50 font-sans transition-all duration-300">


      {/* Main Navbar */}
      <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img className="h-12 w-auto md:h-14 transition-transform group-hover:scale-105" src={logo} alt="College Logo" />
              <div className="ml-4 flex flex-col justify-center">
                <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-primary-700 transition-colors">
                  PUNJAB COLLEGE
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-1">
                  Fort Abbas
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-bold uppercase tracking-wide py-2 transition-colors duration-200 group
                    ${location.pathname === link.path 
                      ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-700' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-700 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${location.pathname === link.path ? 'scale-x-100' : ''}`}></span>
                </Link>
              ))}

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Login/Profile */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-700 focus:outline-none"
                  >
                     <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-primary-100 transition-all">
                        <img 
                          src={user.image || user.profilePicture || placeholder} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                     </div>
                     <span className="font-semibold text-sm">{user.name}</span>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 animate-fade-in z-50">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">My Profile</Link>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 text-sm">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-primary-700 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-primary-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Student Portal
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-4">
              {/* Mobile theme toggle */}
              <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
                {isDarkMode ? (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-primary-700 bg-primary-50 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
               <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 px-3">
                  {user ? (
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={user.image || user.profilePicture || placeholder} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                         <button onClick={logout} className="text-xs text-red-600 hover:underline">Logout</button>
                       </div>
                    </div>
                  ) : (
                    <Link to="/login" className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-700 hover:bg-primary-800">
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
