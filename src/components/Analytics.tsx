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

// Create modern, vibrant colors for the charts with better distinction
const MODERN_COLORS = {
    text: { 
        main: '#8b5cf6',    // Vibrant purple
        light: '#a78bfa',
        dark: '#7c3aed'
    },
    task: { 
        main: '#10b981',    // Emerald green
        light: '#34d399',
        dark: '#059669'
    },
    link: { 
        main: '#3b82f6',    // Royal blue
        light: '#60a5fa',
        dark: '#2563eb'
    },
    image: { 
        main: '#f59e0b',   // Amber orange
        light: '#fbbf24',
        dark: '#d97706'
    }
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

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
        // Only render labels for segments with significant percentage
        if (percent < 0.05) return null;
      
        const RADIAN = Math.PI / 180;
        // Increase radius to position labels further from the pie
        const radius = outerRadius * 1.2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        // Label formatting
        return (
          <text 
            x={x} 
            y={y} 
            fill={stats.typeData[index].color}
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            className="text-xs font-medium"
            style={{ filter: 'drop-shadow(0px 0px 1px white)' }}
          >
            {`${name}: ${value}`}
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
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
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
                                <defs>
                                    {/* Create gradients for each slice for a modern look */}
                                    <linearGradient id="colorText" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={MODERN_COLORS.text.light} />
                                        <stop offset="100%" stopColor={MODERN_COLORS.text.dark} />
                                    </linearGradient>
                                    <linearGradient id="colorTask" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={MODERN_COLORS.task.light} />
                                        <stop offset="100%" stopColor={MODERN_COLORS.task.dark} />
                                    </linearGradient>
                                    <linearGradient id="colorLink" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={MODERN_COLORS.link.light} />
                                        <stop offset="100%" stopColor={MODERN_COLORS.link.dark} />
                                    </linearGradient>
                                    <linearGradient id="colorImage" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={MODERN_COLORS.image.light} />
                                        <stop offset="100%" stopColor={MODERN_COLORS.image.dark} />
                                    </linearGradient>
                                    {/* Add shadow filter for depth */}
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
                                    </filter>
                                </defs>
                                <Pie
                                    data={stats.typeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={false} // Remove direct labels from pie
                                    outerRadius={85}
                                    innerRadius={50} // Increase for donut chart
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={5}
                                    animationDuration={750}
                                    filter="url(#shadow)" // Apply shadow
                                    cornerRadius={5} // Rounded corners
                                >
                                    {stats.typeData.map((entry, index) => {
                                        // Use fixed colors instead of gradients
                                        let fillColor;
                                        switch(entry.name) {
                                            case 'Text': fillColor = MODERN_COLORS.text.main; break;
                                            case 'Task': fillColor = MODERN_COLORS.task.main; break;
                                            case 'Link': fillColor = MODERN_COLORS.link.main; break;
                                            case 'Image': fillColor = MODERN_COLORS.image.main; break;
                                            default: fillColor = entry.color;
                                        }
                                        
                                        return (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={fillColor}
                                                stroke="#ffffff"
                                                strokeWidth={3}
                                            />
                                        );
                                    })}
                                </Pie>
                                
                                {/* Simple and clean center text without a background */}
                                <text 
                                    x="50%" 
                                    y="50%" 
                                    textAnchor="middle" 
                                    dominantBaseline="central"
                                >
                                    <tspan 
                                        x="50%" 
                                        y="45%"
                                        fontSize="24" 
                                        fontWeight="bold" 
                                        fill="#111827"  
                                    >
                                        {notes.length}
                                    </tspan>
                                    <tspan 
                                        x="50%" 
                                        y="62%"
                                        fontSize="12" 
                                        fontWeight="500" 
                                        fill="#4b5563"
                                    >
                                        Total
                                    </tspan>
                                </text>
                                
                                <Tooltip 
                                    content={<CustomTooltip />} 
                                    formatter={(value, name) => [`${value} (${((value as number / notes.length) * 100).toFixed(0)}%)`, name]}
                                    wrapperStyle={{ outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend 
                                    layout="horizontal" 
                                    verticalAlign="bottom" 
                                    align="center"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    formatter={(value, entry) => {
                                        // Get the corresponding color based on the name
                                        let color;
                                        switch(value) {
                                            case 'Text': color = MODERN_COLORS.text.main; break;
                                            case 'Task': color = MODERN_COLORS.task.main; break;
                                            case 'Link': color = MODERN_COLORS.link.main; break;
                                            case 'Image': color = MODERN_COLORS.image.main; break;
                                            default: color = '#4b5563';
                                        }
                                        
                                        // Find the percent for this item
                                        const item = stats.typeData.find(item => item.name === value);
                                        const percent = item ? Math.round((item.value / notes.length) * 100) : 0;
                                        
                                        return (
                                            <span style={{ color: '#4b5563', fontWeight: 500, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ color, fontSize: '16px' }}>■</span> {value} 
                                                <span style={{ fontWeight: 400, marginLeft: '4px' }}>
                                                    ({percent}%)
                                                </span>
                            </span>
                                        );
                                    }}
                                    iconSize={0} // Hide default icon since we're using our own
                                />
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