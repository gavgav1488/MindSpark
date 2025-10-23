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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Динамика настроения</h2>
      
      {lastEntries.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Нет данных для отображения</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between h-32">
            {lastEntries.map((entry, index) => (
              <div key={entry.id} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(entry.entry_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </div>
                <div 
                  className={`w-8 ${getMoodColor(entry.mood_level)} rounded-t`}
                  style={{ height: `${entry.mood_level * 20}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">
                  {entry.mood_level}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex items-center">
                <div className={`w-4 h-4 ${getMoodColor(level)} rounded`}></div>
                <span className="ml-1 text-xs text-gray-600">{getMoodLabel(level)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}