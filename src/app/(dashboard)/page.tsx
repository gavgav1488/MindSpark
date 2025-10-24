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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Добро пожаловать в ваш дашборд!</h1>
        <p className="opacity-90">Отслеживайте свое настроение и привычки для улучшения качества жизни</p>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ваша статистика</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <span className="text-indigo-600 font-bold text-lg">1</span>
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
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <span className="text-green-600 font-bold text-lg">2</span>
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
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <span className="text-yellow-600 font-bold text-lg">3</span>
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
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <span className="text-red-600 font-bold text-lg">4</span>
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
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ваши достижения</h2>
        <Achievements achievements={achievements} />
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/dashboard/mood-tracker"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                <span className="text-indigo-600 font-bold text-lg">A</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Трекер настроения</h3>
                <p className="text-sm text-gray-500 mt-1">Добавьте новую запись о настроении</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/dashboard/habits"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <span className="text-green-600 font-bold text-lg">B</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Трекер привычек</h3>
                <p className="text-sm text-gray-500 mt-1">Управляйте своими привычками</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}