'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createMoodEntry, getMoodEntries, updateMoodEntry, deleteMoodEntry } from '@/lib/supabase/mood-utils';
import MoodCalendar from '@/components/ui/mood-calendar';
import MoodChart from '@/components/ui/mood-chart';

export default function MoodTrackerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [moodLevel, setMoodLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  useEffect(() => {
    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Загружаем записи настроения пользователя
          await loadMoodEntries(user.id);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    getUser();
  }, []);

  const loadMoodEntries = async (userId: string) => {
    try {
      const entries = await getMoodEntries(userId);
      setMoodEntries(entries);
    } catch (err) {
      console.error('Error loading mood entries:', err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError('Вы должны быть авторизованы для сохранения записей');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingEntryId) {
        // Обновляем существующую запись
        await updateMoodEntry(editingEntryId, {
          mood_level: moodLevel,
          notes,
          entry_date: selectedDate,
        });
        setSuccess('Запись успешно обновлена!');
      } else {
        // Создаем новую запись
        await createMoodEntry({
          user_id: user.id,
          mood_level: moodLevel,
          notes,
          entry_date: selectedDate,
        });
        setSuccess('Запись успешно сохранена!');
      }

      // Обновляем список записей
      await loadMoodEntries(user.id);
      
      // Сбрасываем форму
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения записи');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: any) => {
    setSelectedDate(entry.entry_date);
    setMoodLevel(entry.mood_level);
    setNotes(entry.notes);
    setEditingEntryId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!user) {
      setError('Вы должны быть авторизованы для удаления записей');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteMoodEntry(id);
      setSuccess('Запись успешно удалена!');
      
      // Обновляем список записей
      await loadMoodEntries(user.id);
      
      // Если удаляем редактируемую запись, сбрасываем форму
      if (editingEntryId === id) {
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления записи');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setMoodLevel(3);
    setNotes('');
    setEditingEntryId(null);
  };

  // Функция для отображения звездочек настроения
  const renderMoodStars = () => {
    return (
      <div className="flex justify-center space-x-2 my-4">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setMoodLevel(level)}
            className={`text-4xl transition-transform hover:scale-110 ${moodLevel >= level ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-label={`Оценить настроение на ${level} звезд${level === 1 ? 'у' : level < 5 ? 'ы' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Трекер настроения</h1>
        <p className="text-gray-600 mt-1">Отслеживайте свое эмоциональное состояние каждый день</p>
      </div>

      {/* Mood Entry Form */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {editingEntryId ? 'Редактировать запись' : 'Добавить новую запись'}
        </h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Дата
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full max-w-md border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Уровень настроения
            </label>
            {renderMoodStars()}
            <div className="text-center text-sm font-medium text-gray-700">
              {moodLevel === 1 && 'Очень плохо'}
              {moodLevel === 2 && 'Плохо'}
              {moodLevel === 3 && 'Нормально'}
              {moodLevel === 4 && 'Хорошо'}
              {moodLevel === 5 && 'Отлично'}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Заметки
            </label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Что повлияло на ваше настроение сегодня?"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {editingEntryId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Отмена
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (editingEntryId ? 'Обновление...' : 'Сохранение...') : (editingEntryId ? 'Обновить' : 'Сохранить')}
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Динамика настроения</h2>
          <MoodChart moodEntries={moodEntries} />
        </div>

        {/* Mood Calendar */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Календарь настроения</h2>
          <MoodCalendar moodEntries={moodEntries} />
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">История записей</h2>
          <span className="text-sm text-gray-500">{moodEntries.length} записей</span>
        </div>
        
        {moodEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Нет записей</h3>
            <p className="mt-1 text-sm text-gray-500">Добавьте первую запись о вашем настроении</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...moodEntries]
              .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
              .map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="text-lg font-medium">
                        {new Date(entry.entry_date).toLocaleDateString('ru-RU', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="ml-4 flex">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-2xl ${i < entry.mood_level ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        aria-label="Редактировать"
                      >
                        <span className="text-sm font-medium">✏️</span>
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        aria-label="Удалить"
                      >
                        <span className="text-sm font-medium">🗑️</span>
                      </button>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg">{entry.notes}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}