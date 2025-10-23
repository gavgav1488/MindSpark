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
      icon: "📝",
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 2,
      title: "Исследователь",
      description: "Сделайте 5 записей настроения",
      icon: "🔍",
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: 3,
      title: "Привычка",
      description: "Добавьте первую привычку",
      icon: "✅",
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 4,
      title: "Начинающий",
      description: "Выполните 3 привычки",
      icon: "⭐",
      unlocked: false,
      progress: 0,
      target: 3,
    },
    {
      id: 5,
      title: "Последовательность",
      description: "Подряд 7 дней отслеживания настроения",
      icon: "🔥",
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
          // Обновляем достижения
          updateAchievements();
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    getUser();
  }, []);

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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Главная панель</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Записи настроения</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.moodEntriesCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Привычки</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.habitsCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Выполнено сегодня</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.completedHabitsToday}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Серия дней</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.currentStreak}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Достижения */}
        <div className="mb-8">
          <Achievements achievements={achievements} />
        </div>

        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Добро пожаловать в ваш дашборд!</h2>
              <p className="text-gray-500 mb-6">Выберите раздел для отслеживания:</p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/dashboard/mood-tracker"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Трекер настроения
                </Link>
                <Link 
                  href="/dashboard/habits"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Трекер привычек
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}