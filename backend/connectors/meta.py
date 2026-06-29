import httpx
from datetime import datetime, timedelta
from config import settings


BASE_URL = "https://graph.facebook.com/v21.0"
TOKEN = settings.meta_access_token


async def get_ad_accounts() -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE_URL}/me/adaccounts", params={
            "fields": "id,name,account_status",
            "access_token": TOKEN,
        })
        r.raise_for_status()
        return r.json().get("data", [])


async def get_campaigns(account_id: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE_URL}/{account_id}/campaigns", params={
            "fields": "id,name,status,daily_budget,objective",
            "access_token": TOKEN,
        })
        r.raise_for_status()
        return r.json().get("data", [])


async def get_ads(campaign_id: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE_URL}/{campaign_id}/ads", params={
            "fields": "id,name,status,creative{id,body,title,image_url}",
            "access_token": TOKEN,
        })
        r.raise_for_status()
        return r.json().get("data", [])


async def get_ad_insights(ad_id: str, days: int = 14) -> list[dict]:
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    until = datetime.utcnow().strftime("%Y-%m-%d")
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE_URL}/{ad_id}/insights", params={
            "fields": "date_start,impressions,clicks,spend,actions,frequency,cpm,ctr",
            "time_increment": 1,
            "time_range": f'{{"since":"{since}","until":"{until}"}}',
            "access_token": TOKEN,
        })
        r.raise_for_status()
        rows = r.json().get("data", [])
        return [_normalize_insight(row) for row in rows]


def _normalize_insight(row: dict) -> dict:
    spend = float(row.get("spend", 0))
    clicks = int(row.get("clicks", 0))
    impressions = int(row.get("impressions", 0))
    actions = row.get("actions", [])
    conversions = sum(int(a["value"]) for a in actions if a["action_type"] == "purchase")
    revenue = sum(float(a.get("value", 0)) for a in actions if a["action_type"] == "purchase")
    roas = revenue / spend if spend > 0 else 0.0
    ctr = float(row.get("ctr", 0)) / 100
    cpm = float(row.get("cpm", 0))
    frequency = float(row.get("frequency", 0))
    return {
        "date": row["date_start"],
        "impressions": impressions,
        "clicks": clicks,
        "spend": spend,
        "conversions": conversions,
        "revenue": revenue,
        "roas": roas,
        "ctr": ctr,
        "cpm": cpm,
        "frequency": frequency,
    }
