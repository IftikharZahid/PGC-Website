import { CheckCircle } from 'lucide-react';

const SuccessDialog = ({ isOpen, title, message, onConfirm, confirmText = 'OK' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <button
                        onClick={onConfirm}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;
