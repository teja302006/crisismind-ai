import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, X, ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-brand-muted hover:text-brand-text hover:bg-slate-800/50 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
        title="Open Notifications Feed"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Click outside backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel border border-slate-700/60 shadow-glass z-50 overflow-hidden flex flex-col max-h-[480px]">
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-400">System Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3.5 flex gap-3 text-left transition-colors ${
                      notif.read ? 'bg-slate-950/20' : 'bg-slate-900/40 border-l-2 border-blue-500'
                    }`}
                  >
                    {getIcon(notif.type)}
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-xs font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed leading-normal">
                        {notif.message}
                      </p>
                      <span className="text-[9px] text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
