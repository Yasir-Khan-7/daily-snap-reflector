import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/types/Note';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Legend } from 'recharts';
import { format, subDays, differenceInDays } from 'date-fns';
import { CheckSquare, FileText, Link as LinkIcon, Image, CalendarDays, Tag, ArrowUp } from 'lucide-react';

interface AnalyticsProps {
    notes: Note[];
}

const Analytics: React.FC<AnalyticsProps> = ({ notes }) => {
    // Calculate statistics
    const stats = useMemo(() => {
        const totalNotes = notes.length;
        const completedTasks = notes.filter(note => note.type === 'task' && note.completed).length;
        const pendingTasks = notes.filter(note => note.type === 'task' && !note.completed).length;

        // Notes by type
        const textNotes = notes.filter(note => note.type === 'text').length;
        const taskNotes = notes.filter(note => note.type === 'task').length;
        const linkNotes = notes.filter(note => note.type === 'link').length;
        const imageNotes = notes.filter(note => note.type === 'image').length;

        // Tags data
        const allTags: Record<string, number> = {};
        notes.forEach(note => {
            if (note.tags && note.tags.length > 0) {
                note.tags.forEach(tag => {
                    allTags[tag] = (allTags[tag] || 0) + 1;
                });
            }
        });

        const topTags = Object.entries(allTags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        // Notes by date
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(now, i);
            const formattedDate = format(date, 'MMM dd');
            return {
                date: formattedDate,
                count: notes.filter(note => {
                    const diff = differenceInDays(now, note.createdAt);
                    return diff === i;
                }).length
            };
        }).reverse();

        // Calculate growth
        const totalLast3Days = last7Days.slice(4).reduce((sum, day) => sum + day.count, 0);
        const totalPrevious3Days = last7Days.slice(1, 4).reduce((sum, day) => sum + day.count, 0);
        const growth = totalPrevious3Days > 0
            ? Math.round((totalLast3Days - totalPrevious3Days) / totalPrevious3Days * 100)
            : 0;

        return {
            totalNotes,
            completedTasks,
            pendingTasks,
            typeData: [
                { name: 'Text', value: textNotes, color: '#8b5cf6' },
                { name: 'Task', value: taskNotes, color: '#10b981' },
                { name: 'Link', value: linkNotes, color: '#3b82f6' },
                { name: 'Image', value: imageNotes, color: '#f59e0b' },
            ],
            topTags,
            activityData: last7Days,
            growth
        };
    }, [notes]);

    const chartConfig = {
        text: { color: "#8b5cf6" },
        task: { color: "#10b981" },
        link: { color: "#3b82f6" },
        image: { color: "#f59e0b" },
    };

    return (
        <div className="container max-w-7xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Notes */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Total Notes</CardTitle>
                        <CardDescription>All your captured thoughts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-purple-500 mr-3" />
                                <span className="text-3xl font-bold">{stats.totalNotes}</span>
                            </div>
                            {stats.growth > 0 && (
                                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                    <ArrowUp className="h-4 w-4 mr-1" />
                                    <span className="text-sm font-medium">{stats.growth}%</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Task Completion</CardTitle>
                        <CardDescription>Your productivity metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckSquare className="h-8 w-8 text-green-500 mr-3" />
                                <span className="text-3xl font-bold">{stats.completedTasks}</span>
                                <span className="text-sm text-gray-500 ml-2">completed</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-3xl font-bold">{stats.pendingTasks}</span>
                                <span className="text-sm text-gray-500 ml-2">pending</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Activity */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                        <CardDescription>Notes in the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <CalendarDays className="h-8 w-8 text-blue-500 mr-3" />
                            <span className="text-3xl font-bold">
                                {stats.activityData.reduce((sum, day) => sum + day.count, 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Tags</CardTitle>
                        <CardDescription>Categorization metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Tag className="h-8 w-8 text-amber-500 mr-3" />
                            <span className="text-3xl font-bold">
                                {Object.keys(stats.topTags).length}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-12 mt-6">
                {/* Notes by Type Chart */}
                <Card className="md:col-span-8 hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle>Notes by Type</CardTitle>
                        <CardDescription>Distribution of different note types</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ChartTooltip />
                                <Bar dataKey="value" nameKey="name">
                                    {stats.typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Tags */}
                <Card className="md:col-span-4 hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle>Top Tags</CardTitle>
                        <CardDescription>Your most used tags</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topTags}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.topTags.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${index * 40 + 180}, 70%, 50%)`} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card className="md:col-span-12 hover:shadow-md transition-all">
                    <CardHeader>
                        <CardTitle>Daily Activity</CardTitle>
                        <CardDescription>Your note creation activity over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ChartTooltip />
                                <Bar dataKey="count" name="Notes" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics; 