import { OpenAI } from "openai";

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: any) {
    const { prompt } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const chat: any = openAI?.chat?.completions?.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "prompt" }]
        });
        console.log("chatting", chat)
        const message = chat?.choices[0]?.message?.content;
        return Response.json({ message })
    }
    catch (e: any) {
        console.log("erroring", e)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })
    }
} 
