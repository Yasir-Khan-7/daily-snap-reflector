import React from 'react';
import { Layout } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import PomodoroTimer from '@/components/PomodoroTimer';

const Pomodoro: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <Card className="max-w-xl mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-6">Pomodoro Timer</h1>
                        <PomodoroTimer />
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Pomodoro; 