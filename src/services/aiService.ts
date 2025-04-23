import { handleAIRequest } from '../../supabase/functions/ai-assistant/index';

/**
 * Client-side service to handle AI assistant requests
 * This is a replacement for the Supabase Edge Function for GitHub Pages deployment
 */
export async function processAIRequest(action: string, content: string): Promise<any> {
  try {
    // Use the adapted handler function
    const result = await handleAIRequest(action, content);
    return result;
  } catch (error) {
    console.error('Error processing AI request:', error);
    return {
      error: 'Failed to process AI request',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 