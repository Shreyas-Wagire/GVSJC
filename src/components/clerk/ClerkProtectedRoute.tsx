import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ClerkProtectedRoute() {
  const { session, loading, role } = useAuth();
  const clerkLoggedIn = typeof window !== 'undefined' && localStorage.getItem('clerkLoggedIn') === 'true';

  // If the dev bypass flag is set, don't wait for Supabase session — let them through
  if (clerkLoggedIn) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/clerk/login" replace />;
  }

  // If authenticated via Supabase but role is admin, redirect to admin
  if (session && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

