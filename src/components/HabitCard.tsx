
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import { Habit, HABIT_CATEGORIES } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, streak, onToggle }) => {
  const category = HABIT_CATEGORIES.find(c => c.id === habit.category);

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      isCompleted ? 'ring-2 ring-green-400 ring-opacity-50' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: habit.color }}
            >
              {habit.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{habit.name}</h3>
              {category && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {habit.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{habit.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {streak} day{streak !== 1 ? 's' : ''} streak
            </span>
          </div>
          <Badge variant={habit.targetFrequency === 'daily' ? 'default' : 'secondary'}>
            {habit.targetFrequency}
          </Badge>
        </div>

        <Button
          onClick={onToggle}
          className={`w-full transition-all duration-300 ${
            isCompleted
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          }`}
        >
          {isCompleted ? (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Completed</span>
            </div>
          ) : (
            'Mark Complete'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
