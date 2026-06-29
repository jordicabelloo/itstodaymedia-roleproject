from fastapi import APIRouter

router = APIRouter()

_dismissed: set[str] = set()


@router.get("/")
async def list_alerts():
    # In production this reads from PostgreSQL alerts table
    return {"alerts": [], "dismissed": list(_dismissed)}


@router.post("/{alert_id}/dismiss")
async def dismiss_alert(alert_id: str):
    _dismissed.add(alert_id)
    return {"dismissed": alert_id}
