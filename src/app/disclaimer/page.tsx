'use client';

import React from 'react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Отказ от ответственности</h1>
            <p className="text-gray-600">Пожалуйста, внимательно ознакомьтесь с данной информацией</p>
          </div>

          <div className="prose prose-lg text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Важная информация</h2>
            
            <p className="mb-4">
              <strong>MindSpark</strong> - это приложение для отслеживания настроения и привычек, 
              предназначенное для помощи в саморазвитии и повышении осознанности. Однако важно понимать 
              следующие моменты:
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Не является медицинским приложением</h3>
            <p className="mb-4">
              MindSpark не является заменой профессиональной медицинской или психологической помощи. 
              Приложение не ставит диагнозы, не лечит заболевания и не предоставляет медицинские рекомендации.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Самостоятельное использование</h3>
            <p className="mb-4">
              Использование этого приложения осуществляется на ваш страх и риск. Результаты, полученные 
              с помощью приложения, не гарантируют улучшения вашего ментального здоровья или благополучия.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Конфиденциальность данных</h3>
            <p className="mb-4">
              Хотя мы предпринимаем меры для защиты вашей конфиденциальности, пожалуйста, имейте в виду, 
              что никакая система передачи данных через интернет или метод электронного хранения не является 
              на 100% безопасной.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Ограничения ответственности</h3>
            <p className="mb-4">
              Разработчики MindSpark не несут ответственности за любые прямые, косвенные, случайные, 
              специальные или последующие убытки, возникшие в результате использования или невозможности 
              использования приложения.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Изменения в отказе от ответственности</h3>
            <p className="mb-4">
              Мы оставляем за собой право вносить изменения в этот отказ от ответственности в любое время. 
              Рекомендуем периодически проверять эту страницу на наличие обновлений.
            </p>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="text-md font-medium text-yellow-800 mb-2">Если вам нужна помощь:</h4>
              <p className="text-yellow-700">
                Если вы испытываете серьезные проблемы с ментальным здоровьем, пожалуйста, обратитесь к 
                квалифицированному специалисту здравоохранения. В случае чрезвычайной ситуации немедленно 
                свяжитесь со службами экстренной помощи.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}