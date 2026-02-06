import React from 'react';
import { Link } from 'react-router-dom';
import PGCLogo from '../assets/punjab-college-logo.png';
import { X } from 'lucide-react';

const Notification = ({ isOpen, onClose, notificationData }) => {
    // If no data loaded yet, don't render
    if (!notificationData) return null;

    // Safely extract values - API provides defaults, these are ultimate fallbacks
    const data = notificationData;
    const title = data.title || 'Notification';
    const session = data.session || '';
    const description = data.description || '';
    const buttonText = data.buttonText || 'Learn More';
    const buttonLink = data.buttonLink || '/';
    const imageUrl = data.imageUrl || '';

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[92vw] xs:max-w-[85vw] sm:max-w-sm md:max-w-md max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700 flex flex-col mx-auto"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {/* Hide scrollbar for webkit browsers */}
                <style>{`
                    .notification-modal::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {/* Close Button - Touch-friendly on mobile */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 sm:right-3 sm:top-3 p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white rounded-full transition-all z-20 touch-manipulation"
                    aria-label="Close notification"
                >
                    <X size={18} className="sm:w-5 sm:h-5" />
                </button>

                <div className="flex flex-col items-center text-center p-4 xs:p-5 sm:p-6 md:p-8">
                    {/* Logo - Responsive sizing for all screens */}
                    <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 xs:mb-3 sm:mb-4 relative flex-shrink-0">
                        <div className="absolute inset-0 bg-white rounded-full ring-2 ring-red-500 shadow-lg"></div>
                        <img
                            src={PGCLogo}
                            alt="Punjab College Logo"
                            className="w-full h-full object-contain relative z-10 drop-shadow-sm"
                        />
                    </div>

                    {/* Text Content - Better mobile typography */}
                    <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight px-2">
                        {title}
                    </h2>

                    {session && (
                        <span className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] xs:text-xs font-semibold px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2 xs:mb-2.5 sm:mb-3">
                            {session}
                        </span>
                    )}

                    {description && (
                        <p className="text-gray-600 dark:text-gray-300 text-xs xs:text-sm sm:text-sm mb-3 xs:mb-3.5 sm:mb-4 leading-relaxed px-1 max-w-full">
                            {description}
                        </p>
                    )}

                    {/* Advertisement Image - Better mobile sizing */}
                    {imageUrl && (
                        <div className="w-full mb-3 xs:mb-3.5 sm:mb-4 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                            <img
                                src={imageUrl}
                                alt="Advertisement"
                                className="w-full h-auto max-h-24 xs:max-h-28 sm:max-h-36 md:max-h-44 object-contain"
                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Action Button - Touch-friendly sizing */}
                    <Link
                        to={buttonLink}
                        onClick={onClose}
                        className="w-full block text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 text-white font-semibold text-xs xs:text-sm py-2.5 xs:py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 touch-manipulation"
                    >
                        {buttonText}
                    </Link>
                </div>

                {/* Bottom Accent - Gradient */}
                <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 flex-shrink-0"></div>
            </div>
        </div>
    );
};

export default Notification;
