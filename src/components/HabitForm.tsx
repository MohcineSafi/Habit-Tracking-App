
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Habit, HABIT_CATEGORIES, HABIT_COLORS } from '@/types/habit';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [targetFrequency, setTargetFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    const selectedCategory = HABIT_CATEGORIES.find(c => c.id === category);
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      color,
      icon: selectedCategory?.icon || '⭐',
      targetFrequency,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Add New Habit</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Habit Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this habit important to you?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {HABIT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center space-x-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Color</Label>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {HABIT_COLORS.map((habitColor) => (
              <button
                key={habitColor}
                type="button"
                onClick={() => setColor(habitColor)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === habitColor 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: habitColor }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="frequency">Target Frequency</Label>
          <Select value={targetFrequency} onValueChange={(value: 'daily' | 'weekly') => setTargetFrequency(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            disabled={!name.trim() || !category}
          >
            Add Habit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
