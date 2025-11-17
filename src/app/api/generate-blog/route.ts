import { google } from '@ai-sdk/google';
import { GoogleGenAI } from '@google/genai';
import { streamText } from 'ai'

export const runtime = "edge";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })

export const POST = async (req: Request) => {
    const { prompt } = await req.json();
    const response = await streamText({
        model: google("gemini-2.5-flash"),
        prompt: `Generate a detailed and engaging blog post based on the following topic: ${prompt}. The output should be in Markdown format, includeing a title and be ready for display on a blog.`
    });

    console.log("response generated", response.toTextStreamResponse());
    return response.toTextStreamResponse();
}