'use client';

import React, { useState } from 'react';

interface MoodEntry {
  id: number;
  user_id: string;
  mood_level: number;
  notes: string;
  entry_date: string;
  created_at: string;
}

interface MoodCalendarProps {
  moodEntries?: MoodEntry[];
}

export default function MoodCalendar({ moodEntries = [] }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Получаем количество дней в месяце
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Получаем первый день месяца (0-6, где 0 это воскресенье)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Получаем название месяца
  const getMonthName = (month: number) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[month];
  };

  // Переход к предыдущему месяцу
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Переход к следующему месяцу
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Получаем настроение для конкретной даты
  const getMoodForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return moodEntries.find(entry => entry.entry_date === dateString);
  };

  // Рендерим календарь
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Создаем массив дней месяца
    const days = [];
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    // Добавляем ячейки для дней текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const moodEntry = getMoodForDate(date);
      
      let moodClass = '';
      if (moodEntry) {
        switch (moodEntry.mood_level) {
          case 1:
            moodClass = 'bg-red-500';
            break;
          case 2:
            moodClass = 'bg-orange-500';
            break;
          case 3:
            moodClass = 'bg-yellow-500';
            break;
          case 4:
            moodClass = 'bg-green-500';
            break;
          case 5:
            moodClass = 'bg-blue-500';
            break;
          default:
            moodClass = 'bg-gray-500';
        }
      }
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`h-12 flex items-center justify-center border border-gray-200 rounded-lg ${
            moodEntry ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">{day}</span>
            {moodEntry && (
              <div className={`w-3 h-3 rounded-full ${moodClass} mt-1`}></div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Предыдущий месяц"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h3>
        
        <button 
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Следующий месяц"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
    </div>
  );
}