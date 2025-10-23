'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Главная панель</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Добро пожаловать в ваш дашборд!</h2>
              <p className="text-gray-500 mb-6">Выберите раздел для отслеживания:</p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/dashboard/mood-tracker"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Трекер настроения
                </Link>
                <Link 
                  href="/dashboard/habits"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Трекер привычек
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}