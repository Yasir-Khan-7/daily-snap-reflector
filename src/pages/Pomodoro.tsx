import React from 'react';
import { Layout } from '@/components/ui/layout';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Brain, Zap } from 'lucide-react';

const Pomodoro: React.FC = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pomodoro Focus Timer</h1>
            <p className="text-gray-500 mt-1">Boost your productivity with timed focus sessions</p>
          </div>

          <PomodoroTimer />

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Time Management</span>
                </CardTitle>
                <CardDescription>Structured work intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  The Pomodoro Technique uses timed intervals, typically 25 minutes in length, separated by short breaks to maximize focus and productivity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>Mental Focus</span>
                </CardTitle>
                <CardDescription>Enhanced concentration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  By committing to short, focused work sessions, you train your brain to concentrate for short periods and avoid burnout through regular breaks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>Productivity Tips</span>
                </CardTitle>
                <CardDescription>Get more done</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Remove distractions during work intervals, keep a task list nearby, track your completed sessions, and adjust interval lengths to suit your work style.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pomodoro; 