import { google } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { streamText } from "ai";

export const runtime = "edge";


const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});



const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
});


export async function POST(req: Request) {
    const { prompt } = await req.json();

    const ip = req.headers.get('x-forwarded-for') ?? "global";
    const key = `blog:${prompt}`

    const { success, reset } = await ratelimit.limit(ip);

    if (!success) {
        return new Response(JSON.stringify({
            error: "Rate limit exceeded Try again later",
            reset,
        })),
        {
            status: 429,
            headers: { ContentType: "applcation/json" }
        }
    }

    const cached = await redis.get<string>(key);
    if (cached) {
        return new Response(cached, {
            headers: { ContentType: "text/plain" }
        })
    }

    const result = await streamText({
        model: google("gemini-2.5-flash"),
        prompt: `Generate a detailed and engaging blog post based on this topic: ${prompt}. The output should be markdown with a title.`,
    });


    let final = '';
    for await (const chunk of result.textStream) {
        final += chunk
    }
    await redis.set(key, final, { ex: 60 * 60 * 24 });

    return new Response(final, {
        headers: { ContentType: "text/plain" }
    })
    // return result.toTextStreamResponse();
};
