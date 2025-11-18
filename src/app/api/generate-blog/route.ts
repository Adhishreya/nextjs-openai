import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    prompt: `Generate a detailed and engaging blog post based on this topic: ${prompt}. The output should be markdown with a title.`,
  });

  return result.toTextStreamResponse();
};
