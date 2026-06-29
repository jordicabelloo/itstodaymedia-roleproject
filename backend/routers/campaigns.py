from fastapi import APIRouter, HTTPException
from connectors import meta, google_ads
from config import settings

router = APIRouter()


@router.get("/")
async def list_campaigns():
    meta_accounts = await meta.get_ad_accounts()
    result = []
    for account in meta_accounts:
        campaigns = await meta.get_campaigns(account["id"])
        for c in campaigns:
            result.append({**c, "platform": "meta", "account_id": account["id"]})
    return result


@router.get("/{campaign_id}/creatives")
async def list_campaign_creatives(campaign_id: str, platform: str = "meta"):
    if platform == "meta":
        ads = await meta.get_ads(campaign_id)
        return ads
    raise HTTPException(status_code=400, detail="Unsupported platform")
