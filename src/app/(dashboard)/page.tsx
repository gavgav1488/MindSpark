'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getMoodEntries } from '@/lib/supabase/mood-utils';
import { getHabits } from '@/lib/supabase/habit-utils';
import Achievements from '@/components/ui/achievements';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    moodEntriesCount: 0,
    habitsCount: 0,
    completedHabitsToday: 0,
    currentStreak: 0,
  });
  
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Первые шаги",
      description: "Добавьте первую запись настроения",
      icon: "first-steps",
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 2,
      title: "Исследователь",
      description: "Сделайте 5 записей настроения",
      icon: "explorer",
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: 3,
      title: "Привычка",
      description: "Добавьте первую привычку",
      icon: "habit",
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 4,
      title: "Начинающий",
      description: "Выполните 3 привычки",
      icon: "beginner",
      unlocked: false,
      progress: 0,
      target: 3,
    },
    {
      id: 5,
      title: "Последовательность",
      description: "Подряд 7 дней отслеживания настроения",
      icon: "consistency",
      unlocked: false,
      progress: 0,
      target: 7,
    },
  ]);

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Загружаем статистику
          await loadStats(user.id);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    // Обновляем достижения при изменении статистики
    updateAchievements();
  }, [stats]);

  const loadStats = async (userId: string) => {
    try {
      // Получаем количество записей настроения
      const moodEntries = await getMoodEntries(userId);
      const moodEntriesCount = moodEntries.length;
      
      // Получаем количество привычек
      const habits = await getHabits(userId);
      const habitsCount = habits.length;
      
      // Здесь можно добавить логику для подсчета выполненных привычек сегодня
      const completedHabitsToday = 0;
      
      // Подсчет текущей серии дней отслеживания настроения
      const currentStreak = calculateStreak(moodEntries);
      
      setStats({
        moodEntriesCount,
        habitsCount,
        completedHabitsToday,
        currentStreak,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const calculateStreak = (entries: any[]) => {
    if (entries.length === 0) return 0;
    
    // Сортируем записи по дате
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );
    
    // Подсчитываем серию
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastEntryDate = new Date(sortedEntries[0].entry_date);
    lastEntryDate.setHours(0, 0, 0, 0);
    
    // Проверяем, была ли запись сегодня
    if (lastEntryDate.getTime() !== today.getTime()) {
      // Если сегодня не было записи, проверяем вчерашнюю дату
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastEntryDate.getTime() !== yesterday.getTime()) {
        return 0; // Серия прервана
      }
    }
    
    // Подсчитываем непрерывную серию
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const currentDate = new Date(sortedEntries[i].entry_date);
      const nextDate = new Date(sortedEntries[i + 1].entry_date);
      
      // Проверяем, идут ли даты подряд
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const updateAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let progress = 0;
      let unlocked = false;
      
      switch (achievement.id) {
        case 1: // Первые шаги
          progress = stats.moodEntriesCount;
          unlocked = stats.moodEntriesCount >= achievement.target!;
          break;
        case 2: // Исследователь
          progress = stats.moodEntriesCount;
          unlocked = stats.moodEntriesCount >= achievement.target!;
          break;
        case 3: // Привычка
          progress = stats.habitsCount;
          unlocked = stats.habitsCount >= achievement.target!;
          break;
        case 4: // Начинающий
          progress = stats.completedHabitsToday;
          unlocked = stats.completedHabitsToday >= achievement.target!;
          break;
        case 5: // Последовательность
          progress = stats.currentStreak;
          unlocked = stats.currentStreak >= achievement.target!;
          break;
        default:
          break;
      }
      
      return {
        ...achievement,
        progress,
        unlocked,
      };
    }));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user?.email?.split('@')[0]}!</h1>
            <p className="text-indigo-100 text-lg">Отслеживайте свое настроение и привычки для улучшения качества жизни</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-xs">
              <div className="flex items-center">
                <div className="bg-white/30 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-80">Текущая серия</p>
                  <p className="text-2xl font-bold">{stats.currentStreak} дней</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ваша статистика</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-xl p-3">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Записи настроения</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-gray-900">{stats.moodEntriesCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Привычки</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-gray-900">{stats.habitsCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-xl p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Выполнено сегодня</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-gray-900">{stats.completedHabitsToday}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-xl p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Серия дней</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-gray-900">{stats.currentStreak}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ваши достижения</h2>
          <Link href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Смотреть все
          </Link>
        </div>
        <Achievements achievements={achievements} />
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link 
            href="/dashboard/mood-tracker"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border border-indigo-100 group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-2xl p-4 group-hover:bg-indigo-200 transition-colors">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Трекер настроения</h3>
                <p className="text-gray-600 mt-2">Добавьте новую запись о настроении и эмоциях</p>
                <div className="mt-4 text-indigo-600 font-medium flex items-center">
                  Начать отслеживание
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link 
            href="/dashboard/habits"
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border border-green-100 group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-2xl p-4 group-hover:bg-green-200 transition-colors">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Трекер привычек</h3>
                <p className="text-gray-600 mt-2">Создайте и отслеживайте ваши полезные привычки</p>
                <div className="mt-4 text-green-600 font-medium flex items-center">
                  Управлять привычками
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}