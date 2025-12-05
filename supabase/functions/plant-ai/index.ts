import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlantAIRequest {
  type: "identify" | "disease" | "chat" | "care";
  image?: string;
  message?: string;
  plantName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, image, message, plantName }: PlantAIRequest = await req.json();
    console.log(`Processing ${type} request`);

    let systemPrompt = "";
    let userContent: any[] = [];

    switch (type) {
      case "identify":
        systemPrompt = `You are an expert botanist and plant identification specialist. Analyze the provided plant image and identify:
1. The plant species (common name and scientific name)
2. Plant family
3. Key identifying features you observed
4. Native region/habitat
5. Interesting facts about the plant

Be accurate and confident in your identification. If you're uncertain, explain why and provide your best guesses.`;
        userContent = [
          { type: "text", text: "Please identify this plant from the image." },
          { type: "image_url", image_url: { url: image } }
        ];
        break;

      case "disease":
        systemPrompt = `You are an expert plant pathologist specializing in disease detection and diagnosis. Analyze the provided plant image for any signs of disease, pest damage, or health issues. Provide:
1. Health assessment (healthy, mild issues, moderate issues, severe issues)
2. Identified problems (diseases, pests, nutrient deficiencies, environmental stress)
3. Symptoms observed
4. Possible causes
5. Treatment recommendations
6. Prevention tips

Be thorough but practical in your recommendations.`;
        userContent = [
          { type: "text", text: "Please analyze this plant for any diseases or health issues." },
          { type: "image_url", image_url: { url: image } }
        ];
        break;

      case "chat":
        systemPrompt = `You are a friendly and knowledgeable AI plant assistant. You help users with all aspects of plant care, gardening, and botany. You can:
- Answer questions about plant care, watering, sunlight, soil, etc.
- Provide gardening tips and advice
- Help troubleshoot plant problems
- Suggest plants for specific conditions
- Share interesting plant facts

Be helpful, encouraging, and provide practical advice. If you don't know something, say so honestly.`;
        userContent = [{ type: "text", text: message || "Hello!" }];
        break;

      case "care":
        systemPrompt = `You are an expert horticulturist providing detailed plant care recommendations. For the specified plant, provide comprehensive care instructions including:
1. Light requirements (full sun, partial shade, etc.)
2. Watering schedule and tips
3. Soil type and pH preferences
4. Temperature and humidity needs
5. Fertilization schedule
6. Pruning guidelines
7. Common problems and solutions
8. Propagation methods
9. Seasonal care tips
10. Companion planting suggestions

Make recommendations practical and easy to follow.`;
        userContent = [{ type: "text", text: `Please provide detailed care recommendations for: ${plantName}` }];
        break;

      default:
        throw new Error(`Unknown request type: ${type}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    console.log("AI response received successfully");

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in plant-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
