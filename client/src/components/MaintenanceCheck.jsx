import { useState, useEffect, createContext, useContext } from 'react';
import { Wrench, AlertTriangle } from 'lucide-react';

// Context for maintenance mode
const MaintenanceContext = createContext({
    isMaintenanceMode: false,
    isLoading: true,
    refetch: () => { }
});

export const useMaintenanceMode = () => useContext(MaintenanceContext);

// Provider component
export const MaintenanceProvider = ({ children }) => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMaintenanceStatus = async () => {
        try {
            const response = await fetch('/api/settings/maintenanceMode');
            const data = await response.json();
            if (data.success) {
                setIsMaintenanceMode(data.data.value === true);
            }
        } catch (error) {
            console.error('Failed to check maintenance status:', error);
            setIsMaintenanceMode(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenanceStatus();

        // Poll every 30 seconds to check for status changes
        const interval = setInterval(fetchMaintenanceStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MaintenanceContext.Provider value={{
            isMaintenanceMode,
            isLoading,
            refetch: fetchMaintenanceStatus
        }}>
            {children}
        </MaintenanceContext.Provider>
    );
};

import MaintenancePage from '../pages/MaintenancePage';

// Maintenance Page Component Removed - Using shared component from pages/MaintenancePage.jsx


// HOC to wrap routes that should check for maintenance
export const MaintenanceCheck = ({ children, bypassForAdmin = true }) => {
    const { isMaintenanceMode, isLoading } = useMaintenanceMode();

    // Check if user is admin (from localStorage or context)
    const isAdmin = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.role === 'admin' || user.isAdmin === true;
        } catch {
            return false;
        }
    };

    // Show loading spinner while checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // If maintenance mode is ON and user is not admin, show maintenance page
    if (isMaintenanceMode && !(bypassForAdmin && isAdmin())) {
        return <MaintenancePage />;
    }

    // Otherwise, render children normally
    return children;
};

export default MaintenanceCheck;
