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
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ваши достижения</h2>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </span>
      </div>
      
      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-300 flex items-center justify-center mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Нет достижений</h3>
          <p className="mt-1 text-gray-500 max-w-md mx-auto">
            Начните использовать приложение, чтобы разблокировать ваши первые достижения
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`rounded-2xl p-5 flex items-start transition-all duration-300 transform hover:scale-[1.02] ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-md' 
                  : 'bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md' 
                  : 'bg-gradient-to-r from-gray-300 to-slate-300 text-gray-600'
              }`}>
                <span className="font-bold text-lg">
                  {achievement.id}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className={`text-lg font-bold ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Разблокировано
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {achievement.description}
                </p>
                {achievement.progress !== undefined && achievement.target !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{achievement.progress} / {achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          achievement.unlocked ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
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