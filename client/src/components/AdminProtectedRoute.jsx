import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Wait for auth to finish loading before making redirect decisions
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Check if user is logged in and has admin or teacher role
    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
