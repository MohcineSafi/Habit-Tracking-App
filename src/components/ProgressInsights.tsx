
import React from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { Habit, HabitCompletion, HABIT_CATEGORIES } from '@/types/habit';

interface ProgressInsightsProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

const ProgressInsights: React.FC<ProgressInsightsProps> = ({ habits, completions }) => {
  // Get data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayCompletions = completions.filter(c => c.date === dateStr);
    
    return {
      date: format(date, 'EEE'),
      fullDate: dateStr,
      completions: dayCompletions.length,
      completionRate: habits.length > 0 ? Math.round((dayCompletions.length / habits.length) * 100) : 0,
    };
  });

  // Category completion data
  const categoryData = HABIT_CATEGORIES.map(category => {
    const categoryHabits = habits.filter(h => h.category === category.id);
    const categoryCompletions = completions.filter(c => 
      categoryHabits.some(h => h.id === c.habitId)
    );
    
    return {
      name: category.name,
      completions: categoryCompletions.length,
      habits: categoryHabits.length,
      color: category.color.replace('bg-', '').replace('-500', ''),
    };
  }).filter(item => item.habits > 0);

  // Calculate streaks
  const habitStreaks = habits.map(habit => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    const habitCompletions = completions
      .filter(c => c.habitId === habit.id)
      .map(c => new Date(c.date))
      .sort((a, b) => a.getTime() - b.getTime());

    // Calculate current streak
    let currentDate = new Date();
    while (habitCompletions.some(date => 
      format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    )) {
      currentStreak++;
      currentDate = subDays(currentDate, 1);
    }

    // Calculate max streak
    for (let i = 0; i < habitCompletions.length; i++) {
      if (i === 0 || 
          habitCompletions[i].getTime() - habitCompletions[i-1].getTime() === 24 * 60 * 60 * 1000) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return {
      ...habit,
      currentStreak,
      maxStreak,
    };
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ff0000'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">Progress Insights</h2>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>7-Day Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Bar 
                dataKey="completions" 
                fill="url(#progressGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Completion Rate Trend */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-500" />
            <span>Completion Rate Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 100]} />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="completions"
                    label={({ name, completions }) => `${name}: ${completions}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habit Streaks */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span>Habit Streaks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {habitStreaks
                .sort((a, b) => b.currentStreak - a.currentStreak)
                .map((habit) => (
                <div key={habit.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: habit.color }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{habit.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Current:</span>
                        <Badge variant="default">{habit.currentStreak} days</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Best:</span>
                        <Badge variant="secondary">{habit.maxStreak} days</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {habitStreaks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No habits to track yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressInsights;
