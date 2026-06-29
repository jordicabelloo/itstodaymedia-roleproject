import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL      = process.env.OLLAMA_MODEL ?? "qwen3:14b";

const SYSTEM = `You are a direct-response video creative director specializing in paid social.
You write scripts for Meta Reels, TikTok, and YouTube Shorts that stop the scroll in the first 3 seconds.
You understand pattern interrupts, hook theory, native-feel content, and conversion-focused storytelling.
Output only valid JSON — no markdown fences, no thinking tags, no explanation.`;

const MOCK_SCRIPTS = [
  {
    hook_style: "pattern_interrupt",
    hook: "Wait — you're still doing it the old way?",
    script: "[0-3s] Camera whip to face — confused expression. [3-10s] 'Most brands waste 40% of their ad budget on creatives that died two weeks ago.' [10-20s] Show AdPulse dashboard detecting fatigue in real time. [20-30s] 'Replace it before it costs you.' CTA overlay.",
    visual_direction: "Jump cut opens. Handheld. Dark background, single key light. Product screen B-roll in second half. No music first 3s, then lo-fi beat drops.",
    text_overlays: ["Still doing this?", "40% wasted", "AdPulse detects fatigue", "Replace it now →"],
    rationale: "The accusatory opener creates immediate self-questioning in media buyers who know creative fatigue is real."
  },
  {
    hook_style: "problem_agitation",
    hook: "Your best ad is dying right now. Here's proof.",
    script: "[0-3s] Flat text on black — white bold font. [3-10s] 'Frequency 4.1. CTR down 60%. Still spending $4,800 a week.' [10-20s] AdPulse flags it automatically, generates 3 replacements. [20-30s] 'Don't let it burn your budget.' CTA.",
    visual_direction: "Screen recording style. Real numbers on dark UI. Red indicators. Fast cuts. No talking head — pure data storytelling.",
    text_overlays: ["FREQUENCY: 4.1 ⚠️", "CTR: -60%", "Spend: $4,800/wk", "AdPulse caught it"],
    rationale: "Specific numbers hit harder than vague claims — media buyers recognize these metrics immediately."
  },
  {
    hook_style: "social_proof",
    hook: "This agency cut wasted spend by $12k in one month.",
    script: "[0-3s] Result stat slams in — big white number on dark. [3-10s] 'They connected their Meta account. AdPulse flagged 3 fatigued creatives in the first 24 hours.' [10-20s] Replacement copy generated, approved, live. [20-30s] 'Same results, half the waste.' CTA.",
    visual_direction: "Testimonial framing without a person. Data as the hero. Clean product demo in second half. Warm, confident pacing.",
    text_overlays: ["$12,000 saved", "3 creatives flagged — day 1", "New copy live in 24h", "Try AdPulse →"],
    rationale: "Dollar-specific outcome up front gives skeptical media buyers a concrete benchmark to compare against."
  }
];

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
      options: { temperature: 0.85 },
    }),
  });
  } catch {
    return NextResponse.json({ scripts: MOCK_SCRIPTS });
  }

  if (!res.ok) {
    return NextResponse.json({ scripts: MOCK_SCRIPTS });
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
