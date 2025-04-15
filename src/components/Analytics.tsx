import React from 'react';
import { Card } from '@/components/ui/card';
import { Note } from '@/types/Note';
import { FileText, CheckSquare, Activity, Tag } from 'lucide-react';
import { BarChart } from '@/components/ui/bar-chart';

interface AnalyticsProps {
    notes: Note[];
}

const Analytics: React.FC<AnalyticsProps> = ({ notes }) => {
    // Calculate metrics
    const totalNotes = notes.length;
    const completedTasks = notes.filter(note => note.type === 'task' && note.completed).length;
    const recentActivity = notes.filter(note => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(note.createdAt) >= sevenDaysAgo;
    }).length;

    // Calculate unique tags
    const uniqueTags = new Set(notes.flatMap(note => note.tags || [])).size;

    // Prepare data for daily activity chart
    const dailyActivity = notes.reduce((acc, note) => {
        const date = new Date(note.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get last 7 days for chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString();
    }).reverse();

    const chartData = last7Days.map(date => ({
        date,
        value: dailyActivity[date] || 0
    }));

    return (
        <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Analytics</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <MetricCard
                    title="Total Notes"
                    value={totalNotes}
                    icon={<FileText className="h-4 w-4 text-purple-500" />}
                    className="bg-purple-50"
                />
                <MetricCard
                    title="Task Completed"
                    value={completedTasks}
                    icon={<CheckSquare className="h-4 w-4 text-green-500" />}
                    className="bg-green-50"
                />
                <MetricCard
                    title="Recent Activity"
                    value={recentActivity}
                    icon={<Activity className="h-4 w-4 text-blue-500" />}
                    className="bg-blue-50"
                    subtitle="Last 7 days"
                />
                <MetricCard
                    title="Tags"
                    value={uniqueTags}
                    icon={<Tag className="h-4 w-4 text-amber-500" />}
                    className="bg-amber-50"
                    subtitle="Categorization metrics"
                />
            </div>

            {/* Daily Activity Chart */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">Daily Activity</h3>
                <div className="h-[150px] w-full">
                    <BarChart
                        data={chartData}
                        xField="date"
                        yField="value"
                        color="#6366f1"
                    />
                </div>
                <p className="text-xs text-gray-500 text-center">
                    Your note creation activity over the last 7 days
                </p>
            </div>
        </Card>
    );
};

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    className?: string;
    subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon,
    className = '',
    subtitle
}) => (
    <div className={`p-3 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm">
                {icon}
            </div>
        </div>
    </div>
);

export default Analytics; 