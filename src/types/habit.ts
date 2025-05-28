
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  icon: string;
  targetFrequency: 'daily' | 'weekly';
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completedAt: string;
}

export const HABIT_CATEGORIES = [
  { id: 'health', name: 'Health & Fitness', color: 'bg-green-500', icon: '💪' },
  { id: 'productivity', name: 'Productivity', color: 'bg-blue-500', icon: '⚡' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-500', icon: '📚' },
  { id: 'mindfulness', name: 'Mindfulness', color: 'bg-indigo-500', icon: '🧘' },
  { id: 'social', name: 'Social', color: 'bg-pink-500', icon: '👥' },
  { id: 'creativity', name: 'Creativity', color: 'bg-orange-500', icon: '🎨' },
  { id: 'finance', name: 'Finance', color: 'bg-emerald-500', icon: '💰' },
  { id: 'lifestyle', name: 'Lifestyle', color: 'bg-teal-500', icon: '🌟' },
];

export const HABIT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];
