from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from datetime import datetime, timedelta
from config import settings


def _build_client() -> GoogleAdsClient:
    return GoogleAdsClient.load_from_dict({
        "developer_token": settings.google_ads_developer_token,
        "client_id": settings.google_ads_client_id,
        "client_secret": settings.google_ads_client_secret,
        "refresh_token": settings.google_ads_refresh_token,
        "login_customer_id": settings.google_ads_login_customer_id,
        "use_proto_plus": True,
    })


def get_campaigns(customer_id: str) -> list[dict]:
    client = _build_client()
    ga_service = client.get_service("GoogleAdsService")
    query = """
        SELECT campaign.id, campaign.name, campaign.status,
               campaign_budget.amount_micros
        FROM campaign
        WHERE campaign.status != 'REMOVED'
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    return [
        {
            "id": str(row.campaign.id),
            "name": row.campaign.name,
            "status": row.campaign.status.name,
            "daily_budget": row.campaign_budget.amount_micros / 1_000_000,
        }
        for row in response
    ]


def get_ad_insights(customer_id: str, ad_id: str, days: int = 14) -> list[dict]:
    client = _build_client()
    ga_service = client.get_service("GoogleAdsService")
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    until = datetime.utcnow().strftime("%Y-%m-%d")
    query = f"""
        SELECT
            segments.date,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value,
            metrics.ctr,
            metrics.average_cpm
        FROM ad_group_ad
        WHERE ad_group_ad.ad.id = {ad_id}
          AND segments.date BETWEEN '{since}' AND '{until}'
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    results = []
    for row in response:
        spend = row.metrics.cost_micros / 1_000_000
        revenue = row.metrics.conversions_value
        roas = revenue / spend if spend > 0 else 0.0
        results.append({
            "date": row.segments.date,
            "impressions": row.metrics.impressions,
            "clicks": row.metrics.clicks,
            "spend": spend,
            "conversions": int(row.metrics.conversions),
            "revenue": revenue,
            "roas": roas,
            "ctr": row.metrics.ctr,
            "cpm": row.metrics.average_cpm / 1_000_000,
            "frequency": 0.0,  # Google Ads doesn't expose frequency at ad level
        })
    return results
