import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  native_language: string;
}

interface Subscription {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | null;
  current_period_end?: string;
}

interface AppContextType {
  user: User | null;
  subscription: Subscription | null;
  isPremium: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing';

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
        await refreshSubscription();
      }
      setLoading(false);
    })();
  }, []);

  async function refreshSubscription() {
    try {
      const { data } = await api.get('/subscriptions/me');
      setSubscription(data);
    } catch {
      setSubscription(null);
    }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    await refreshSubscription();
  }

  async function register(email: string, password: string, full_name: string) {
    const { data } = await api.post('/auth/register', { email, password, full_name });
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function logout() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    try { await api.post('/auth/logout', { refreshToken }); } catch {}
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    setUser(null);
    setSubscription(null);
  }

  async function refreshUser() {
    const { data } = await api.get('/progress/dashboard');
    const updated = { ...user, ...data.user };
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setSubscription(data.subscription);
  }

  return (
    <AppContext.Provider value={{ user, subscription, isPremium, loading, login, register, logout, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
