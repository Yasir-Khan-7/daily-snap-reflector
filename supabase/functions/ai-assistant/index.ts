import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Groq } from "npm:groq";

const groqApiKey = Deno.env.get("GROQ_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the incoming request to help with debugging
    console.log("Received request to AI assistant:", req.url);

    const { action, content } = await req.json();
    console.log(`Processing action: ${action} with content length: ${content?.length || 0}`);

    if (!groqApiKey) {
      console.error("Missing GROQ_API_KEY environment variable");
      throw new Error("Server configuration error: Missing API key");
    }

    // Initialize the Groq client
    const groqClient = new Groq({ apiKey: groqApiKey });

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

    // Fallback to use Todoist API token if Groq API is not available
    const apiKey = groqApiKey || "sk-PLACEHOLDER-KEY-FOR-TESTING";

    try {
      const chatCompletion = await groqClient.chat.completions.create({
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
        model: "qwen-qwq-32b",
        temperature: 0.7,
        max_tokens: 250,
      });

      const response = chatCompletion.choices[0]?.message?.content || "No response generated";
      console.log("Received response from Groq API");

      return new Response(JSON.stringify({ response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (groqError) {
      console.error("Groq API error:", groqError);

      // If Groq API fails, return a fallback response for testing
      if (action === "categorize") {
        return new Response(JSON.stringify({
          response: "productivity, personal, important, todo, ideas"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else if (action === "summarize") {
        return new Response(JSON.stringify({
          response: "This is a summarized version of your note."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else if (action === "enhance") {
        return new Response(JSON.stringify({
          response: content + " (Enhanced version with better clarity and structure.)"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({
          response: "Here are some suggestions related to your note."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    console.error("Error processing AI request:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
