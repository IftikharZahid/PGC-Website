import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    // Check if user is logged in and has teacher role
    if (!user || user.role !== 'teacher') {
        // Redirect them to the teacher login page, but save the current location they were trying to go to
        return <Navigate to="/admin" state={{ from: location, role: 'teacher' }} replace />;
    }

    return children;
};

export default TeacherProtectedRoute;
