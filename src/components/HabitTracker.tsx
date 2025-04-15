import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Circle, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format, parseISO, isToday, subDays, formatDistance } from 'date-fns';

interface Habit {
    id: string;
    name: string;
    completed: boolean[];
    createdAt: string;
    streak: number;
}

const DAYS_TO_TRACK = 7;

const HabitTracker: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const savedHabits = localStorage.getItem('habits');
        return savedHabits ? JSON.parse(savedHabits) : [];
    });

    const [newHabitName, setNewHabitName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Save habits to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    // Generate dates for the last DAYS_TO_TRACK days
    const dates = Array.from({ length: DAYS_TO_TRACK }, (_, i) => {
        return format(subDays(new Date(), DAYS_TO_TRACK - 1 - i), 'MMM dd');
    });

    // Add a new habit
    const addHabit = () => {
        if (!newHabitName.trim()) return;

        const newHabit: Habit = {
            id: Date.now().toString(),
            name: newHabitName.trim(),
            completed: Array(DAYS_TO_TRACK).fill(false),
            createdAt: new Date().toISOString(),
            streak: 0
        };

        setHabits(prev => [...prev, newHabit]);
        setNewHabitName('');
        setIsDialogOpen(false);

        toast({
            title: "Habit Created",
            description: `'${newHabitName.trim()}' has been added to your tracker.`,
        });
    };

    // Toggle a habit completion status for a specific day
    const toggleHabitCompletion = (habitId: string, dayIndex: number) => {
        setHabits(prev => {
            return prev.map(habit => {
                if (habit.id === habitId) {
                    const newCompleted = [...habit.completed];
                    newCompleted[dayIndex] = !newCompleted[dayIndex];

                    // Calculate streak
                    let streak = 0;
                    for (let i = newCompleted.length - 1; i >= 0; i--) {
                        if (newCompleted[i]) {
                            streak++;
                        } else {
                            break;
                        }
                    }

                    return {
                        ...habit,
                        completed: newCompleted,
                        streak
                    };
                }
                return habit;
            });
        });
    };

    // Delete a habit
    const deleteHabit = (habitId: string, habitName: string) => {
        setHabits(prev => prev.filter(habit => habit.id !== habitId));

        toast({
            title: "Habit Deleted",
            description: `'${habitName}' has been removed from your tracker.`,
        });
    };

    // Calculate completion rate for the week
    const calculateCompletionRate = (habit: Habit) => {
        const completedDays = habit.completed.filter(Boolean).length;
        return Math.round((completedDays / DAYS_TO_TRACK) * 100);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        <span>Habit Tracker</span>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-4 w-4" /> New Habit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Habit</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    placeholder="Exercise, Read, Meditate..."
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={addHabit} disabled={!newHabitName.trim()}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {habits.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-gray-500">No habits yet. Click "New Habit" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-4 overflow-x-auto pb-2">
                        {/* Date headers */}
                        <div className="grid grid-cols-[minmax(120px,2fr)_repeat(7,minmax(45px,1fr))_minmax(45px,1fr)] gap-1 mb-2 min-w-[600px]">
                            <div className="text-xs font-medium text-gray-500">Habit</div>
                            {dates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`text-xs font-medium text-center text-gray-500 ${index === dates.length - 1 ? 'bg-blue-50 rounded-md p-1' : ''
                                        }`}
                                >
                                    {date}
                                </div>
                            ))}
                            <div className="text-xs font-medium text-center text-gray-500">%</div>
                        </div>

                        {/* Habits list */}
                        {habits.map((habit) => (
                            <div
                                key={habit.id}
                                className="grid grid-cols-[minmax(120px,2fr)_repeat(7,minmax(45px,1fr))_minmax(45px,1fr)] gap-1 items-center min-w-[600px]"
                            >
                                <div className="flex items-center justify-between pr-2">
                                    <div className="truncate">
                                        <div className="font-medium text-sm truncate">{habit.name}</div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {habit.streak > 0 ? (
                                                <span className="text-green-600">🔥 {habit.streak} day streak</span>
                                            ) : (
                                                <span>Start your streak today!</span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-400 hover:text-red-500 flex-shrink-0"
                                        onClick={() => deleteHabit(habit.id, habit.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {habit.completed.map((completed, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`flex justify-center ${dayIndex === dates.length - 1 ? 'bg-blue-50 rounded-md p-1' : ''
                                            }`}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 rounded-full ${completed ? 'text-green-500' : 'text-gray-300'
                                                }`}
                                            onClick={() => toggleHabitCompletion(habit.id, dayIndex)}
                                        >
                                            {completed ? (
                                                <CheckCircle2 className="h-6 w-6 fill-green-100" />
                                            ) : (
                                                <Circle className="h-6 w-6" />
                                            )}
                                        </Button>
                                    </div>
                                ))}

                                <div className="text-center font-medium text-sm">
                                    {calculateCompletionRate(habit)}%
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="text-xs text-gray-500 justify-between">
                <span>Track your daily habits</span>
                <span>Today is highlighted in blue</span>
            </CardFooter>
        </Card>
    );
};

export default HabitTracker; 