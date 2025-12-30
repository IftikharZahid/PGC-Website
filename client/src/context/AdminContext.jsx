import { createContext, useContext, useState, useEffect } from 'react';
import { initializeDemoData } from '../utils/adminStorage';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Initialize demo data on mount
    useEffect(() => {
        initializeDemoData();

        // Load dark mode preference
        const savedTheme = localStorage.getItem('admin_theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('admin_theme', newMode ? 'dark' : 'light');
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    };

    // Show notification toast
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, id: Date.now() });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    // Trigger data refresh
    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const value = {
        adminUser,
        setAdminUser,
        darkMode,
        toggleDarkMode,
        notification,
        showNotification,
        refreshTrigger,
        triggerRefresh
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContext;
