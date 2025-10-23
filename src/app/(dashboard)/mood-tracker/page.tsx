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
            className={`text-3xl ${moodLevel >= level ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Трекер настроения</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* График настроения */}
          <div className="mb-8">
            <MoodChart moodEntries={moodEntries} />
          </div>
          
          {/* Календарь настроения */}
          <div className="mb-8">
            <MoodCalendar moodEntries={moodEntries} />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Дата
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Уровень настроения
              </label>
              {renderMoodStars()}
              <div className="text-center text-sm text-gray-500">
                {moodLevel === 1 && 'Очень плохо'}
                {moodLevel === 2 && 'Плохо'}
                {moodLevel === 3 && 'Нормально'}
                {moodLevel === 4 && 'Хорошо'}
                {moodLevel === 5 && 'Отлично'}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Заметки
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Что повлияло на ваше настроение сегодня?"
              />
            </div>

            <div className="flex justify-end space-x-2">
              {editingEntryId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Отмена
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (editingEntryId ? 'Обновление...' : 'Сохранение...') : (editingEntryId ? 'Обновить' : 'Сохранить')}
              </button>
            </div>
          </div>
          
          {/* Отображение истории записей */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">История записей</h2>
            {moodEntries.length === 0 ? (
              <p className="text-gray-500">У вас пока нет записей о настроении.</p>
            ) : (
              <div className="space-y-4">
                {moodEntries.map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {new Date(entry.entry_date).toLocaleDateString('ru-RU')}
                        </span>
                        <div className="ml-4 flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-xl ${i < entry.mood_level ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="mt-2 text-gray-600">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}