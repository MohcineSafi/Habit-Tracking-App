
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Target, Zap, Crown, Flame, Trophy, Medal } from 'lucide-react';
import { Habit, HabitCompletion } from '@/types/habit';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementBadgesProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ habits, completions }) => {
  const calculateAchievements = (): Achievement[] => {
    const totalCompletions = completions.length;
    const uniqueDaysCompleted = new Set(completions.map(c => c.date)).size;
    
    // Calculate longest streak across all habits
    let longestStreak = 0;
    habits.forEach(habit => {
      const habitCompletions = completions
        .filter(c => c.habitId === habit.id)
        .map(c => new Date(c.date))
        .sort((a, b) => a.getTime() - b.getTime());
      
      let currentStreak = 0;
      let maxStreak = 0;
      
      for (let i = 0; i < habitCompletions.length; i++) {
        if (i === 0 || 
            differenceInDays(habitCompletions[i], habitCompletions[i-1]) === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, maxStreak);
    });

    // Calculate perfect days (all habits completed)
    const perfectDays = Array.from(new Set(completions.map(c => c.date)))
      .filter(date => {
        const dayCompletions = completions.filter(c => c.date === date);
        return dayCompletions.length === habits.length && habits.length > 0;
      }).length;

    return [
      {
        id: 'first-step',
        title: 'First Step',
        description: 'Complete your first habit',
        icon: <Star className="w-6 h-6" />,
        color: 'bg-yellow-500',
        unlocked: totalCompletions >= 1,
        progress: Math.min(totalCompletions, 1),
        target: 1,
      },
      {
        id: 'habit-starter',
        title: 'Habit Starter',
        description: 'Create 3 habits',
        icon: <Target className="w-6 h-6" />,
        color: 'bg-blue-500',
        unlocked: habits.length >= 3,
        progress: Math.min(habits.length, 3),
        target: 3,
      },
      {
        id: 'consistency-king',
        title: 'Consistency King',
        description: 'Complete habits for 7 days straight',
        icon: <Crown className="w-6 h-6" />,
        color: 'bg-purple-500',
        unlocked: longestStreak >= 7,
        progress: Math.min(longestStreak, 7),
        target: 7,
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 30-day streak',
        icon: <Flame className="w-6 h-6" />,
        color: 'bg-red-500',
        unlocked: longestStreak >= 30,
        progress: Math.min(longestStreak, 30),
        target: 30,
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: 'Complete 100 habits total',
        icon: <Trophy className="w-6 h-6" />,
        color: 'bg-green-500',
        unlocked: totalCompletions >= 100,
        progress: Math.min(totalCompletions, 100),
        target: 100,
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Have 10 perfect days (all habits completed)',
        icon: <Medal className="w-6 h-6" />,
        color: 'bg-indigo-500',
        unlocked: perfectDays >= 10,
        progress: Math.min(perfectDays, 10),
        target: 10,
      },
      {
        id: 'lightning-fast',
        title: 'Lightning Fast',
        description: 'Complete 50 habits in total',
        icon: <Zap className="w-6 h-6" />,
        color: 'bg-orange-500',
        unlocked: totalCompletions >= 50,
        progress: Math.min(totalCompletions, 50),
        target: 50,
      },
      {
        id: 'habit-collector',
        title: 'Habit Collector',
        description: 'Create habits in 5 different categories',
        icon: <Award className="w-6 h-6" />,
        color: 'bg-teal-500',
        unlocked: new Set(habits.map(h => h.category)).size >= 5,
        progress: Math.min(new Set(habits.map(h => h.category)).size, 5),
        target: 5,
      },
    ];
  };

  const achievements = calculateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
        <Badge variant="secondary">
          {unlockedAchievements.length}/{achievements.length}
        </Badge>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Unlocked Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${achievement.color} p-2 rounded-lg text-white`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Unlocked!
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-gray-500" />
            <span>Upcoming Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-75"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-400 p-2 rounded-lg text-white">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    {achievement.progress !== undefined && achievement.target && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-400 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {unlockedAchievements.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600">Start completing habits to unlock your first achievement!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementBadges;
