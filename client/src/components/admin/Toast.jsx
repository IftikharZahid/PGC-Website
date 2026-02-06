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
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className={`flex items-start gap-4 px-5 py-4 rounded-xl border shadow-xl backdrop-blur-sm ${styles[type]} min-w-[320px] max-w-[420px] transition-all transform hover:scale-[1.02]`}>
                <div className="flex-shrink-0 mt-0.5">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{type}</h4>
                    <p className="text-sm font-medium leading-relaxed">{message}</p>
                </div>
                <button className="opacity-50 hover:opacity-100 transition-opacity">
                    <XCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
