import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { processAIRequest } from '@/services/aiService';
import { GROQ_API_KEY } from '@/config';

type AIAction = 'summarize' | 'enhance' | 'categorize' | 'suggest' | string;

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

      try {
        // Try direct API call first
        let prompt = "";

        switch (action) {
          case 'summarize':
            prompt = `Summarize the following note in 2-3 sentences: "${content}"`;
            break;
          case 'enhance':
            prompt = `Improve the writing and clarity of the following note, maintaining its original meaning: "${content}"`;
            break;
          case 'categorize':
            prompt = `Suggest 3-5 relevant tags for categorizing this note (just the tags, comma separated): "${content}"`;
            break;
          case 'suggest':
            prompt = `Based on this note: "${content}", suggest 2-3 actionable next steps or related ideas. Format as bullet points.`;
            break;
          default:
            prompt = `${action}: ${content}`;
        }

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI assistant for a notes application called Daily Snap. Your responses should be concise, relevant, and helpful for organizing and improving the user\'s notes.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 200,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to process with AI');
        }

        const data = await response.json();
        const result = data.choices[0]?.message?.content || 'No response generated';

        console.log(`AI processing completed for ${action}`);
        setLoading(false);
        return result;
      } catch (directApiError) {
        console.error("Direct API error, falling back to client service:", directApiError);
        
        // Fall back to our client-side implementation
        const result = await processAIRequest(action, content);
        if (result.error) {
          throw new Error(result.error);
        }
        
        return result.response;
      }
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
