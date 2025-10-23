import { createClient } from '@supabase/supabase-js'

// Типы для таблиц в базе данных
export interface User {
  id: string
  email: string
  created_at: string
}

export interface MoodEntry {
  id: number
  user_id: string
  mood_level: number
  notes: string
  entry_date: string
  created_at: string
}

export interface Habit {
  id: number
  user_id: string
  name: string
  description: string
  frequency: string
  created_at: string
}

export interface HabitEntry {
  id: number
  habit_id: number
  entry_date: string
  completed: boolean
  created_at: string
}

// Создаем клиент Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)