import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL      = process.env.OLLAMA_MODEL ?? "qwen3:14b";

const TOOL_NOTES: Record<string, string> = {
  Higgsfield: "Higgsfield excels at realistic human motion and emotion. Describe the person, their micro-expression, body language, lighting, and camera movement. No scene titles.",
  Kling:      "Kling handles cinematic motion well. Be specific about camera motion (push in, pull back, pan), lighting mood, and character action. Include 'realistic' for photorealistic output.",
  IStudio:    "IStudio (PixVerse) works best with clear scene descriptions. Describe foreground, background, lighting, color grade, and the specific motion you want.",
  Runway:     "Runway Gen-3: describe the shot as a film director would. Include lens type (24mm, 85mm), depth of field, color palette, and the exact movement across the clip duration.",
  Sora:       "Sora handles complex scenes. Describe the setting, characters, actions, lighting, and camera work in natural language. Be detailed — Sora can handle it.",
};

export async function POST(req: NextRequest) {
  const { hook, tool } = await req.json();
  if (!hook) return NextResponse.json({ error: "hook is required" }, { status: 400 });

  const toolNote = TOOL_NOTES[tool] ?? TOOL_NOTES["Higgsfield"];

  const prompt = `You are a video production director writing AI video generation prompts.

A media buyer needs footage for this ad hook (first 3 seconds of a paid social ad):
Hook type: ${hook.tag}
Hook script: ${hook.script}

Create a production prompt optimized for ${tool}. ${toolNote}

The prompt must:
- Describe exactly what to show in the first 3 seconds that will stop the scroll
- Match the emotional tone of the hook (${hook.tag})
- Be shot-ready: no abstract concepts, only visual/motion instructions
- Be 80-120 words, no headers, no bullet points — one continuous paragraph

Output only the raw prompt text. Nothing else.`;

  const res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      options: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Ollama error" }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices[0].message.content;
  const clean = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return NextResponse.json({ prompt: clean });
}
