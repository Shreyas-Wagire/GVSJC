import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings2, 
  LogOut, 
  BellRing,
  Menu,
  X,
  FileText,
  MessageSquare,
  Star,
  Users,
  Trophy,
  GraduationCap,
  IndianRupee,
  HeartHandshake,
  Globe,
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { name: 'Dashboard',     to: '/admin',              icon: LayoutDashboard },
  { name: 'Notice Board',  to: '/admin/notices',       icon: BellRing },
  { name: 'Students',      to: '/admin/students',      icon: GraduationCap },
  { name: 'Admissions',    to: '/admin/admissions',    icon: FileText },
  { name: 'Fee Payments',  to: '/admin/fees',          icon: IndianRupee },
  { name: 'Donations',     to: '/admin/donations',     icon: HeartHandshake },
  { name: 'Queries',       to: '/admin/queries',       icon: MessageSquare },
  { name: 'Feedback',      to: '/admin/feedback',      icon: Star },
  { name: 'Faculty',       to: '/admin/faculty',       icon: Users },
  { name: 'Toppers',       to: '/admin/toppers',       icon: Trophy },
  { name: 'Site Content',  to: '/admin/content',       icon: Settings2 },
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
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile nav header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between z-20">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-gray-800">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-8 h-8 object-contain rounded-full shadow-sm bg-white" />
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
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-white border-r transition-transform duration-200 ease-in-out z-10 flex flex-col h-full pt-16 md:pt-0`}
      >
        <div className="hidden md:flex p-6 items-center gap-3 border-b">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-10 h-10 object-contain rounded-full shadow-sm bg-white shrink-0" />

          <div>
            <h2 className="font-bold text-gray-800 leading-tight">Admin Portal</h2>
            <p className="text-xs text-gray-500">Gurukul Vidyalay</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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

        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <Link
              to="/"
              title="Back to Website"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" /> Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto w-full">
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
