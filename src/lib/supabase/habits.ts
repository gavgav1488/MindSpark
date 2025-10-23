import { supabase } from '@/lib/supabase/client';

export async function createHabit(habit) {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateHabit(id, updates) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteHabit(id) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function createHabitEntry(habitEntry) {
  const { data, error } = await supabase
    .from('habit_entries')
    .insert(habitEntry)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getHabitEntries(habitId, startDate, endDate) {
  let query = supabase
    .from('habit_entries')
    .select('*')
    .eq('habit_id', habitId);

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

export async function updateHabitEntry(id, updates) {
  const { data, error } = await supabase
    .from('habit_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteHabitEntry(id) {
  const { error } = await supabase
    .from('habit_entries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}