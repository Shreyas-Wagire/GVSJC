import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const adminLoggedIn = typeof window !== 'undefined' && localStorage.getItem('adminLoggedIn') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if session exists (user is authenticated)
  // (In a highly robust app, you might also have role checks, but email/pass is enough here)
  if (!session && !adminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
