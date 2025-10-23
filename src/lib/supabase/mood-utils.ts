'use client';

import { supabase } from '@/lib/supabase/client';
import { MoodEntry } from '@/lib/supabase/client';

export async function createMoodEntry(moodEntry: Omit<MoodEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert(moodEntry)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMoodEntries(userId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId);

  if (startDate) {
    query = query.gte('entry_date', startDate);
  }

  if (endDate) {
    query = query.lte('entry_date', endDate);
  }

  query = query.order('entry_date', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMoodEntry(id: number, updates: Partial<MoodEntry>) {
  const { data, error } = await supabase
    .from('mood_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMoodEntry(id: number) {
  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getMoodEntryById(id: number) {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}