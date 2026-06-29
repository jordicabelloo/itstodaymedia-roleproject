from fastapi import APIRouter, HTTPException
from connectors import meta as meta_connector
from engine.fatigue import analyze_fatigue, classify
from ai.creative_gen import generate_variants

router = APIRouter()


@router.get("/{ad_id}/health")
async def creative_health(ad_id: str):
    metrics_14d = await meta_connector.get_ad_insights(ad_id, days=14)
    if not metrics_14d:
        raise HTTPException(status_code=404, detail="No metrics found for this ad")

    metrics_7d = metrics_14d[-7:]
    score, signals = analyze_fatigue(metrics_7d, metrics_14d)
    status = classify(score)

    return {
        "ad_id": ad_id,
        "health_score": score,
        "health_status": status,
        "signals": [
            {
                "name": s.name,
                "value": round(s.value, 4),
                "threshold_warning": s.threshold_warning,
                "threshold_critical": s.threshold_critical,
                "severity": s.severity,
            }
            for s in signals
        ],
    }


@router.get("/{ad_id}/history")
async def creative_history(ad_id: str, days: int = 30):
    return await meta_connector.get_ad_insights(ad_id, days=days)


@router.post("/{ad_id}/generate")
async def generate_creative_variants(ad_id: str, body: dict):
    """
    body: { creative: {headline, body}, top_performers: [...] }
    """
    creative = body.get("creative", {})
    top_performers = body.get("top_performers", [])

    metrics_7d = await meta_connector.get_ad_insights(ad_id, days=7)
    metrics_14d = await meta_connector.get_ad_insights(ad_id, days=14)
    _, signals = analyze_fatigue(metrics_7d, metrics_14d)

    if not signals:
        raise HTTPException(status_code=400, detail="Creative is not fatigued — no variants needed")

    variants = generate_variants(
        creative=creative,
        fatigue_signals=[
            {
                "name": s.name,
                "value": s.value,
                "threshold_critical": s.threshold_critical,
            }
            for s in signals
        ],
        top_performers=top_performers,
    )
    return {"ad_id": ad_id, "variants": variants}
