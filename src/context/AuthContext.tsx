import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, NotificationItem } from '../types/index';
import { api, getToken, removeToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  unreadCount: number;
  notifications: NotificationItem[];
  login: (email: string, pass: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    year: string;
    password: string;
    confirmPassword: string;
  }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshNotifications = useCallback(async () => {
    if (!getToken()) return;
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch {
      // ignore
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const existingToken = getToken();
    if (!existingToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
      setTokenState(existingToken);
      await refreshNotifications();
    } catch {
      removeToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, [refreshNotifications]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await api.login(email, pass);
    setUser(res.user);
    setTokenState(res.token);
    await refreshNotifications();
    return res.user;
  };

  const register = async (data: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    year: string;
    password: string;
    confirmPassword: string;
  }): Promise<User> => {
    const res = await api.register(data);
    setUser(res.user);
    setTokenState(res.token);
    await refreshNotifications();
    return res.user;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setTokenState(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        notifications,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        refreshNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
