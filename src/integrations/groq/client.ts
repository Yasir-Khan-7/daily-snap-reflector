// Direct integration with Groq API with fixed endpoint
import { GROQ_API_KEY } from '@/config';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // Updated endpoint

// Generate a fallback response based on the notes (only used if API fails)
const generateFallbackResponse = (notes: any[], query: string) => {
    // Count number of notes by type
    const noteCount = notes.length;
    const taskCount = notes.filter(note => note.type === 'task').length;
    const completedTasks = notes.filter(note => note.type === 'task' && note.completed).length;
    
    return `Error connecting to AI service. You have ${noteCount} notes in your collection.`;
};

export const analyzeNotes = async (notes: any[], query: string) => {
    try {
        console.log('Sending request to Groq API...');
        
        // Determine if detailed response is requested
        const detailsRequested = query.toLowerCase().includes('detail') || 
                             query.toLowerCase().includes('explain') || 
                             query.toLowerCase().includes('elaborate') ||
                             query.toLowerCase().includes('why');
        
        // Create a system prompt that doesn't restrict the types of questions
        const systemPrompt = detailsRequested 
            ? 'You are a helpful AI assistant for a productivity and reflection app called Daily Snap. Provide detailed, thoughtful responses to any question about the user\'s data or the app.'
            : 'You are a helpful AI assistant for a productivity and reflection app called Daily Snap. Be extremely concise and to the point. Keep responses under 2-3 sentences whenever possible.';
        
        // Extract relevant metadata about the app to help the model understand context
        const appMetadata = {
            appName: "Daily Snap",
            features: ["Note taking", "Task management", "Image notes", "Link saving", "Tag organization", "Habit tracking", "Focus timer"],
            noteTypes: ["text", "task", "image", "link"],
            notesCount: notes.length,
            tasksCount: notes.filter(note => note.type === 'task').length,
            completedTasksCount: notes.filter(note => note.type === 'task' && note.completed).length
        };
        
        // Create a more flexible prompt that allows general questions
        const prompt = `
The user is asking: "${query}"

Here's the current data from their Daily Snap app:
- Notes data: ${JSON.stringify(notes)}
- App metadata: ${JSON.stringify(appMetadata)}

${detailsRequested 
    ? 'Provide a detailed, helpful response.' 
    : 'Respond very concisely with just the essential information. Prioritize brevity.'}

You can answer questions about any aspect of the user's data or the app itself. If their question isn't related to the data or the app, politely explain you're an assistant for the Daily Snap app.
`;
        
        // Request body for the Groq API using OpenAI-compatible format
        const requestBody = {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama3-70b-8192',
            temperature: 0.7,
            max_tokens: detailsRequested ? 1000 : 300,
        };

        // Make the request to the Groq API with proper headers
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        console.log('Groq API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error Response:', errorText);
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData)}`);
            } catch (e) {
                throw new Error(`Groq API error: ${response.status} - ${errorText || response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Received valid response from Groq API');
        
        if (!data || !data.choices || data.choices.length === 0) {
            throw new Error('Invalid response format from Groq API');
        }
        
        // Return the actual LLM-generated content
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('Error analyzing notes with Groq API:', error);
        // Only fall back to static response when there's an actual error
        return `Error connecting to AI service: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}; 