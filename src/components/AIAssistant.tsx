import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, BrainCircuit, AlertCircle, Info, X } from 'lucide-react';
import { analyzeNotes } from '@/integrations/groq/client';
import { Note } from '@/types/Note';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIAssistantProps {
  notes: Note[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ notes }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseHeight, setResponseHeight] = useState('auto');
  const responseRef = useRef<HTMLDivElement>(null);

  // Adjust height based on content
  useEffect(() => {
    if (responseRef.current && response) {
      const contentHeight = responseRef.current.scrollHeight;
      // Set min and max height constraints
      const minHeight = 200;
      const maxHeight = 400;
      const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
      setResponseHeight(`${newHeight}px`);
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeNotes(notes, query);
      setResponse(result);
      
      // Check if the response contains an error message
      if (result.includes('error') && result.includes('API')) {
        setError('There was an issue connecting to the AI service. Please try again later.');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('');
      setError(`Failed to get a response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat function
  const handleClearChat = () => {
    setQuery('');
    setResponse('');
    setError(null);
  };

  // Example queries to help users
  const exampleQueries = [
    "Summarize all my notes",
    "How can I be more productive?", 
    "What features does this app have?",
    "Give me tips for habit tracking",
    "How do I use the Pomodoro timer?"
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-semibold">AI Assistant</h2>
          </div>
          {(response || error) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearChat} 
              className="text-gray-500 hover:text-red-500"
              title="Clear chat"
            >
              <X className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about the app or your data..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {loading ? "Analyzing..." : "Ask"}
          </Button>
        </form>

        {!query && !response && !error && !loading && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            <AlertDescription>
              Ask me anything about your data or the app. I'm here to help with your notes, tasks, and more.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && !error && (
          <div className="mt-2">
            <ScrollArea 
              className={`w-full rounded-md border border-indigo-100 p-4 bg-indigo-50/30`} 
              style={{ height: responseHeight }}
            >
              <div 
                ref={responseRef}
                className="whitespace-pre-wrap text-sm md:text-base text-gray-800"
              >
                {response}
              </div>
            </ScrollArea>
          </div>
        )}

        {notes.length === 0 && !response && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any notes yet. Create some notes to use the AI Assistant.</p>
          </div>
        )}

        {!response && notes.length > 0 && !error && !loading && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Try these example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-3 py-1 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIAssistant;
