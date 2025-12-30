import React from 'react';
import { Link } from 'react-router-dom';
import PGCLogo from '../assets/punjab-college-logo.png';
import { X } from 'lucide-react';

const Notification = ({ isOpen, onClose, notificationData }) => {
    // Safely extract values with fallback defaults
    const data = notificationData || {};
    const title = data.title || 'Admissions Open';
    const session = data.session || 'Fall 2025 Session';
    const description = data.description || '';
    const buttonText = data.buttonText || 'Apply Now';
    const buttonLink = data.buttonLink || '/admissions';
    const imageUrl = data.imageUrl || '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-xs bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-700/50"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button - Compact */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 p-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-full transition-all z-10"
                    aria-label="Close notification"
                >
                    <X size={14} />
                </button>

                <div className="flex flex-col items-center text-center p-4">
                    {/* Logo - White background with red circle */}
                    <div className="w-12 h-12 mb-2 relative">
                        <div className="absolute inset-0 bg-white rounded-full ring-2 ring-red-500"></div>
                        <img
                            src={PGCLogo}
                            alt="Punjab College Logo"
                            className="w-full h-full object-contain relative z-10 drop-shadow-sm"
                        />
                    </div>

                    {/* Text Content - Compact */}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">
                        {title}
                    </h2>
                    <span className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2">
                        {session}
                    </span>
                    {description && (
                        <p className="text-gray-500 dark:text-gray-300 text-xs mb-3 leading-relaxed max-w-[220px]">
                            {description}
                        </p>
                    )}

                    {/* Advertisement Image - Compact */}
                    {imageUrl && (
                        <div className="w-full mb-3 rounded-lg overflow-hidden shadow-sm">
                            <img
                                src={imageUrl}
                                alt="Advertisement"
                                className="w-full h-auto max-h-28 sm:max-h-36 object-contain rounded-lg"
                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Action Button - Modern */}
                    <Link
                        to={buttonLink}
                        onClick={onClose}
                        className="w-full block text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        {buttonText}
                    </Link>
                </div>

                {/* Bottom Accent - Gradient */}
                <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
            </div>
        </div>
    );
};

export default Notification;

