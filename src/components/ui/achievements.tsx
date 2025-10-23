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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Достижения</h2>
      
      {achievements.length === 0 ? (
        <p className="text-gray-500 text-center py-4">У вас пока нет достижений.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`border rounded-lg p-4 flex items-center space-x-4 ${
                achievement.unlocked 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`text-2xl ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-300'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {achievement.description}
                </p>
                {achievement.progress !== undefined && achievement.target !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress} / {achievement.target}
                    </p>
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