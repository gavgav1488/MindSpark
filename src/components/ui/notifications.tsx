'use client';

import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDismiss: (id: number) => void;
}

export default function Notifications({ notifications, onMarkAsRead, onDismiss }: NotificationsProps) {
  const [visible, setVisible] = useState(true);

  // Фильтруем непрочитанные уведомления
  const unreadNotifications = notifications.filter(notification => !notification.read);

  if (!visible || unreadNotifications.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'error':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-blue-100 border-blue-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {unreadNotifications.map((notification) => (
        <div 
          key={notification.id}
          className={`max-w-sm w-full rounded-lg shadow-lg p-4 border ${getBackgroundColor(notification.type)} transition-all duration-300`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 text-xl">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex space-x-1">
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Отметить как прочитанное</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Закрыть</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}