import React from 'react';
import { Layout } from '@/components/ui/layout';
import HabitTracker from '@/components/HabitTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Target } from 'lucide-react';

const Habits: React.FC = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
            <p className="text-gray-500 mt-1">Build consistency with daily habit tracking</p>
          </div>

          <HabitTracker />

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span>Consistency</span>
                </CardTitle>
                <CardDescription>Build positive streaks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track your habits daily to build momentum and create lasting behavioral changes. 
                  The longer your streak, the stronger your habit becomes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  <span>Progress</span>
                </CardTitle>
                <CardDescription>Visualize your growth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  See your progress over time with our visual tracker. Identify patterns 
                  in your behavior and celebrate consecutive days of success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <span>Goal Setting</span>
                </CardTitle>
                <CardDescription>Define clear habits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Start with small, specific habits that are easy to maintain. Focus on consistency rather 
                  than perfection, and gradually build up to more challenging goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Habits; 