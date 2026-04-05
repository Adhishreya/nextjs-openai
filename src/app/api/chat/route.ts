import { OpenAI } from "openai";

export async function POST(req: Request) {
    const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const chat = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });
        const message = chat.choices[0].message.content;
        return Response.json({ message })
    }
    catch (e: unknown) {
        console.log("erroring", e)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })
    }
} 
