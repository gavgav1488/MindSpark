'use client';

import React, { useState } from 'react';

export default function MoodTrackerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [moodLevel, setMoodLevel] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Здесь будет логика сохранения записи настроения
    console.log('Saving mood entry:', { selectedDate, moodLevel, notes });
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
          <div className="bg-white shadow rounded-lg p-6">
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}