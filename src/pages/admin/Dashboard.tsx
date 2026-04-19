import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotices } from '@/hooks/useNotices';
import { useAuth } from '@/contexts/AuthContext';
import { BellRing, FileText, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { notices, isLoading } = useNotices();

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Notices Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : notices?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Announcements currently visible
            </p>
            <Link to="/admin/notices" className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
              Manage Notices &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* Dynamic Content Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Editable Data</div>
            <p className="text-xs text-muted-foreground mt-1">
              Text, headers, and UI strings
            </p>
            <Link to="/admin/content" className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
              Manage Content &rarr;
            </Link>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              Supabase connected successfully
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>
              A quick glance at the latest announcements on your site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : notices && notices.length > 0 ? (
              <div className="space-y-4">
                {notices.slice(0, 3).map(notice => (
                  <div key={notice.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="bg-gray-100 p-2 rounded-lg mt-1">
                      <BellRing className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{notice.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{notice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No notices found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
