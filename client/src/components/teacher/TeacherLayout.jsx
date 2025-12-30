import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';

const TeacherLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <TeacherSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <TeacherHeader
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="lg:ml-64 pt-16 min-h-screen transition-all duration-300">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
