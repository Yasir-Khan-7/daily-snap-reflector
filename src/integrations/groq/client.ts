const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/v1/chat/completions';

export const analyzeNotes = async (notes: any[], query: string) => {
    try {
        const prompt = `
      You are an AI assistant analyzing user notes and tasks. 
      Here is the user's data: ${JSON.stringify(notes)}
      
      User query: ${query}
      
      Please provide a detailed analysis and answer based on the available data.
    `;

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
                        content: 'You are a helpful AI assistant that analyzes user notes and tasks.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                model: 'qwen-qwq-32b',
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing notes with Groq:', error);
        throw error;
    }
}; 