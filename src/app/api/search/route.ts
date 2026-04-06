import { google } from "@ai-sdk/google";
import { extractTool, searchTool } from "@parallel-web/ai-sdk-tools";
import { generateText } from "ai";

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response(JSON.stringify({ error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured" }), { status: 500 });
    }
    const { prompt } = await req.json();
    const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        tools: {
            google_search: google.tools.googleSearch({}),
            webSearch: searchTool,
            webExtract: extractTool
        },
        prompt
    });

    return new Response(text, {
        headers: { "Content-Type": "text/plain" }
    });

}