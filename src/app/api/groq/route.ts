import { OpenAI } from "openai";

export async function POST(req: Request) {
    if (!process.env.GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured" }), { status: 500 });
    }
    const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });

    const { prompt, model } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const chat = await groq.chat.completions.create({
            model: model || "llama3-8b-8192",
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1024,
            stream: true
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of chat) {
                    const token = chunk.choices[0]?.delta?.content;
                    if (token) {
                        controller.enqueue(encoder.encode(token))
                    }
                }
                controller.close()
            }
        });
        // const message = await chat?.choices[0]?.message?.content;
        return new Response(readable, { headers: { "Content-Type": "text/plain" } })
    }
    catch (e: unknown) {
        console.error("erroring", e)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })
    }
} 
