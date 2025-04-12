
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AIAction = 'summarize' | 'enhance' | 'categorize' | 'suggest' | string;

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);

  const processWithAI = async (action: AIAction, content: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { action, content }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setLoading(false);
      return data.response;
    } catch (error: any) {
      setLoading(false);
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
    processWithAI
  };
}
