
import { Anthropic } from '@anthropic-ai/sdk';


export async function POST(req: Request) {
    if (!process.env.ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }), { status: 500 });
    }
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const { prompt } = await req.json();

    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const msg = await anthropic.messages.create({ model: "claude-3-sonnet-20240229", max_tokens: 1024, messages: [{ role: "user", content: prompt }] })
        const content = msg.content[0];
        const message = (content.type === 'text' ? content.text : "No response");
        return Response.json({ message });
    } catch (err: unknown) {
        console.error("erroring", err)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })

    }
}