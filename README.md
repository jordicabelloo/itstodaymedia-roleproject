<div align="center">

```
 █████╗ ██████╗ ██████╗ ██████╗ ██╗   ██╗██╗     ███████╗███████╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
███████║██║  ██║██████╔╝██║  ██║██║   ██║██║     ███████╗█████╗  
██╔══██║██║  ██║██╔═══╝ ██║  ██║██║   ██║██║     ╚════██║██╔══╝  
██║  ██║██████╔╝██║     ██████╔╝╚██████╔╝███████╗███████║███████╗
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝
```

### AI-powered creative intelligence for performance marketing teams

**Detect ad fatigue before it kills your ROAS. Generate replacements in seconds.**

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-D97757?style=flat-square)
![Meta](https://img.shields.io/badge/Meta_Ads_API-v21-0866FF?style=flat-square&logo=meta&logoColor=white)
![Google Ads](https://img.shields.io/badge/Google_Ads_API-v17-4285F4?style=flat-square&logo=googleads&logoColor=white)

</div>

---

## The problem

Media buying teams lose **15–20% of ad budget** to creative fatigue every month — and most don't catch it until the ROAS is already in freefall.

The signal is there in the data. Nobody's watching it in real time.

```
Week 1:  CTR 3.2% │████████████████████████████████░░░  Healthy
Week 2:  CTR 2.7% │███████████████████████████░░░░░░░░  Warning
Week 3:  CTR 1.9% │███████████████████░░░░░░░░░░░░░░░░  Critical ← you find out here
Week 4:  CTR 1.1% │███████████░░░░░░░░░░░░░░░░░░░░░░░░  Budget burned
```

AdPulse catches the inflection at Week 2 and hands you new creative before Week 3 hits.

---

## What it does

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADPULSE FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Meta Ads API ──┐                                              │
│                  ├──▶ Ingestion ──▶ Fatigue Engine ──▶ Score    │
│  Google Ads API ─┘         │                          │         │
│                             │                         ▼         │
│                        PostgreSQL            Healthy / Warning  │
│                                              / Critical         │
│                                                       │         │
│                                                       ▼         │
│                                            Claude Sonnet 4.6    │
│                                         (analyzes winner copy)  │
│                                                       │         │
│                                                       ▼         │
│                                          3 replacement variants │
│                                          ready to upload        │
└─────────────────────────────────────────────────────────────────┘
```

### Core capabilities

| Feature | Description |
|---------|-------------|
| **Fatigue Detection** | Monitors frequency, CTR decay, CPM spikes, and ROAS drops across all active ads |
| **Health Scoring** | Each creative gets a 0–100 score updated every 6h with directional trend |
| **AI Copy Generation** | Claude analyzes your top-performing ads and generates 3 replacement variants per fatigued creative |
| **Multi-Platform** | Meta Ads (v21) + Google Ads (v17) in a single dashboard |
| **Alerts** | Instant notifications when creatives cross critical thresholds |
| **Performance History** | 90-day rolling window of creative performance for pattern analysis |

---

## Fatigue signals

AdPulse flags a creative as **Warning** or **Critical** based on these thresholds — derived from real media buying practitioners managing $20K–$800M+ in ad spend:

```python
FATIGUE_SIGNALS = {
    "frequency":      {"warning": 2.5,  "critical": 3.5},   # impressions per person
    "ctr_decay_7d":   {"warning": 0.15, "critical": 0.25},  # % drop in 7 days
    "cpm_spike_7d":   {"warning": 0.20, "critical": 0.35},  # % increase vs baseline
    "roas_drop_7d":   {"warning": 0.20, "critical": 0.35},  # % drop in 7 days
}
```

Each signal contributes to a composite **Health Score**. When a creative hits Critical, the AI generation pipeline triggers automatically.

---

## Architecture

```
adpulse/
├── backend/                    # Python + FastAPI
│   ├── connectors/
│   │   ├── meta.py             # Meta Marketing API client
│   │   └── google_ads.py       # Google Ads API client
│   ├── engine/
│   │   ├── fatigue.py          # Detection logic + signal weights
│   │   └── scoring.py          # Composite health score (0–100)
│   ├── ai/
│   │   └── creative_gen.py     # Claude — analyzes winners, generates variants
│   └── routers/
│       ├── campaigns.py        # GET /campaigns, /campaigns/{id}/ads
│       ├── creatives.py        # GET /creatives, health scores, history
│       └── alerts.py           # GET /alerts, POST /alerts/{id}/dismiss
│
├── frontend/                   # Next.js 15 + Tailwind
│   └── app/
│       ├── page.tsx            # Dashboard — account health overview
│       ├── alerts/page.tsx     # Critical creatives + AI suggestions
│       └── creative/[id]/      # Creative deep dive + variants
│
└── docker-compose.yml          # One-command local setup
```

---

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Backend | Python 3.11 + FastAPI | Async, fast, clean API design |
| AI | Claude Sonnet 4.6 (Anthropic) | Best-in-class copy understanding and generation |
| Ad APIs | Meta Marketing API v21, Google Ads API v17 | Direct platform data, no middleman |
| Database | PostgreSQL | Time-series performance data + creative history |
| Frontend | Next.js 15 + Tailwind CSS | Fast iteration, easy deploy |
| Deploy | Railway (backend) + Vercel (frontend) | Zero-config, production-ready |

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Meta Ads API access token
- Google Ads API developer token
- Anthropic API key

### Run locally

```bash
# Clone and install
git clone https://github.com/jordicabelloo/itstodaymedia-roleproject.git adpulse
cd adpulse

# Backend
cp backend/.env.example backend/.env   # fill in your keys
cd backend && pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Or with Docker:

```bash
cp backend/.env.example backend/.env
docker compose up
```

Open `http://localhost:3000`

### Environment variables

```env
# backend/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/adpulse
ANTHROPIC_API_KEY=sk-ant-...
META_ACCESS_TOKEN=...
META_APP_ID=...
META_APP_SECRET=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
```

---

## API reference

```
GET  /campaigns                         → list all campaigns with health summary
GET  /campaigns/{id}/creatives          → creatives for a campaign + health scores
GET  /creatives/{id}/history            → 90-day performance history
POST /creatives/{id}/generate           → trigger AI copy generation
GET  /alerts                            → active fatigue alerts
POST /alerts/{id}/dismiss               → mark alert as resolved
GET  /health                            → system health check
```

---

## Why this wins

Most teams don't have a dedicated engineer watching creative performance. They catch fatigue in the weekly retrospective — after the budget is gone.

AdPulse closes the loop: **detect → generate → replace**, without leaving the dashboard. The AI doesn't just surface the problem — it hands you the solution.

The next version uploads approved variants directly via the Meta Ads API, making the entire creative refresh cycle a one-click operation.

---

## Roadmap

- [x] Fatigue detection engine (Meta + Google)
- [x] AI copy generation (Claude Sonnet 4.6)
- [x] Performance dashboard
- [ ] Auto-upload approved variants via Meta Ads API
- [ ] Slack / email alerts
- [ ] TikTok Ads + Taboola connectors
- [ ] Image variant generation (creative brief → Flux/DALL-E)
- [ ] Looker Studio export

---

<div align="center">

Built for the It's Today Media Build Challenge · July 2026

</div>
