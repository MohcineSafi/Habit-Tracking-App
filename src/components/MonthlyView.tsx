
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Habit, HabitCompletion } from '@/types/habit';

interface MonthlyViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onToggleCompletion: (habitId: string, date: Date) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  habits,
  completions,
  selectedDate,
  onDateChange,
  onToggleCompletion,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  const getCompletionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.filter(c => c.date === dateStr);
  };

  const isHabitCompletedOnDate = (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.some(c => c.habitId === habitId && c.date === dateStr);
  };

  const getCompletionRate = (date: Date) => {
    const dateCompletions = getCompletionsForDate(date);
    return habits.length > 0 ? (dateCompletions.length / habits.length) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {format(selectedDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-4">
            {daysInMonth.map((day) => {
              const dayCompletions = getCompletionsForDate(day);
              const completionRate = getCompletionRate(day);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-2 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${
                    isDayToday
                      ? 'border-purple-400 bg-purple-50'
                      : completionRate === 100
                      ? 'border-green-400 bg-green-50'
                      : completionRate > 0
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  } ${isCurrentMonth ? '' : 'opacity-50'}`}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isDayToday ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {completionRate === 100 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      {dayCompletions.slice(0, 3).map((completion) => {
                        const habit = habits.find(h => h.id === completion.habitId);
                        return habit ? (
                          <div
                            key={completion.id}
                            className="w-full h-1 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                        ) : null;
                      })}
                      {dayCompletions.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayCompletions.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Habits List for Selected Month */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Habits Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => {
              const habitCompletionsThisMonth = completions.filter(c => {
                const completionDate = new Date(c.date);
                return c.habitId === habit.id && isSameMonth(completionDate, selectedDate);
              });

              const completionPercentage = daysInMonth.length > 0 
                ? Math.round((habitCompletionsThisMonth.length / daysInMonth.length) * 100)
                : 0;

              return (
                <div key={habit.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: habit.color }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{habit.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {habitCompletionsThisMonth.length}/{daysInMonth.length}
                      </span>
                    </div>
                  </div>
                  <Badge variant={completionPercentage >= 80 ? 'default' : 'secondary'}>
                    {completionPercentage}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyView;
