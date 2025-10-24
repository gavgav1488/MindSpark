'use client';

import React from 'react';

interface MoodEntry {
  id: number;
  user_id: string;
  mood_level: number;
  notes: string;
  entry_date: string;
  created_at: string;
}

interface MoodChartProps {
  moodEntries: MoodEntry[];
}

export default function MoodChart({ moodEntries }: MoodChartProps) {
  // Сортируем записи по дате
  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
  );

  // Получаем последние 7 записей для отображения
  const lastEntries = sortedEntries.slice(-7);

  // Функция для получения цвета в зависимости от уровня настроения
  const getMoodColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Функция для получения светлого цвета в зависимости от уровня настроения
  const getMoodLightColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Функция для получения названия уровня настроения
  const getMoodLabel = (level: number) => {
    switch (level) {
      case 1: return 'Очень плохо';
      case 2: return 'Плохо';
      case 3: return 'Нормально';
      case 4: return 'Хорошо';
      case 5: return 'Отлично';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {lastEntries.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет данных</h3>
          <p className="mt-1 text-sm text-gray-500">Добавьте записи о настроении, чтобы увидеть график</p>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between h-40">
            {lastEntries.map((entry, index) => (
              <div key={entry.id} className="flex flex-col items-center flex-1 px-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(entry.entry_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </div>
                <div 
                  className={`${getMoodColor(entry.mood_level)} rounded-t-lg w-full flex items-end justify-center pb-2 text-white font-bold`}
                  style={{ height: `${entry.mood_level * 20}%` }}
                >
                  {entry.mood_level}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex items-center">
                <div className={`w-4 h-4 ${getMoodColor(level)} rounded`}></div>
                <span className="ml-2 text-sm text-gray-600">{getMoodLabel(level)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}