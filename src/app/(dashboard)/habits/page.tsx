'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createHabit, getHabits, updateHabit, deleteHabit, createHabitEntry, getHabitEntries } from '@/lib/supabase/habit-utils';

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [habitEntries, setHabitEntries] = useState<any>({});
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [editHabitName, setEditHabitName] = useState('');

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Загружаем привычки пользователя
          await loadHabits(user.id);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    getUser();
  }, []);

  const loadHabits = async (userId: string) => {
    try {
      const userHabits = await getHabits(userId);
      setHabits(userHabits);
      
      // Загружаем записи о выполнении привычек
      const entries: any = {};
      for (const habit of userHabits) {
        const habitEntries = await getHabitEntries(habit.id);
        entries[habit.id] = habitEntries;
      }
      setHabitEntries(entries);
    } catch (err) {
      console.error('Error loading habits:', err);
    }
  };

  const handleAddHabit = async () => {
    if (!user) {
      setError('Вы должны быть авторизованы для добавления привычек');
      return;
    }

    if (newHabit.trim() === '') {
      setError('Название привычки не может быть пустым');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createHabit({
        user_id: user.id,
        name: newHabit,
        description: '',
        frequency: 'daily',
      });

      // Обновляем список привычек
      await loadHabits(user.id);
      
      // Сбрасываем форму
      setNewHabit('');
      setSuccess('Привычка успешно добавлена!');
    } catch (err: any) {
      setError(err.message || 'Ошибка добавления привычки');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: number) => {
    if (!user) {
      setError('Вы должны быть авторизованы для изменения привычек');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = habitEntries[habitId]?.find(
        (entry: any) => entry.entry_date === today
      );

      if (existingEntry) {
        // Обновляем существующую запись
        await updateHabitEntry(existingEntry.id, {
          completed: !existingEntry.completed,
        });
      } else {
        // Создаем новую запись
        await createHabitEntry({
          habit_id: habitId,
          entry_date: today,
          completed: true,
        });
      }

      // Обновляем локальное состояние
      await loadHabits(user.id);
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления привычки');
    }
  };

  const handleEditHabit = (habit: any) => {
    setEditingHabitId(habit.id);
    setEditHabitName(habit.name);
  };

  const handleUpdateHabit = async () => {
    if (!editingHabitId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateHabit(editingHabitId, { name: editHabitName });

      // Обновляем список привычек
      if (user) {
        await loadHabits(user.id);
      }
      
      setSuccess('Привычка успешно обновлена!');
      setEditingHabitId(null);
      setEditHabitName('');
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления привычки');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId: number) => {
    if (!user) {
      setError('Вы должны быть авторизованы для удаления привычек');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteHabit(habitId);

      // Обновляем список привычек
      await loadHabits(user.id);
      setSuccess('Привычка успешно удалена!');
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления привычки');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения прогресса привычки
  const getHabitProgress = (habitId: number) => {
    const entries = habitEntries[habitId] || [];
    if (entries.length === 0) return 0;
    
    const recentEntries = entries.slice(-7); // Последние 7 дней
    const completedCount = recentEntries.filter((entry: any) => entry.completed).length;
    
    return Math.round((completedCount / recentEntries.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Трекер привычек</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Формируйте полезные привычки и отслеживайте свой прогресс
          </p>
        </div>

        {/* Add Habit Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {editingHabitId ? 'Редактировать привычку' : 'Добавить новую привычку'}
          </h2>
          
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 border border-green-200">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {editingHabitId ? (
              <>
                <input
                  type="text"
                  value={editHabitName}
                  onChange={(e) => setEditHabitName(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white transition-all duration-300"
                  placeholder="Название привычки"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateHabit}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-lg font-medium"
                  >
                    {loading ? 'Обновление...' : 'Обновить'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingHabitId(null);
                      setEditHabitName('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 text-lg font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white transition-all duration-300"
                  placeholder="Новая привычка (например, пить больше воды)"
                />
                <button
                  onClick={handleAddHabit}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-medium min-w-[180px]"
                >
                  {loading ? 'Добавление...' : 'Добавить'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Habits List */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ваши привычки</h2>
          
          {habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 text-gray-300 flex items-center justify-center mb-6">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-2 text-2xl font-medium text-gray-900">Нет привычек</h3>
              <p className="mt-2 text-gray-500 text-lg">
                Добавьте первую привычку, чтобы начать отслеживание
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {habits.map((habit) => {
                const progress = getHabitProgress(habit.id);
                const todayEntry = habitEntries[habit.id]?.find(
                  (entry: any) => entry.entry_date === new Date().toISOString().split('T')[0]
                );
                
                return (
                  <div 
                    key={habit.id} 
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{habit.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditHabit(habit)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                          aria-label="Редактировать"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          aria-label="Удалить"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Прогресс за неделю</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          todayEntry?.completed
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {todayEntry?.completed ? 'Выполнено ✓' : 'Отметить'}
                      </button>
                      
                      <div className="text-sm text-gray-500">
                        {habitEntries[habit.id]?.filter((e: any) => e.completed).length || 0} раз выполнено
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
