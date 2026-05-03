import { useNotices } from '@/hooks/useNotices';
import { Bell, AlertCircle, CalendarDays, PartyPopper, Info } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  AlertCircle, CalendarDays, PartyPopper, Info, Bell,
};

export default function ClerkNotices() {
  const { notices, isLoading } = useNotices();

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
          <Bell className="w-7 h-7 text-emerald-600" /> Notice Board
        </h1>
        <p className="text-gray-500 mt-1">Announcements posted by the Admin</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : !notices || notices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No notices posted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => {
            const Icon = iconMap[n.icon] ?? Bell;
            return (
              <div
                key={n.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className={`w-5 h-5 ${n.icon_color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.tag_color}`}>
                      {n.tag}
                    </span>
                    {n.is_new && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">{n.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
