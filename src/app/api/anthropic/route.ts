
import { Anthropic } from '@anthropic-ai/sdk';


const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: any) {
    const { prompt } =await req.json();
    console.log("response object", prompt)

    if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 })
    }

    try {
        const msg: any = await anthropic.messages.create({ model: "claude-3-sonnet-20240229", max_tokens: 1024, messages: [{ role: "user", content: prompt }] })
        const message = msg?.content?.[0]?.text || "No response"
        return Response.json({ message });
    } catch (err: any) {
        console.log("erroring", err)
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 })

    }
}