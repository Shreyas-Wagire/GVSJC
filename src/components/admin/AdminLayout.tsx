import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  LayoutDashboard, 
  Settings2, 
  LogOut, 
  BellRing,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { name: 'Notice Board', to: '/admin/notices', icon: BellRing },
  { name: 'Site Content', to: '/admin/content', icon: Settings2 },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile nav header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between z-20">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-gray-800">
          <Building2 className="w-6 h-6 text-primary" />
          <span>Admin Panel</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-white border-r transition-transform duration-200 ease-in-out z-10 flex flex-col pt-16 md:pt-0`}
      >
        <div className="hidden md:flex p-6 items-center gap-3 border-b">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">Admin Portal</h2>
            <p className="text-xs text-gray-500">Gurukul Vidyalay</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = link.to === '/admin' ? pathname === '/admin' : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
          
          <Button
            variant="outline"
            className="w-full mt-4 justify-center"
            asChild
          >
            <Link to="/">Back to Website</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-800/20 z-0 md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
