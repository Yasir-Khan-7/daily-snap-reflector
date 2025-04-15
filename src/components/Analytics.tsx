import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/types/Note';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Legend, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { format, subDays, differenceInDays, isToday, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { CheckSquare, FileText, Link as LinkIcon, Image, CalendarDays, Tag, ArrowUp, ArrowDown, TrendingUp, Lightbulb, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AnalyticsProps {
    notes: Note[];
    onViewFullReport?: () => void;
}

const COLORS = {
    text: '#8b5cf6',    // Purple
    task: '#10b981',    // Green
    link: '#3b82f6',    // Blue 
    image: '#f59e0b',   // Amber
    completed: '#059669', // Emerald
    pending: '#dc2626',   // Red
};

// Create a motion component with any props
const MotionCell = motion(Cell);

// We can't use motion with Bar directly due to typing issues
// Instead, we'll use a regular Bar component with CSS transitions
// This is simpler than trying to fix complex recharts typing issues

const Analytics: React.FC<AnalyticsProps> = ({ notes, onViewFullReport }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
            .map(([name, value], index) => ({ 
                name, 
                value,
                color: `hsl(${index * 40 + 180}, 70%, 50%)` 
            }));

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
                }).length,
                isToday: i === 0
            };
        }).reverse();

        // Get notes by time of day
        const timeOfDay = [
            { name: 'Morning (6-12)', value: 0, color: '#f59e0b' },
            { name: 'Afternoon (12-18)', value: 0, color: '#3b82f6' },
            { name: 'Evening (18-24)', value: 0, color: '#8b5cf6' },
            { name: 'Night (0-6)', value: 0, color: '#1f2937' }
        ];
        
        notes.forEach(note => {
            const hour = note.createdAt.getHours();
            if (hour >= 6 && hour < 12) timeOfDay[0].value++;
            else if (hour >= 12 && hour < 18) timeOfDay[1].value++;
            else if (hour >= 18 && hour < 24) timeOfDay[2].value++;
            else timeOfDay[3].value++;
        });

        // Calculate growth
        const totalLast3Days = last7Days.slice(4).reduce((sum, day) => sum + day.count, 0);
        const totalPrevious3Days = last7Days.slice(1, 4).reduce((sum, day) => sum + day.count, 0);
        const growth = totalPrevious3Days > 0
            ? Math.round((totalLast3Days - totalPrevious3Days) / totalPrevious3Days * 100)
            : 0;

        // Monthly activity
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        const daysInMonth = eachDayOfInterval({ start, end });
        
        const monthlyActivity = daysInMonth.map(day => {
            const formattedDate = format(day, 'MMM dd');
            const dayNotes = notes.filter(note => {
                const noteDate = new Date(note.createdAt);
                return noteDate.getDate() === day.getDate() && 
                       noteDate.getMonth() === day.getMonth() &&
                       noteDate.getFullYear() === day.getFullYear();
            });
            
            return {
                date: formattedDate,
                day: day.getDate(),
                count: dayNotes.length,
                text: dayNotes.filter(note => note.type === 'text').length,
                task: dayNotes.filter(note => note.type === 'task').length,
                link: dayNotes.filter(note => note.type === 'link').length,
                image: dayNotes.filter(note => note.type === 'image').length,
            };
        });

        return {
            totalNotes,
            completedTasks,
            pendingTasks,
            typeData: [
                { name: 'Text', value: textNotes, color: COLORS.text },
                { name: 'Task', value: taskNotes, color: COLORS.task },
                { name: 'Link', value: linkNotes, color: COLORS.link },
                { name: 'Image', value: imageNotes, color: COLORS.image },
            ],
            topTags,
            activityData: last7Days,
            timeOfDay,
            growth,
            monthlyActivity
        };
    }, [notes]);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.1;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text 
            x={x} 
            y={y} 
            fill={stats.typeData[index].color}
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            className="text-sm font-medium"
          >
            {`${name} (${(percent * 100).toFixed(0)}%)`}
          </text>
        );
    };

    const handleMouseEnter = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg">
                    <p className="font-medium text-gray-800">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Distribution Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes by Type */}
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-500" />
                            Content Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by note type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.typeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={4}
                                    animationDuration={750}
                                >
                                    {stats.typeData.map((entry, index) => (
                                        <MotionCell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                            animate={{
                                                opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                                                scale: activeIndex === index ? 1.05 : 1
                                            }}
                                            initial={{ opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            onMouseEnter={() => handleMouseEnter(entry, index)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Time of Day */}
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            Time of Day
                        </CardTitle>
                        <CardDescription>When you're most active</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.timeOfDay} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tick={{ fontSize: 12 }} 
                                    width={100}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="value" 
                                    barSize={30}
                                    radius={[0, 4, 4, 0]}
                                    className="animate-in fade-in slide-in-from-left duration-1000"
                                >
                                    {stats.timeOfDay.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Timeline */}
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-green-500" />
                        Daily Activity
                    </CardTitle>
                    <CardDescription>Your note creation patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                            data={stats.activityData} 
                            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                name="Notes" 
                                stroke="#6366f1" 
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                strokeWidth={2}
                                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: '#fff' }}
                            />
                            {/* Highlight today's data point */}
                            {stats.activityData.map((entry, index) => (
                                entry.isToday && (
                                    <Bar 
                                        key={`today-${index}`}
                                        dataKey="count" 
                                        fill="rgba(99, 102, 241, 0.1)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                        yAxisId={0}
                                        xAxisId={0}
                                    />
                                )
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Insight Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Tags */}
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Tag className="h-4 w-4 text-amber-500" />
                            Top Tags
                        </CardTitle>
                        <CardDescription>Your most used categories</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        {stats.topTags.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={stats.topTags} 
                                    layout="vertical"
                                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        tick={{ fontSize: 13 }} 
                                        width={70}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    {stats.topTags.map((entry, index) => (
                                        <Bar
                                            key={`bar-${index}`}
                                            dataKey="value"
                                            fill={entry.color}
                                            radius={[0, 4, 4, 0]}
                                            barSize={20}
                                            className={`animate-in fade-in slide-in-from-left duration-500 delay-${index * 100}`}
                                            label={{
                                                position: 'right',
                                                formatter: (value: any) => `${value}`
                                            }}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Add tags to your notes to see analytics</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Insights Card */}
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-purple-500" />
                            Productivity Insights
                        </CardTitle>
                        <CardDescription>Based on your activity patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors">
                                <div className="mt-1 p-1.5 bg-green-100 rounded-full text-green-600">
                                    <TrendingUp size={14} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Task Completion Rate</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {stats.completedTasks + stats.pendingTasks > 0 ? (
                                            <>
                                                You've completed {Math.round(stats.completedTasks / (stats.completedTasks + stats.pendingTasks) * 100)}% of your tasks.
                                                {stats.pendingTasks > 0 && ` You have ${stats.pendingTasks} pending tasks.`}
                                            </>
                                        ) : (
                                            'No tasks created yet. Start by adding some tasks.'
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors">
                                <div className="mt-1 p-1.5 bg-blue-100 rounded-full text-blue-600">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Peak Productivity Time</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {stats.timeOfDay.reduce((prev, current) => (prev.value > current.value) ? prev : current).name} 
                                        {" "}is your most productive time for creating notes.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors">
                                <div className="mt-1 p-1.5 bg-purple-100 rounded-full text-purple-600">
                                    <FileText size={14} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Content Preference</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You prefer creating {stats.typeData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name} 
                                        {" "}notes over other types.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="flex items-center gap-1 hover:bg-purple-100 hover:text-purple-700 text-xs"
                                    onClick={onViewFullReport}
                                >
                                    <span>View Full Report</span>
                                    <ExternalLink size={12} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics; 