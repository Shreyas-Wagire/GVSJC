import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LockKeyhole } from 'lucide-react';

export default function ClerkLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { session, loading: authLoading, role } = useAuth();

  // If already logged in as clerk, redirect to clerk dashboard
  if (!authLoading && session && role === 'clerk') {
    return <Navigate to="/clerk" replace />;
  }
  // If logged in as admin, go to admin
  if (!authLoading && session && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Default clerk shortcut for development
      if (email === 'clerk@school.com' && password === 'clerk@gvsc') {
        toast.success('Successfully logged in as Clerk');
        localStorage.setItem('clerkLoggedIn', 'true');
        navigate('/clerk', { replace: true });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast.success('Successfully logged in');
      navigate('/clerk');
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
        <div className="flex justify-center">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-20 h-20 object-contain rounded-full shadow-md bg-white border border-gray-100" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight text-gray-900">
          Clerk Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the Clerk Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="clerk-email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="clerk-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="clerk@school.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clerk-password">Password</Label>
              <div className="mt-2">
                <Input
                  id="clerk-password"
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
              <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <LockKeyhole className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <a href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                Admin? Login here →
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Website
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
