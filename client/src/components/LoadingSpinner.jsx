import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-10 h-10 border-3',
        large: 'w-16 h-16 border-4'
    };

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${sizeClasses[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
            {text && <p className="text-gray-500 font-medium text-sm animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinnerContent}
            </div>
        );
    }

    return (
        <div className="w-full h-64 flex items-center justify-center">
            {spinnerContent}
        </div>
    );
};

export default LoadingSpinner;
