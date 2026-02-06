import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary-900/5 blur-3xl"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary-900/5 blur-3xl"></div>
            </div>

            <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
                {/* Error Code */}
                <h1 className="text-6xl sm:text-9xl md:text-[150px] font-black text-primary-900 leading-none drop-shadow-sm select-none opacity-90 mb-4 sm:mb-0">
                    404
                </h1>

                {/* Icon & Message */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
                </div>

                <p className="text-gray-600 mb-10 text-lg">
                    Oops! The page you are looking for does not exist or has been moved.
                    Please check the URL or return to the homepage.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Homepage
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Footer Help */}
            <div className="absolute bottom-8 text-center text-sm text-gray-500">
                <p>Need assistance? <a href="mailto:support@pgc.edu" className="text-primary-700 font-semibold hover:underline">Contact Support</a></p>
            </div>
        </div>
    );
};

export default NotFound;
