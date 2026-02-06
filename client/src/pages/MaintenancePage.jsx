import { Wrench, Lock } from 'lucide-react';
import logo from '../assets/punjab-college-logo.png';
import PropTypes from 'prop-types';

const MaintenancePage = ({
    title = "We'll Be Right Back",
    message = "Our website is currently undergoing scheduled maintenance.",
    statusTitle = "Maintenance in Progress",
    statusMessage = "We're making improvements to serve you better. Thank you for your patience.",
    contactEmail = "admin@punjabcollege.edu.pk",
    icon = "wrench"
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-center border border-gray-200 dark:border-gray-700">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${icon === 'lock'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-primary-100 dark:bg-primary-900/30'
                        }`}>
                        {icon === 'lock' ? (
                            <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                            <Wrench className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        )}
                    </div>

                    {/* Heading */}
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {title}
                    </h1>

                    {/* Message */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
                        {message}
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                        <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold mb-1">
                            {statusTitle}
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                            {statusMessage}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 mb-3">
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-0.5">For assistance</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {contactEmail}
                        </p>
                    </div>

                    {/* PGC Branding - Only show if it's the main maintenance page, checking by title roughly or just always small */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center gap-2 opacity-80">
                            <img src={logo} alt="Punjab College Logo" className="w-8 h-8 object-contain" />
                            <div className="text-left">
                                <p className="text-xs font-bold text-primary-700 dark:text-primary-400 leading-none">
                                    Punjab Group of Colleges
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

MaintenancePage.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    statusTitle: PropTypes.string,
    statusMessage: PropTypes.string,
    contactEmail: PropTypes.string,
    icon: PropTypes.oneOf(['wrench', 'lock'])
};

export default MaintenancePage;
