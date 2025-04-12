import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

type AIAction = 'summarize' | 'enhance' | 'categorize' | 'suggest' | string;

// Mock responses for different AI actions
const mockResponses: Record<string, (content: string) => string> = {
  summarize: (content) => {
    // Simple summarization logic - return first sentence and/or truncate
    const firstSentence = content.split(/[.!?]/)[0];
    return `${firstSentence}. This is a summary of your note.`;
  },
  enhance: (content) => {
    // Add some "enhanced" styling and structure to the content
    return `${content}\n\nEnhanced with better clarity and structure.`;
  },
  categorize: (content) => {
    // Extract potential tags based on content keywords
    const commonTags = ['important', 'todo', 'idea', 'work', 'personal'];
    const contentLower = content.toLowerCase();

    // Simple keyword matching to suggest relevant tags
    const suggestedTags = commonTags.filter(tag =>
      contentLower.includes(tag) || Math.random() > 0.7 // randomly include some tags
    );

    // Add some default tags if none matched
    if (suggestedTags.length === 0) {
      suggestedTags.push('note', 'general');
    }

    return suggestedTags.join(', ');
  },
  suggest: (content) => {
    // Suggest next steps based on content
    const suggestions = [
      "Consider breaking this down into smaller tasks",
      "Set a deadline for this item",
      "Share this with your team",
      "Follow up on this tomorrow",
      "Create a reminder for this task"
    ];

    // Return 2-3 random suggestions
    const randomSuggestions = [];
    for (let i = 0; i < 2 + Math.floor(Math.random()); i++) {
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      randomSuggestions.push(suggestions[randomIndex]);
      suggestions.splice(randomIndex, 1);
      if (suggestions.length === 0) break;
    }

    return `Next steps:\n${randomSuggestions.map(s => `- ${s}`).join('\n')}`;
  }
};

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processWithAI = async (action: AIAction, content: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Processing ${action} with AI. Content length: ${content.length}`);

      // Check for valid content
      if (!content || content.trim().length < 2) {
        throw new Error("Content is too short for AI processing");
      }

      // Add artificial delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process using mock responses instead of calling API
      const mockResponseFn = mockResponses[action] || mockResponses.suggest;
      const response = mockResponseFn(content);

      console.log(`AI processing completed for ${action}`);
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error("AI processing error:", error);
      setLoading(false);
      setError(error.message || "Failed to process with AI. Please try again.");

      toast({
        variant: "destructive",
        title: "AI Processing Failed",
        description: error.message || "Failed to process with AI. Please try again.",
      });

      return null;
    }
  };

  return {
    loading,
    error,
    processWithAI
  };
}
