import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import AIAssistant from '@/components/AIAssistant';
import { Note } from '@/types/Note';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, Search } from 'lucide-react';

const Assistant: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        setLoading(true);
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

  return (
    <Layout>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-gray-500 mt-1">Get intelligent insights from your notes and reflections</p>
          </div>

          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <AIAssistant notes={notes} />
          )}

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-indigo-500" />
                  <span>AI Analysis</span>
                </CardTitle>
                <CardDescription>Intelligent insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our AI assistant provides intelligent insights on all aspects of your data and the app, helping you discover patterns and gain new perspectives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-500" />
                  <span>Smart Queries</span>
                </CardTitle>
                <CardDescription>Ask anything</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Ask anything about your data or the app. From task summaries to productivity advice, the AI is designed to handle a wide range of questions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <span>Example Questions</span>
                </CardTitle>
                <CardDescription>Try these queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">
                  • "Summarize all my notes"
                </p>
                <p className="text-sm text-gray-600">
                  • "How can I improve my productivity?"
                </p>
                <p className="text-sm text-gray-600">
                  • "What's the best way to use this app?"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant; 