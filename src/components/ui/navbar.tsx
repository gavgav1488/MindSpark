'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = user ? [
    { name: 'Главная', href: '/dashboard' },
    { name: 'Настроение', href: '/dashboard/mood-tracker' },
    { name: 'Привычки', href: '/dashboard/habits' },
  ] : [];

  if (loading) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-indigo-600">MindSpark</span>
            </div>
            <div className="animate-pulse">Загрузка...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user ? '/dashboard' : '/'}>
                <span className="text-xl font-bold text-indigo-600">MindSpark</span>
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Войти
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}