
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AIAction = 'summarize' | 'enhance' | 'categorize' | 'suggest' | string;

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processWithAI = async (action: AIAction, content: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Processing ${action} with AI. Content length: ${content.length}`);
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { action, content }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "An error occurred with the AI service");
      }
      
      if (!data || !data.response) {
        console.error("Invalid response from AI service:", data);
        throw new Error("Received an invalid response from the AI service");
      }
      
      console.log(`AI processing completed for ${action}`);
      setLoading(false);
      return data.response;
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
