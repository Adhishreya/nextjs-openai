import { google } from "@ai-sdk/google";
import { extractTool, searchTool } from "@parallel-web/ai-sdk-tools";
import { generateText } from "ai";

export async function POST(req: any) {
    const { prompt } = await req.json();
    const { text, sources, providerMetadata } = await generateText({
        model: google("gemini-2.5-flash"),
        tools: {
            gogle_search: google.tools.googleSearch({}),
            webSearch: searchTool,
            webExtract: extractTool
        },
        prompt
    });

    console.log("sources", sources);

    const metadata = providerMetadata?.google;
    const groundingMetadata = metadata?.groundingMetadata;
    const safetyRatings = metadata?.safetyRatings;

    console.log("metadataDetails", groundingMetadata, safetyRatings)
    return new Response(text, {
        headers: { "Content-Type": "text/plain" }
    });

}