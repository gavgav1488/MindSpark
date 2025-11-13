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
      <div className="flex justify-center space-x-4 my-6">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setMoodLevel(level)}
            className={`transition-transform hover:scale-110 ${moodLevel >= level ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-label={`Оценить настроение на ${level} звезд${level === 1 ? 'у' : level < 5 ? 'ы' : ''}`}
          >
            <svg className={`w-12 h-12 ${moodLevel >= level ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Трекер настроения</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Отслеживайте свое эмоциональное состояние каждый день и находите закономерности
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Mood Entry Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {editingEntryId ? 'Редактировать запись' : 'Добавить новую запись'}
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
              
              <div className="space-y-8">
                <div>
                  <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-4">
                    Дата
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-6 text-center">
                    Ваше настроение сегодня
                  </label>
                  {renderMoodStars()}
                  <div className="text-center text-xl font-semibold text-gray-700">
                    {moodLevel === 1 && 'Очень плохо'}
                    {moodLevel === 2 && 'Плохо'}
                    {moodLevel === 3 && 'Нормально'}
                    {moodLevel === 4 && 'Хорошо'}
                    {moodLevel === 5 && 'Отлично'}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-4">
                    Заметки
                  </label>
                  <textarea
                    id="notes"
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white transition-all duration-300"
                    placeholder="Что повлияло на ваше настроение сегодня?"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {editingEntryId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg text-lg font-medium"
                    >
                      Отмена
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-medium"
                  >
                    {loading ? (editingEntryId ? 'Обновление...' : 'Сохранение...') : (editingEntryId ? 'Обновить' : 'Сохранить')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Visualization */}
          <div className="lg:col-span-2 space-y-12">
            {/* Mood Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Динамика настроения</h2>
              <MoodChart moodEntries={moodEntries} />
            </div>

            {/* Mood Calendar */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Календарь настроения</h2>
              <MoodCalendar moodEntries={moodEntries} />
            </div>
          </div>
        </div>

        {/* Mood History */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">История записей</h2>
            <span className="text-lg text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              {moodEntries.length} записей
            </span>
          </div>
          
          {moodEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 text-gray-300 flex items-center justify-center mb-6">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-2xl font-medium text-gray-900">Нет записей</h3>
              <p className="mt-2 text-gray-500 text-lg">
                Добавьте первую запись о вашем настроении, чтобы начать отслеживание
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {[...moodEntries]
                .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-medium text-gray-900">
                          {new Date(entry.entry_date).toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex space-x-2 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-7 h-7 ${i < entry.mood_level ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                          aria-label="Редактировать"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 02 2 2h2a2 2 0 002-2M9 5a2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          aria-label="Удалить"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-xl">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}