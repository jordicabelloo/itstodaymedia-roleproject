import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen3:14b";

const SYSTEM = `You are a performance copywriter specializing in direct-response paid advertising.
You understand creative fatigue, hook theory, ad platform best practices, and what makes people stop scrolling and convert.
You write copy that is punchy, specific, and benefit-driven — never generic, never vague.
Output only valid JSON. No markdown fences, no explanation, no thinking tags — just the raw JSON array.`;

export async function POST(req: NextRequest) {
  const { headline, body, platform, context, signals } = await req.json();

  if (!headline || !body) {
    return NextResponse.json({ error: "headline and body are required" }, { status: 400 });
  }

  const signalLines = signals?.length
    ? `\nFATIGUE SIGNALS DETECTED:\n${signals.map((s: string) => `- ${s}`).join("\n")}`
    : "";

  const contextLine = context ? `\nPRODUCT/CONTEXT: ${context}` : "";

  const prompt = `The following ${platform?.toUpperCase() ?? "META"} ad creative is underperforming and needs fresh variants:

CURRENT AD:
Headline: ${headline}
Body: ${body}
${contextLine}${signalLines}

Generate 3 replacement copy variants. Each must:
- Use a DIFFERENT hook angle: pain_point, social_proof, curiosity, urgency, or benefit
- Be direct-response: specific, concrete, action-oriented
- Feel native to a paid social feed — not corporate, not generic
- Headline under 40 characters, body under 120 characters
- NOT repeat the same opening word or structure as the original

Return ONLY a raw JSON array with exactly this shape, no other text:
[
  {
    "headline": "...",
    "body": "...",
    "hook_angle": "pain_point",
    "rationale": "One sentence on why this angle will cut through where the original failed."
  },
  {
    "headline": "...",
    "body": "...",
    "hook_angle": "social_proof",
    "rationale": "..."
  },
  {
    "headline": "...",
    "body": "...",
    "hook_angle": "curiosity",
    "rationale": "..."
  }
]`;

  const res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user",   content: prompt },
      ],
      stream: false,
      options: { temperature: 0.8 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Ollama error: ${err}` }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices[0].message.content;

  // Strip thinking tags if model outputs them
  const clean = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Extract JSON array from response
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) {
    return NextResponse.json({ error: "Model returned unexpected format" }, { status: 500 });
  }

  const variants = JSON.parse(match[0]);
  return NextResponse.json({ variants });
}
