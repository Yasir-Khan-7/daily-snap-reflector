
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Brain, Sparkles, Tag, Lightbulb, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIAssistantProps {
  content: string;
  onApply: (content: string) => void;
  onAddTags?: (tags: string[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ content, onApply, onAddTags }) => {
  const { processWithAI, loading } = useAIAssistant();
  const [result, setResult] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [action, setAction] = useState<string | null>(null);

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
  };

  const applyTags = (tag: string) => {
    if (onAddTags) {
      onAddTags([tag]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Brain className="w-4 h-4" />
          <span>AI Assist</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">AI Assistant</h4>
          
          {!action && !loading && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={() => handleAction('summarize')}
              >
                <Brain className="w-4 h-4" /> Summarize
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={() => handleAction('enhance')}
              >
                <Sparkles className="w-4 h-4" /> Enhance
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={() => handleAction('categorize')}
              >
                <Tag className="w-4 h-4" /> Categorize
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 justify-start"
                onClick={() => handleAction('suggest')}
              >
                <Lightbulb className="w-4 h-4" /> Get Ideas
              </Button>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          )}
          
          {action && !loading && (
            <div className="space-y-3">
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
                result && <p className="text-sm">{result}</p>
              )}
              
              <div className="flex justify-between pt-2">
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
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistant;
