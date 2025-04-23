// Edge function for AI assistant
// Note: This file is modified for client-side use with GitHub Pages

// Import axios or use fetch API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from config
import { GROQ_API_KEY } from '../../../src/config';

// Handler function (exported for client-side use)
export async function handleAIRequest(action, content) {
  try {
    // Log the incoming request to help with debugging
    console.log(`Processing action: ${action} with content length: ${content?.length || 0}`);

    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      throw new Error("Client configuration error: Missing API key");
    }

    let prompt = "";

    switch (action) {
      case "summarize":
        prompt = `Summarize the following note in 2-3 sentences: "${content}"`;
        break;
      case "enhance":
        prompt = `Improve the writing and clarity of the following note, maintaining its original meaning: "${content}"`;
        break;
      case "categorize":
        prompt = `Suggest 3-5 relevant tags for categorizing this note: "${content}"`;
        break;
      case "suggest":
        prompt = `Based on this note: "${content}", suggest 2-3 actionable next steps or related ideas.`;
        break;
      default:
        prompt = `${action}: ${content}`;
    }

    console.log("Sending request to Groq API");

    try {
      // Direct Groq API call using fetch
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for a notes application called Daily Snap. Your responses should be concise, relevant, and helpful for organizing and improving the user's notes.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "llama3-70b-8192",
          temperature: 0.7,
          max_tokens: 250,
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "No response generated";
      console.log("Received response from Groq API");

      return { response: aiResponse };
    } catch (groqError) {
      console.error("Groq API error:", groqError);

      // If Groq API fails, return a fallback response for testing
      if (action === "categorize") {
        return {
          response: "productivity, personal, important, todo, ideas"
        };
      } else if (action === "summarize") {
        return {
          response: "This is a summarized version of your note."
        };
      } else if (action === "enhance") {
        return {
          response: content + " (Enhanced version with better clarity and structure.)"
        };
      } else {
        return {
          response: "Here are some suggestions related to your note."
        };
      }
    }
  } catch (error) {
    console.error("Error processing AI request:", error);
    return {
      error: "An error occurred while processing your request",
      details: error.message,
    };
  }
}
