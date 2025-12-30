import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', id }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const styles = {
        success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
        warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };

    return (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} min-w-[300px]`}>
                {icons[type]}
                <p className="font-medium flex-1">{message}</p>
            </div>
        </div>
    );
};

export default Toast;
