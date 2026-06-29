import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM = `You are a performance copywriter specializing in direct-response paid advertising.
You understand creative fatigue, hook theory, ad platform best practices, and what makes people stop scrolling and convert.
You write copy that is punchy, specific, and benefit-driven — never generic, never vague.
Output only valid JSON, no markdown, no explanation outside the JSON.`;

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
- Use a DIFFERENT hook angle (pain_point, social_proof, curiosity, urgency, or benefit)
- Be direct-response style: specific, concrete, action-oriented
- Feel native to a paid social feed — not corporate, not generic
- Have a headline under 40 characters and body under 120 characters
- NOT repeat the same opening word or structure as the original

Return a JSON array with exactly this shape:
[
  {
    "headline": "...",
    "body": "...",
    "hook_angle": "pain_point | social_proof | curiosity | urgency | benefit",
    "rationale": "One sentence on why this angle will cut through where the original failed."
  }
]`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { text: string }).text;
  const variants = JSON.parse(raw);

  return NextResponse.json({ variants });
}
