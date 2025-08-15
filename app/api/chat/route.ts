import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { message } = await request.json();
        const completions = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: message }],
        });

        return Response.json({
            message: completions.choices[0].message.content,
        });

    } catch (error) {
        console.error("OpenAI error:", error);
        return Response.json(
            { error: "Failed to fetch response from OpenAI" },
            { status: 500 }
        );
    }
}