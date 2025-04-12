
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Groq } from "npm:groq";

const groqApiKey = Deno.env.get("GROQ_API_KEY");
const groqClient = new Groq({ apiKey: groqApiKey });

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
    const { action, content } = await req.json();
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
    });

    const response = chatCompletion.choices[0]?.message?.content || "No response generated";

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
