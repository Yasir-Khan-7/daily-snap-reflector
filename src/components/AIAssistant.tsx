import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { analyzeNotes } from '@/integrations/groq/client';
import { Note } from '@/types/Note';

interface AIAssistantProps {
  notes: Note[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ notes }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeNotes(notes, query);
      setResponse(result);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">AI Assistant</h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your notes, tasks, or get a summary..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {response && (
          <ScrollArea className="h-[200px] md:h-[300px] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap text-sm md:text-base">
              {response}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default AIAssistant;
