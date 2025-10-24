'use client';

import React from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ваши достижения</h2>
      
      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет достижений</h3>
          <p className="mt-1 text-sm text-gray-500">Начните использовать приложение, чтобы разблокировать достижения</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`border rounded-xl p-4 flex items-start space-x-4 transition-all ${
                achievement.unlocked 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                achievement.unlocked 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <span className="font-bold text-lg">
                  {achievement.id}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {achievement.description}
                </p>
                {achievement.progress !== undefined && achievement.target !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{achievement.progress} / {achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}