import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Brain, Sparkles, Tag, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIAssistantProps {
  content: string;
  onApply: (content: string) => void;
  onAddTags?: (tags: string[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ content, onApply, onAddTags }) => {
  const { processWithAI, loading, error } = useAIAssistant();
  const [result, setResult] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [action, setAction] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleAction = async (actionType: string) => {
    setAction(actionType);
    setResult('');
    setTags([]);

    const response = await processWithAI(actionType, content);

    if (response) {
      if (actionType === 'categorize' && onAddTags) {
        // Parse tags from response
        const extractedTags = response
          .split(/[,\n]/)
          .map(tag => tag.trim())
          .filter(tag => tag !== '')
          .map(tag => tag.replace(/^[#\-•\*]+\s*/, '').trim())
          .slice(0, 5);

        setTags(extractedTags);
      } else {
        setResult(response);
      }
    }
  };

  const applyResult = () => {
    if (result) {
      onApply(result);
    }

    if (tags.length > 0 && onAddTags) {
      onAddTags(tags);
    }

    setOpen(false);
  };

  const applyTags = (tag: string) => {
    if (onAddTags) {
      onAddTags([tag]);
      setOpen(false);
    }
  };

  // Check if content is too short
  const contentTooShort = content.trim().length < 2;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-yellow-200 hover:from-amber-100 hover:to-yellow-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-amber-700">Ask AI</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Groq AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-0">
            {contentTooShort && !action && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please add more content to use AI assistance.
                </AlertDescription>
              </Alert>
            )}

            {!action && !loading && !contentTooShort && (
              <Tabs defaultValue="actions" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
                  <TabsTrigger value="explain" className="flex-1">What is this?</TabsTrigger>
                </TabsList>
                <TabsContent value="actions">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-auto py-3"
                      onClick={() => handleAction('summarize')}
                    >
                      <Brain className="w-4 h-4 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Summarize</div>
                        <div className="text-xs text-muted-foreground">Create a concise summary</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-auto py-3"
                      onClick={() => handleAction('enhance')}
                    >
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Enhance</div>
                        <div className="text-xs text-muted-foreground">Improve writing quality</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-auto py-3"
                      onClick={() => handleAction('categorize')}
                    >
                      <Tag className="w-4 h-4 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Categorize</div>
                        <div className="text-xs text-muted-foreground">Suggest relevant tags</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-auto py-3"
                      onClick={() => handleAction('suggest')}
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <div className="text-left">
                        <div className="font-medium">Get Ideas</div>
                        <div className="text-xs text-muted-foreground">Actionable next steps</div>
                      </div>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="explain">
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>Daily Snap's AI assistant helps you organize and improve your notes using Groq's powerful AI:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Summarize long content</li>
                      <li>Enhance writing quality</li>
                      <li>Generate relevant tags</li>
                      <li>Suggest next actions</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-100">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Powered by Groq AI</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <p className="text-sm text-gray-500">Processing with Groq AI...</p>
              </div>
            )}

            {error && !loading && (
              <Alert className="bg-red-50 text-red-800 border-red-200 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          {(result || tags.length > 0) && (
            <>
              <CardContent className="space-y-3 border-t pt-4">
                <div className="text-xs font-medium uppercase text-gray-500">
                  {action === 'categorize' ? 'Suggested Tags' : 'Result'}
                </div>

                {action === 'categorize' && tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-100"
                        onClick={() => applyTags(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  result && <p className="text-sm whitespace-pre-line">{result}</p>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAction(null)}
                >
                  Back
                </Button>

                {(result || tags.length > 0) && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={applyResult}
                  >
                    Apply
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistant;
