
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Plus, Target, Calendar, TrendingUp, Award, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HabitForm from '@/components/HabitForm';
import HabitCard from '@/components/HabitCard';
import MonthlyView from '@/components/MonthlyView';
import ProgressInsights from '@/components/ProgressInsights';
import AchievementBadges from '@/components/AchievementBadges';
import { Habit, HabitCompletion } from '@/types/habit';

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [currentView, setCurrentView] = useState<'today' | 'monthly' | 'insights'>('today');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedCompletions = localStorage.getItem('completions');
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    setShowHabitForm(false);
  };

  const toggleHabitCompletion = (habitId: string, date: Date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingCompletion = completions.find(
      c => c.habitId === habitId && c.date === dateStr
    );

    if (existingCompletion) {
      setCompletions(completions.filter(c => c.id !== existingCompletion.id));
    } else {
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        date: dateStr,
        completedAt: new Date().toISOString(),
      };
      setCompletions([...completions, newCompletion]);
    }
  };

  const getHabitStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId)
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    
    // Check if today is completed, if not start from yesterday
    const todayCompleted = habitCompletions.some(date => isSameDay(date, currentDate));
    if (!todayCompleted) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (habitCompletions.some(date => isSameDay(date, currentDate))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return completions.some(c => c.habitId === habitId && c.date === today);
  };

  const getTotalCompletions = (): number => {
    return completions.length;
  };

  const getCompletionRate = (): number => {
    if (habits.length === 0) return 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayCompletions = completions.filter(c => c.date === today).length;
    return Math.round((todayCompletions / habits.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  HabitFlow
                </h1>
                <p className="text-sm text-gray-600">Build lasting habits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('today')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === 'today'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentView('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === 'monthly'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setCurrentView('insights')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === 'insights'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Insights
                </button>
              </div>
              
              <Button
                onClick={() => setShowHabitForm(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Completions</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCompletions()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Habits</p>
                  <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {currentView === 'today' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Today's Habits - {format(new Date(), 'MMMM d, yyyy')}
              </h2>
            </div>
            
            {habits.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
                  <p className="text-gray-600 mb-6">Start building better habits by adding your first one!</p>
                  <Button
                    onClick={() => setShowHabitForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Habit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={isHabitCompletedToday(habit.id)}
                    streak={getHabitStreak(habit.id)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'monthly' && (
          <MonthlyView
            habits={habits}
            completions={completions}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onToggleCompletion={toggleHabitCompletion}
          />
        )}

        {currentView === 'insights' && (
          <div className="space-y-6">
            <ProgressInsights habits={habits} completions={completions} />
            <AchievementBadges habits={habits} completions={completions} />
          </div>
        )}
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <HabitForm
              onSubmit={addHabit}
              onCancel={() => setShowHabitForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
