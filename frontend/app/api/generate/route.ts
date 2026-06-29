import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen3:14b";

const MOCK_VARIANTS = (headline: string, platform: string) => [
  {
    headline: `${headline.split(" ").slice(0, 3).join(" ")} — people are switching`,
    body: "12,000+ customers already made the move. No contracts, cancel anytime. See why.",
    hook_angle: "social_proof",
    rationale: "Shifts focus to crowd momentum — breaks the familiarity loop causing frequency fatigue.",
  },
  {
    headline: `Your competitor just cut costs by 47%`,
    body: `Here's exactly what they changed — and how you do it before they scale on ${platform}.`,
    hook_angle: "curiosity",
    rationale: "Competitor framing creates urgency without price pressure. Fresh angle for a saturated audience.",
  },
  {
    headline: "This offer disappears July 4th",
    body: "We can only onboard 50 accounts this month. 31 spots left. Get locked in at today's rate.",
    hook_angle: "urgency",
    rationale: "Hard deadline + scarcity re-engages a fatigued audience that has been passively ignoring the ad.",
  },
];

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

  let res: Response;
  try {
    res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
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
  } catch {
    return NextResponse.json({ variants: MOCK_VARIANTS(headline, platform ?? "meta") });
  }

  if (!res.ok) {
    return NextResponse.json({ variants: MOCK_VARIANTS(headline, platform ?? "meta") });
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
