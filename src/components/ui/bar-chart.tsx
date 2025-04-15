import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface BarChartProps {
    data: any[];
    xField: string;
    yField: string;
    color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    xField,
    yField,
    color = '#6366f1'
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
                data={data}
                margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey={xField}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toFixed(0)}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        padding: '0.5rem',
                    }}
                    cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                />
                <Bar
                    dataKey={yField}
                    fill={color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}; 