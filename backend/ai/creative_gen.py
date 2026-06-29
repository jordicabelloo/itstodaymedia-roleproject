import anthropic
from config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = """You are a performance copywriter specializing in direct-response ads.
You understand creative fatigue, hook theory, and what makes people click and convert.
You write copy that is punchy, specific, and benefit-driven — never generic.
Output only valid JSON, no markdown fences."""


def generate_variants(creative: dict, fatigue_signals: list[dict], top_performers: list[dict]) -> list[dict]:
    """
    Given a fatigued creative and the account's top performers,
    return 3 fresh copy variants with rationale.
    """
    signals_text = "\n".join(
        f"- {s['name']}: {s['value']:.2f} (threshold: {s['threshold_critical']:.2f})"
        for s in fatigue_signals
    )

    performers_text = "\n".join(
        f"- Headline: \"{p.get('headline', '')}\" | Body: \"{p.get('body', '')}\" | CTR: {p.get('ctr', 0):.2%} | ROAS: {p.get('roas', 0):.1f}x"
        for p in top_performers[:3]
    )

    prompt = f"""The following ad creative is showing fatigue signals:

FATIGUED CREATIVE:
Headline: {creative.get('headline', 'N/A')}
Body: {creative.get('body', 'N/A')}

FATIGUE SIGNALS:
{signals_text}

TOP PERFORMING ADS IN THIS ACCOUNT (learn from their patterns):
{performers_text}

Generate 3 replacement copy variants. Each must:
- Use a different hook angle (e.g. pain point, social proof, curiosity, urgency)
- Be a direct-response style — specific, benefit-driven, action-oriented
- Not repeat the same opening word or structure as the fatigued ad
- Feel native to a paid social feed (Meta/Google)

Return JSON array with this exact shape:
[
  {{
    "headline": "...",
    "body": "...",
    "hook_angle": "pain_point | social_proof | curiosity | urgency | benefit",
    "rationale": "One sentence explaining why this angle will work now."
  }}
]"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    return json.loads(message.content[0].text)
