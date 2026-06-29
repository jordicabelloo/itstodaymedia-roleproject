from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import campaigns, creatives, alerts

app = FastAPI(title="AdPulse API", version="0.1.0", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://adpulse.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
app.include_router(creatives.router, prefix="/creatives", tags=["creatives"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])


@app.get("/health")
async def health():
    return {"status": "ok"}
