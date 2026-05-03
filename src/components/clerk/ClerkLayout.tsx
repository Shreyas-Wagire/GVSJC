import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Wallet,
  FileText,
  CreditCard,
  HeartHandshake,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { name: 'Dashboard',      to: '/clerk',                     icon: LayoutDashboard },
  { name: 'New Admission',  to: '/clerk/admissions',          icon: UserPlus },
  { name: 'Applications',   to: '/clerk/applications',        icon: FileText },
  { name: 'Enrollment',     to: '/clerk/enrollment',          icon: Users },
  { name: 'Fee Collection', to: '/clerk/fees',                icon: Wallet },
  { name: 'Donations',      to: '/clerk/donations',           icon: HeartHandshake },
  { name: 'Queries',        to: '/clerk/queries',             icon: MessageSquare },
  { name: 'Feedback',       to: '/clerk/feedback',            icon: Star },
  { name: 'Bonafide Cert.', to: '/clerk/bonafide',            icon: FileText },
  { name: 'Leaving Cert.',  to: '/clerk/leaving-certificate', icon: FileText },
  { name: 'ID Card',        to: '/clerk/idcard',              icon: CreditCard },
  { name: 'Notices',        to: '/clerk/notices',             icon: Bell },
];


export default function ClerkLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('clerkLoggedIn');
    navigate('/clerk/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile nav header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between z-20">
        <Link to="/clerk" className="flex items-center gap-2 font-bold text-gray-800">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-8 h-8 object-contain rounded-full shadow-sm bg-white" />
          <span>Clerk Panel</span>
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
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-10 h-10 object-contain rounded-full shadow-sm bg-white shrink-0" />
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">Clerk Portal</h2>
            <p className="text-xs text-gray-500">Gurukul Vidyalay</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = link.to === '/clerk' ? pathname === '/clerk' : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" /> Switch to Admin Panel
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
          <Button variant="outline" className="w-full justify-center" asChild>
            <Link to="/">Back to Website</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
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
