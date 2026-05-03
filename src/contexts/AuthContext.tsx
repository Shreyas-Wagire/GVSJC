import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'clerk' | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  isClerk: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  isAdmin: false,
  isClerk: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const resolveRole = (sess: Session | null): UserRole => {
      if (!sess) {
        if (localStorage.getItem('adminLoggedIn') === 'true') return 'admin';
        if (localStorage.getItem('clerkLoggedIn') === 'true') return 'clerk';
        return null;
      }
      const userRole = sess.user?.user_metadata?.role;
      if (userRole === 'clerk') return 'clerk';
      return 'admin';
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(resolveRole(session));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(resolveRole(session));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = role === 'admin';
  const isClerk = role === 'clerk';

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin, isClerk }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
