import { useState } from 'react';

const ImageWithLoader = ({ src, alt, className }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative">
            {/* Skeleton loader - shown while image loads */}
            {isLoading && (
                <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}>
                    <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />

            {/* Error fallback */}
            {hasError && (
                <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
                    <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">Image unavailable</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageWithLoader;
