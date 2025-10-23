'use client';

import React, { useState } from 'react';

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Утренняя медитация', completed: false },
    { id: 2, name: 'Выпить 8 стаканов воды', completed: true },
    { id: 3, name: 'Пройти 10000 шагов', completed: false },
  ]);
  
  const [newHabit, setNewHabit] = useState('');

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.trim() !== '') {
      const newHabitObj = {
        id: habits.length + 1,
        name: newHabit,
        completed: false
      };
      setHabits([...habits, newHabitObj]);
      setNewHabit('');
    }
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Трекер привычек</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
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
                  onClick={addHabit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Ваши привычки</h2>
              {habits.length === 0 ? (
                <p className="text-gray-500 text-center py-4">У вас пока нет привычек. Добавьте первую!</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {habits.map((habit) => (
                    <li key={habit.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={habit.completed}
                          onChange={() => toggleHabit(habit.id)}
                          className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className={`ml-3 text-sm font-medium ${habit.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {habit.name}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}