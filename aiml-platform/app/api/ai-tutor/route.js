import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer:
          "Demo tutor mode: In supervised learning, models learn from labeled examples (input + correct answer). In unsupervised learning, models discover patterns in unlabeled data like clustering. Use supervised for prediction tasks and unsupervised for exploration.",
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are an AIML tutor for beginners. Explain clearly in under 160 words with one analogy. Question: ${topic}`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    const data = await response.json();
    const answer = data.output_text || "No answer generated";
    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      {
        error: "AI Tutor request failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
