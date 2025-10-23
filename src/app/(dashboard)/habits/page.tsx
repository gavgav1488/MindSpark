'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  createHabit, 
  getHabits, 
  deleteHabit, 
  createHabitEntry, 
  getHabitEntries 
} from '@/lib/supabase/habits';

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [habitEntries, setHabitEntries] = useState<any>({});
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Загружаем привычки пользователя
          await loadHabits(user.id);
          // Загружаем напоминания
          loadReminders();
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
      
      // Загружаем записи о выполнении привычек для сегодняшней даты
      const today = new Date().toISOString().split('T')[0];
      const entries: any = {};
      
      for (const habit of userHabits) {
        const habitEntries = await getHabitEntries(habit.id, today, today);
        entries[habit.id] = habitEntries.length > 0 ? habitEntries[0] : null;
      }
      
      setHabitEntries(entries);
    } catch (err) {
      console.error('Error loading habits:', err);
    }
  };

  const loadReminders = () => {
    // Загружаем напоминания из localStorage
    const savedReminders = localStorage.getItem('habitReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  };

  const saveReminders = (newReminders: any[]) => {
    // Сохраняем напоминания в localStorage
    localStorage.setItem('habitReminders', JSON.stringify(newReminders));
    setReminders(newReminders);
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
    } catch (err: any) {
      setError(err.message || 'Ошибка добавления привычки');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (id: number) => {
    try {
      await deleteHabit(id);
      // Обновляем список привычек
      if (user) {
        await loadHabits(user.id);
      }
      
      // Удаляем напоминания для этой привычки
      const updatedReminders = reminders.filter(reminder => reminder.habitId !== id);
      saveReminders(updatedReminders);
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления привычки');
    }
  };

  const toggleHabitCompletion = async (habitId: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = habitEntries[habitId];
      
      if (existingEntry) {
        // Обновляем существующую запись
        await supabase
          .from('habit_entries')
          .update({ completed: !existingEntry.completed })
          .eq('id', existingEntry.id);
      } else {
        // Создаем новую запись
        await createHabitEntry({
          habit_id: habitId,
          entry_date: today,
          completed: true,
        });
      }
      
      // Обновляем список привычек и записей
      if (user) {
        await loadHabits(user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления привычки');
    }
  };

  const addReminder = (habitId: number, time: string) => {
    const newReminder = {
      id: Date.now(),
      habitId,
      time,
      enabled: true,
    };
    
    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
  };

  const toggleReminder = (id: number) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    saveReminders(updatedReminders);
  };

  const deleteReminder = (id: number) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Трекер привычек</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Новая привычка"
                />
                <button
                  type="button"
                  onClick={handleAddHabit}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Добавление...' : 'Добавить'}
                </button>
              </div>
            </div>

            {/* Напоминания */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Напоминания</h2>
              <div className="space-y-3">
                {reminders.length === 0 ? (
                  <p className="text-gray-500 text-sm">У вас пока нет напоминаний.</p>
                ) : (
                  reminders.map((reminder) => {
                    const habit = habits.find(h => h.id === reminder.habitId);
                    return (
                      <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={() => toggleReminder(reminder.id)}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {habit ? habit.name : 'Неизвестная привычка'}
                            </p>
                            <p className="text-xs text-gray-500">
                              В {reminder.time}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Ваши привычки</h2>
              {habits.length === 0 ? (
                <p className="text-gray-500 text-center py-4">У вас пока нет привычек. Добавьте первую!</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {habits.map((habit) => {
                    const entry = habitEntries[habit.id];
                    const isCompleted = entry?.completed || false;
                    const habitReminders = reminders.filter(r => r.habitId === habit.id);
                    
                    return (
                      <li key={habit.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleHabitCompletion(habit.id)}
                              className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className={`ml-3 text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {habit.name}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const time = prompt('Введите время напоминания (ЧЧ:ММ):', '09:00');
                                if (time) {
                                  addReminder(habit.id, time);
                                }
                              }}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Напоминание
                            </button>
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                        
                        {habitReminders.length > 0 && (
                          <div className="ml-8 mt-2 space-y-1">
                            {habitReminders.map(reminder => (
                              <div key={reminder.id} className="text-xs text-gray-500 flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${reminder.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Напоминание в {reminder.time}
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}