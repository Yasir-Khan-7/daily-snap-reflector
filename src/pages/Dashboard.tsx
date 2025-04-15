import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Analytics from '@/components/Analytics';
import { Note } from '@/types/Note';
import { Layout } from '@/components/ui/layout';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  CalendarClock, 
  ListTodo, 
  Plus, 
  ChevronRight,
  Calendar,
  CheckCircle,
  Activity,
  TrendingUp,
  Clock,
  Book,
  BarChart2,
  PieChart,
  BrainCircuit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calculate metrics
  const totalNotes = notes.length;
  const completedTasks = notes.filter(note => note.type === 'task' && note.completed).length;
  const pendingTasks = notes.filter(note => note.type === 'task' && !note.completed).length;
  const tasksCompletionRate = totalNotes > 0 ? Math.round((completedTasks / (completedTasks + pendingTasks)) * 100) : 0;
  
  // Get today's date for greeting
  const now = new Date();
  const hours = now.getHours();
  let greeting = "Good morning";
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          content: note.content,
          type: note.type as any,
          createdAt: new Date(note.created_at),
          completed: note.completed,
          imageUrl: note.image_url,
          tags: note.tags || []
        }));

        setNotes(formattedNotes);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notes: " + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const getRecentActivity = () => {
    const lastWeekNotes = notes.filter(note => {
      const diff = Math.floor((now.getTime() - note.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 7;
    });
    
    return lastWeekNotes.length;
  };

  // Calculate streak
  const calculateStreak = () => {
    if (notes.length === 0) return 0;
    
    const sortedNotes = [...notes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if there's a note from today
    const todayNotes = sortedNotes.filter(note => {
      const noteDate = new Date(note.createdAt);
      noteDate.setHours(0, 0, 0, 0);
      return noteDate.getTime() === currentDate.getTime();
    });
    
    if (todayNotes.length === 0) {
      return 0; // Streak broken if no notes today
    }
    
    streak = 1; // Start with today
    
    // Check backward for consecutive days
    for (let i = 1; i <= 30; i++) { // Check up to 30 days back
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const notesOnDate = sortedNotes.filter(note => {
        const noteDate = new Date(note.createdAt);
        noteDate.setHours(0, 0, 0, 0);
        return noteDate.getTime() === checkDate.getTime();
      });
      
      if (notesOnDate.length === 0) {
        break;
      }
      
      streak++;
    }
    
    return streak;
  };

  return (
    <Layout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Header with greeting */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{greeting}, {user?.email?.split('@')[0]}</h1>
              <p className="text-gray-500 mt-1">Here's a summary of your productivity and reflections</p>
        </div>
            <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
                className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                asChild
              >
                <Link to="/notes">
                  <FileText className="h-4 w-4" />
                  <span>View All Notes</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm hover:shadow"
                asChild
              >
                <Link to="/notes">
                  <Plus className="h-4 w-4" />
                  <span>New Note</span>
                </Link>
              </Button>
      </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600/5 rounded-bl-full group-hover:bg-purple-600/10 transition-colors"></div>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
                  <Book className="h-7 w-7 text-purple-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">Total Notes</span>
                  <span className="text-3xl font-bold text-gray-900">{totalNotes}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                <span>{getRecentActivity()} new in last 7 days</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-600/5 rounded-bl-full group-hover:bg-green-600/10 transition-colors"></div>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">Tasks Completed</span>
                  <span className="text-3xl font-bold text-gray-900">{completedTasks}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span>{tasksCompletionRate}% completion rate</span>
                </span>
      </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 rounded-bl-full group-hover:bg-blue-600/10 transition-colors"></div>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-7 w-7 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">Current Streak</span>
                  <span className="text-3xl font-bold text-gray-900">{calculateStreak()}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Days of consistent reflection</span>
      </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-600/5 rounded-bl-full group-hover:bg-amber-600/10 transition-colors"></div>
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start">
                <div className="p-2 bg-amber-100 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors">
                  <ListTodo className="h-7 w-7 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">Pending Tasks</span>
                  <span className="text-3xl font-bold text-gray-900">{pendingTasks}</span>
                </div>
        </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>Waiting for completion</span>
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-amber-50 text-amber-700"
                  asChild
                >
                  <Link to="/notes">View</Link>
          </Button>
        </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Quote */}
        <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 shadow-sm hover:shadow-md transition-all mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/80 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-800">Daily Reminder</h3>
                <p className="text-gray-700 italic">
                  "Small daily improvements are the key to staggering long-term results. What you do today matters more than what you plan to do tomorrow."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics Charts */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-purple-500" />
                      Analytics Overview
                    </CardTitle>
                    <CardDescription>Visual insights into your productivity and habits</CardDescription>
                  </div>
                  <Tabs defaultValue="distribution">
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="distribution" className="text-xs">
                        <PieChart className="h-3 w-3 mr-1" />
                        Distribution
                      </TabsTrigger>
                      <TabsTrigger value="timeline" className="text-xs">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Timeline
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Analytics notes={notes} onViewFullReport={() => {
                  toast({
                    title: "Full Report",
                    description: "Detailed analytics report is now available",
                  });
                }} />
              </CardContent>
            </Card>
      </div>

          {/* Tools & Quick Links */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Productivity Tools
                </CardTitle>
                <CardDescription>Track your habits and focus time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid gap-4">
                <div className="hover:bg-indigo-50 p-4 rounded-lg transition-colors group">
                  <h3 className="font-medium flex items-center gap-2 mb-1 group-hover:text-indigo-700 transition-colors">
                    <BrainCircuit className="h-4 w-4 text-indigo-500" />
                    AI Assistant
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Your personal AI guide to help with any questions about the app or your data</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 group-hover:bg-indigo-100 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors"
                    asChild
                  >
                    <Link to="/assistant">
                      Open Assistant
                    </Link>
                  </Button>
                </div>
                
                <div className="hover:bg-purple-50 p-4 rounded-lg transition-colors group">
                  <h3 className="font-medium flex items-center gap-2 mb-1 group-hover:text-purple-700 transition-colors">
                    <CalendarClock className="h-4 w-4 text-purple-500" />
                    Pomodoro Focus Timer
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Boost your productivity with timed focus sessions</p>
          <Button
            variant="outline"
                    size="sm"
                    className="mt-2 group-hover:bg-purple-100 group-hover:text-purple-700 group-hover:border-purple-200 transition-colors"
                    asChild
                  >
                    <Link to="/pomodoro">
                      Start Session
                    </Link>
          </Button>
        </div>
                
                <div className="hover:bg-green-50 p-4 rounded-lg transition-colors group">
                  <h3 className="font-medium flex items-center gap-2 mb-1 group-hover:text-green-700 transition-colors">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Habit Tracker
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Build consistency with daily habit tracking</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 group-hover:bg-green-100 group-hover:text-green-700 group-hover:border-green-200 transition-colors"
                    asChild
                  >
                    <Link to="/habits">
                      View Habits
                    </Link>
                  </Button>
    </div>
                
                <div className="hover:bg-blue-50 p-4 rounded-lg transition-colors group">
                  <h3 className="font-medium flex items-center gap-2 mb-1 group-hover:text-blue-700 transition-colors">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Latest Reflections
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">View your most recent notes and journal entries</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors"
                    asChild
                  >
                    <Link to="/notes">View Notes</Link>
                  </Button>
            </div>

                {/* Link to full settings */}
                <Button 
                  variant="ghost" 
                  className="mt-2 hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors w-full justify-between"
                  asChild
                >
                  <Link to="/settings">
                    <span>View all settings and tools</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
