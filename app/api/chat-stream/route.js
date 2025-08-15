import OpenAI from "openai";
import { Readable } from "stream";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(request) {
    try {
        const { message } = await request.json();
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: message }],
            stream: true,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0].delta?.content || ""
                    if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                        );
                }
            }
                controller.close()
            },
        });
        return new Response(Readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }

        })
    } catch (error) { }
    console.error("OpenAI error:", error);
    return Response.json(
        { error: "Failed to fetch response from OpenAI" },
        { status: 500 }
    );
}


