interface Note {
    id: string;
    content: string;
    createdAt: string;
    [key: string]: any;
}

interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GroqResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const analyzeNotes = async (notes: any[], query: string): Promise<string> => {
    try {
        const systemPrompt = `You are an AI assistant for the Daily Snap application. Provide direct, clear responses about the user's notes and tasks.
            Never include any <think> tags or thinking process in your response.
            Never explain your reasoning or methodology.
            Just provide the final, polished response that:
            - Is focused on the application data
            - Is clear and concise
            - Directly answers the user's query
            - Is professional but friendly
            - Only discusses tasks, notes, and activity in the app

            Example format:
            User: "What tasks do I have?"
            Assistant: "You have 3 tasks: [list tasks]"

            NOT:
            User: "What tasks do I have?"
            Assistant: "<think>Let me analyze the tasks...</think>
            You have 3 tasks: [list tasks]"`;

        const messages: GroqMessage[] = [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: `User data: ${JSON.stringify(notes)}
                    Query: ${query}
                    Remember: Provide ONLY the final response without any thinking process or meta-commentary.`,
            },
        ];


        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: `User data: ${JSON.stringify(notes)}
                        Query: ${query}`,
                    },
                ],
                model: 'llama3-70b-8192',
                temperature: 0.3,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error analyzing notes with Groq:', error);
        throw error;
    }
};         
