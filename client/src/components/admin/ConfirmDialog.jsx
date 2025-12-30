import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    const buttonStyles = {
        danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white',
        warning: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white',
        primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white'
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${buttonStyles[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
