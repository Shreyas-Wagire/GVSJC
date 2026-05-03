import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { session, loading, role } = useAuth();
  const adminLoggedIn = typeof window !== 'undefined' && localStorage.getItem('adminLoggedIn') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated as clerk, redirect them to clerk portal
  if (session && role === 'clerk') {
    return <Navigate to="/clerk" replace />;
  }

  // Check if session exists OR admin local login flag
  if (!session && !adminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
