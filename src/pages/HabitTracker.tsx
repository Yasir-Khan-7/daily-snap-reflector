import React, { useState } from 'react';
import { Layout } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    createdAt: Date;
    completedDates: string[];
}

const HabitTracker: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState('');

    const addHabit = () => {
        if (!newHabitName.trim()) return;

        const newHabit: Habit = {
            id: Date.now().toString(),
            name: newHabitName.trim(),
            createdAt: new Date(),
            completedDates: []
        };

        setHabits(prev => [...prev, newHabit]);
        setNewHabitName('');
    };

    const toggleHabitForToday = (habitId: string) => {
        const today = new Date().toISOString().split('T')[0];

        setHabits(prev => prev.map(habit => {
            if (habit.id !== habitId) return habit;

            const isCompleted = habit.completedDates.includes(today);
            return {
                ...habit,
                completedDates: isCompleted
                    ? habit.completedDates.filter(date => date !== today)
                    : [...habit.completedDates, today]
            };
        }));
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <Card className="max-w-4xl mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-6">Habit Tracker</h1>

                        {/* Add new habit */}
                        <div className="flex gap-2 mb-6">
                            <Input
                                type="text"
                                placeholder="Enter a new habit..."
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={addHabit}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Habit
                            </Button>
                        </div>

                        {/* Habits list */}
                        <div className="space-y-4">
                            {habits.map(habit => {
                                const today = new Date().toISOString().split('T')[0];
                                const isCompletedToday = habit.completedDates.includes(today);

                                return (
                                    <div
                                        key={habit.id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                    >
                                        <span className="text-lg">{habit.name}</span>
                                        <Button
                                            variant={isCompletedToday ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => toggleHabitForToday(habit.id)}
                                        >
                                            {isCompletedToday ? (
                                                <X className="h-4 w-4 mr-2" />
                                            ) : (
                                                <Check className="h-4 w-4 mr-2" />
                                            )}
                                            {isCompletedToday ? 'Undo' : 'Complete'}
                                        </Button>
                                    </div>
                                );
                            })}

                            {habits.length === 0 && (
                                <p className="text-gray-500 text-center py-4">
                                    No habits added yet. Add your first habit above!
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default HabitTracker; 