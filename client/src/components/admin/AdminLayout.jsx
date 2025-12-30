import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import Toast from './Toast';
import { useAdmin } from '../../context/AdminContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(224); // Default 56 * 4 = 224px
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const { notification } = useAdmin();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getMarginLeft = () => {
        if (!isDesktop) return 0;
        return sidebarCollapsed ? 64 : sidebarWidth;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                sidebarWidth={sidebarWidth}
                setSidebarWidth={setSidebarWidth}
            />

            {/* Main content area - Adjusts based on sidebar state */}
            <div
                className="transition-all duration-300"
                style={{ marginLeft: `${getMarginLeft()}px` }}
            >
                {/* Header */}
                <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page content - Compact */}
                <main className="pt-16 min-h-screen">
                    <div className="p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Toast notifications */}
            {notification && <Toast {...notification} />}
        </div>
    );
};

export default AdminLayout;
