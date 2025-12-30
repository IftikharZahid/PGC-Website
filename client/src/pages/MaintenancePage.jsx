import { Wrench } from 'lucide-react';
import logo from '../assets/punjab-college-logo.png';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 text-center border border-gray-200 dark:border-gray-700">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                        <Wrench className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        We'll Be Right Back
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Our website is currently undergoing scheduled maintenance.
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-900 dark:text-blue-200 font-semibold mb-2">
                            Maintenance in Progress
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            We're making improvements to serve you better. Thank you for your patience.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">For urgent matters:</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            admin@punjabcollege.edu.pk
                        </p>
                    </div>

                    {/* PGC Branding */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center mb-3">
                            <img src={logo} alt="Punjab College Logo" className="w-16 h-16 object-contain" />
                        </div>
                        <p className="text-base font-bold text-primary-700 dark:text-primary-400">
                            Punjab Group of Colleges
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Excellence in Education
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
