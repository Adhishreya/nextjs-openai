import { OpenAI } from "openai";

const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });

export async function POST(req: any) {
    
    const { prompt } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const chat: any = await groq?.chat?.completions?.create({
            model: "llama3-8b-8192",
            temperature: 0.7,
            messages: [{ role: "user", content: "prompt" }],
            max_tokens: 1024
        });
        // console.log('Groq response:', JSON.stringify(chat, null, 2));
        const message = await chat?.choices[0]?.message?.content;
        return Response.json({ message })
    }
    catch (e: any) {
        console.log("erroring", e)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })
    }
} 
