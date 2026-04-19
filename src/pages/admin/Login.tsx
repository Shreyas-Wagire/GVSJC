import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building2, LockKeyhole } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin@gvsc');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  // If already logged in, redirect to dashboard
  if (!authLoading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Default admin shortcut for development
      if (email === 'admin@school.com' && password === 'admin@gvsc') {
        toast.success('Successfully logged in (default admin)');
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin', { replace: true });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Successfully logged in');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-20 h-20 object-contain rounded-full shadow-md bg-white border border-gray-100" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the control panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="admin@school.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2 text-red-500">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <LockKeyhole className="w-4 h-4 ml-2" />}
              </Button>
            </div>
            
            <div className="text-center">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                &larr; Back to Website
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
