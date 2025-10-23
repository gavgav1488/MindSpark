import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/ui/navbar";
import Notifications from "@/components/ui/notifications";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindSpark - Трекер настроения и привычек",
  description: "Приложение для отслеживания настроения и привычек",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <html lang="ru">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Notifications 
          notifications={notifications} 
          onMarkAsRead={markAsRead} 
          onDismiss={dismissNotification} 
        />
      </body>
    </html>
  );
}