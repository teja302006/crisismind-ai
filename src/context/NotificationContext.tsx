import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '../../api/types';
import { apiService } from '../services/apiService';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fetchNotifications = useCallback(async () => {
    const data = await apiService.getNotifications();
    setNotifications(data);
  }, []);

  const markAllAsRead = async () => {
    await apiService.markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 8 seconds
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        showToast,
        removeToast,
        fetchNotifications,
        markAllAsRead
      }}
    >
      {children}
      
      {/* Toast Render Panel */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border backdrop-blur-md flex flex-col gap-1 transition-all duration-300 animate-slide-in ${
              toast.type === 'danger'
                ? 'bg-red-950/80 border-red-800 text-red-50'
                : toast.type === 'warning'
                ? 'bg-amber-950/80 border-amber-800 text-amber-50'
                : toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-50'
                : 'bg-slate-900/80 border-slate-800 text-slate-50'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="font-bold text-sm tracking-wide">{toast.title}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 font-mono transition-opacity"
              >
                ✕
              </button>
            </div>
            <p className="text-xs opacity-90">{toast.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
