import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL      = process.env.OLLAMA_MODEL ?? "qwen3:14b";

const SYSTEM = `You are a direct-response video creative director specializing in paid social.
You write scripts for Meta Reels, TikTok, and YouTube Shorts that stop the scroll in the first 3 seconds.
You understand pattern interrupts, hook theory, native-feel content, and conversion-focused storytelling.
Output only valid JSON — no markdown fences, no thinking tags, no explanation.`;

export async function POST(req: NextRequest) {
  const { product, audience, pain_point, cta, platform, duration } = await req.json();

  if (!product || !audience) {
    return NextResponse.json({ error: "product and audience are required" }, { status: 400 });
  }

  const prompt = `Create 3 video ad scripts for a ${platform?.toUpperCase() ?? "META REELS"} campaign.

PRODUCT: ${product}
TARGET AUDIENCE: ${audience}
CORE PAIN POINT: ${pain_point ?? "not specified"}
CALL TO ACTION: ${cta ?? "Learn more"}
VIDEO LENGTH: ${duration ?? "30"} seconds

Each script must have a DIFFERENT hook style:
- Pattern interrupt (something visually or verbally unexpected)
- Direct problem agitation (call out the pain immediately)
- Social proof open (lead with result or credibility)

Return ONLY a raw JSON array with exactly this shape:
[
  {
    "hook_style": "pattern_interrupt",
    "hook": "First 3 seconds — the exact words spoken or text on screen. Make it stop the scroll.",
    "script": "Full word-for-word script broken into: [0-3s] hook, [3-10s] problem, [10-20s] solution/product, [20-30s] CTA. Use timestamps.",
    "visual_direction": "What should the viewer see? Camera angle, B-roll suggestions, text overlays, transitions. Be specific.",
    "text_overlays": ["Array", "of", "key", "text", "overlays", "to", "show", "on", "screen"],
    "rationale": "One sentence on why this hook will stop the scroll for this specific audience."
  },
  { "hook_style": "problem_agitation", ... },
  { "hook_style": "social_proof", ... }
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
      options: { temperature: 0.85 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Ollama error: ${err}` }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices[0].message.content;
  const clean = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);

  if (!match) {
    return NextResponse.json({ error: "Model returned unexpected format" }, { status: 500 });
  }

  const scripts = JSON.parse(match[0]);
  return NextResponse.json({ scripts });
}
