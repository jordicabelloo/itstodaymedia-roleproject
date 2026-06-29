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

**Detect ad fatigue. Generate replacements. Build video combinations. Learn from every campaign.**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-D97757?style=flat-square)
![Meta](https://img.shields.io/badge/Meta_Ads_API-v21-0866FF?style=flat-square&logo=meta&logoColor=white)
![Google Ads](https://img.shields.io/badge/Google_Ads_API-v17-4285F4?style=flat-square&logo=googleads&logoColor=white)
![Higgsfield](https://img.shields.io/badge/Higgsfield-API_ready-8B5CF6?style=flat-square)

---

> **This is a working prototype built in ~72 hours for the It's Today Media Build Challenge.**
> It demonstrates what a dedicated Marketing Development Engineer could build and maintain for the team.
> The core fatigue detection, AI copy generation, and Creative Lab are functional.
> Integrations with Meta/Google write APIs, Higgsfield video generation, and the full agent pipeline
> represent the near-term roadmap — all the architecture is already in place.

</div>

---

## The problem

Media buying teams lose **15–20% of ad budget** to creative fatigue every month — and most don't catch it until ROAS is already in freefall.

The signal is in the data. Nobody is watching it continuously.

```
Week 1:  CTR 3.2% │████████████████████████████████░░░  Healthy
Week 2:  CTR 2.7% │███████████████████████████░░░░░░░░  Warning  ← AdPulse flags here
Week 3:  CTR 1.9% │███████████████████░░░░░░░░░░░░░░░░  Critical ← most teams find out here
Week 4:  CTR 1.1% │███████████░░░░░░░░░░░░░░░░░░░░░░░░  Budget burned
```

AdPulse catches it at Week 2 and hands the team new creative before Week 3 hits.

---

## What's built

### 1. Fatigue Detection + Dashboard

Every creative gets a real-time health score (0–100) based on four signals:

```python
FATIGUE_SIGNALS = {
    "frequency":    {"warning": 2.5,  "critical": 3.5},   # impressions per person
    "ctr_decay_7d": {"warning": 0.15, "critical": 0.25},  # CTR drop over 7 days
    "cpm_spike_7d": {"warning": 0.20, "critical": 0.35},  # CPM increase vs baseline
    "roas_drop_7d": {"warning": 0.20, "critical": 0.35},  # ROAS drop over 7 days
}
```

The dashboard shows every active creative sorted by health, with a fatigue alert banner estimating daily wasted spend on critical ads.

### 2. ROI Impact Panel

The top of the dashboard tracks the actual business impact — not just ad metrics:

| Metric | Description |
|--------|-------------|
| Wasted spend avoided | $ saved by detecting fatigue early vs. letting it run |
| CPL: refreshed vs. fatigued | AI variant CPL vs. the fatigued creative CPL |
| Leads from AI variants | How many email/SMS leads came from AI-generated copy |
| Refreshes deployed | Total creative replacements shipped this month |

### 3. AI Copy Generation (`/generate`)

For any fatigued creative, generate 3 replacement copy variants using a local AI model (Ollama + qwen3:14b — zero API cost). Each variant uses a different hook angle: pain point, social proof, curiosity, urgency, or benefit. Includes headline, body, hook angle label, and rationale.

The system strips thinking tags from model output, extracts clean JSON, and returns variants instantly. In production this switches to Claude Sonnet 4.6 for higher quality.

### 4. Alerts (`/alerts`)

Accordion view of all fatigued creatives sorted by severity. Each card shows the fatigue signals that triggered the alert, the performance delta (CTR/ROAS change), and three AI-generated replacement variants with copy-to-clipboard.

### 5. Creative Lab (`/video`) — modular video ad system

The most differentiated feature. Instead of a generic video generator, this is a **creative combination system** for paid social video ads.

**Per-project workspaces** — each campaign has its own independent library of hooks, bodies, and CTAs. Switching workspace changes all cards.

**Two card types:**
- `Pre-recorded` — upload actual video footage, stored per card
- `AI Generated` — add multiple reference images, write a production prompt, generate with Higgsfield/Kling/IStudio/Runway via API

**Visual combination builder:**
- Three columns: Hook (3s) / Body (15s) / CTA (5s)
- Select one from each column — SVG bezier curves connect them visually showing the combination
- Bottom bar shows the assembled sequence with total duration

**Generation + assembly:**
- Each AI Generated card has its own "Generate video" button
- Connect your Higgsfield (or Kling/IStudio/Runway) API key once — applies to all AI cards
- "Assemble combination" mounts the selected clips into one video
- Download the assembled combination or upload directly to Meta

**Create your own cards** — add button at the bottom of each column opens an inline form: label, script, tag, Pre-recorded or AI Generated type.

### 6. Agents (`/agents`)

Five autonomous agents managing the full creative refresh cycle:

```
Ad APIs → Fatigue Monitor (every 6h) → AI Generation (on alert) → Team Review → Auto-Upload → Learning (weekly)
```

| Agent | Status | What it does |
|-------|--------|-------------|
| Fatigue Monitor | Active | Scans all accounts every 6h, raises alerts automatically |
| Creative Replacement Engine | Active | Generates 3 variants per flagged creative on trigger |
| Campaign Learning Engine | Scheduled | Indexes performance data weekly, updates fatigue thresholds |
| Auto-Upload Agent | Beta | Uploads approved variants via Meta/Google write API |
| Weekly Digest Agent | Beta | Monday morning performance report to the team |

Each agent shows real-time logs, stats, next run time, and an on/off toggle.

### 7. Intelligence (`/intelligence`)

What the system learns from running across accounts:

- **Hook angle win rates** — which angles (social proof, curiosity, benefit, urgency, pain point) outperform account-average CTR and by how much
- **Creative decay curve** — average CTR by week since launch, with fatigue threshold marked
- **Learned copy patterns** — statistically significant patterns (numbers in headline, specific timeframes, question openers) with measured lift and confidence scores
- **Key benchmarks** — average creative lifespan, optimal frequency cap, best-performing platform, AI variant acceptance rate

---

## Architecture

```
adpulse/
├── frontend/                       # Next.js 15 + Tailwind CSS + TypeScript
│   ├── app/
│   │   ├── page.tsx                # Dashboard — health overview + ROI panel
│   │   ├── alerts/page.tsx         # Fatigue alerts + AI copy variants
│   │   ├── generate/page.tsx       # Manual AI copy generator
│   │   ├── video/page.tsx          # Creative Lab — video combination system
│   │   ├── agents/page.tsx         # Autonomous agent dashboard
│   │   ├── intelligence/page.tsx   # Campaign learning + pattern library
│   │   ├── campaigns/page.tsx      # Campaign-level performance view
│   │   └── creative/[id]/page.tsx  # Creative deep dive
│   ├── app/api/
│   │   ├── generate/route.ts       # POST → Ollama → 3 copy variants
│   │   └── video-prompt/route.ts   # POST → Ollama → Higgsfield production prompt
│   ├── components/
│   │   ├── Sidebar.tsx             # Navigation with ITM logo + alert badge
│   │   ├── ui/switch.tsx           # shadcn/Radix Switch
│   │   ├── ScoreRing.tsx           # Circular health score indicator
│   │   ├── HealthBadge.tsx         # Status badge component
│   │   └── MetricsChart.tsx        # Recharts performance chart
│   └── lib/
│       ├── mock-data.ts            # Full mock dataset: 5 creatives, signals, history, variants
│       └── utils.ts                # cn() — clsx + tailwind-merge
│
├── backend/                        # Python 3.11 + FastAPI
│   ├── connectors/
│   │   ├── meta.py                 # Meta Marketing API client (read + write)
│   │   └── google_ads.py           # Google Ads API client
│   ├── engine/
│   │   ├── fatigue.py              # Detection logic + signal weights
│   │   └── scoring.py              # Composite health score (0–100)
│   ├── ai/
│   │   └── creative_gen.py         # AI copy generation (Claude / Ollama)
│   └── routers/
│       ├── campaigns.py
│       ├── creatives.py
│       └── alerts.py
│
└── docker-compose.yml
```

---

## Tech stack

| Layer | Technology | Note |
|-------|-----------|------|
| Frontend | Next.js 15 + Tailwind CSS + TypeScript | App Router, async params, API routes |
| UI components | shadcn/ui + Radix UI | Switch, accessible primitives |
| Charts | Recharts | Performance history, hook angle win rates |
| AI (local) | Ollama + qwen3:14b | Zero-cost inference, runs locally during demo |
| AI (production) | Claude Sonnet 4.6 | Higher quality, switch via env var |
| Backend | Python 3.11 + FastAPI + SQLAlchemy | Async, ready to connect |
| Database | PostgreSQL | Time-series creative performance data |
| Video generation | Higgsfield / Kling / IStudio / Runway | API key per workspace, prompt-based |
| Deploy | Vercel (frontend) + Railway (backend) | Zero-config |

---

## Local setup

```bash
git clone https://github.com/jordicabelloo/itstodaymedia-roleproject.git adpulse
cd adpulse/frontend

npm install
npm run dev
```

Open `http://localhost:3000` (or `3001` if 3000 is taken).

The frontend runs fully on mock data — no backend or API keys needed to explore all features.

**To enable AI copy generation locally:**

```bash
# Install Ollama — https://ollama.com
ollama pull qwen3:14b

# The frontend .env.local is already configured:
# OLLAMA_URL=http://localhost:11434
# OLLAMA_MODEL=qwen3:14b
```

Then go to `/generate` or any alert card and generate real variants.

**To use Claude instead of Ollama (production):**

```env
# frontend/.env.local
ANTHROPIC_API_KEY=sk-ant-...
```

And swap the model in `app/api/generate/route.ts`.

---

## What this shows

This prototype was scoped deliberately around the three things It's Today Media is building right now: creative refresh automation, video creative tooling, and AI-powered ops. It's not a polished product — it's a proof of direction.

What it demonstrates:

- **Understanding the business**: the core metric is CPL for email/SMS list building, not abstract ROAS. The ROI panel speaks that language.
- **Agentic thinking**: the Agents page shows a real autonomous pipeline — not just a chat interface.
- **Video system design**: the Creative Lab is a different take on video tooling — modular combination + external generation, not a pixel-burning internal generator.
- **Learning loop**: Intelligence shows how a system gets smarter over time per account, not just per ad.
- **Taste**: it's built to look and feel like a tool the ITM team would actually use every day.

The backend connectors, Meta write API, Higgsfield generation, and full agent scheduling are the next 2–4 weeks of work. The architecture is already shaped for them.

---

## Roadmap

- [x] Fatigue detection engine (4 signals, composite health score)
- [x] AI copy generation — local (Ollama) + cloud (Claude)
- [x] Dashboard with ROI impact panel (CPL, wasted spend, leads)
- [x] Alerts with AI replacement variants + copy-to-clipboard
- [x] Creative detail page with 90-day performance history
- [x] Campaigns view
- [x] Creative Lab — per-project video combination system
- [x] Creative Lab — AI Generated cards with multi-image refs + production prompts
- [x] Creative Lab — SVG connection lines between selected combinations
- [x] Creative Lab — Higgsfield/Kling/IStudio/Runway integration modal
- [x] Agents page — full autonomous pipeline with live logs
- [x] Intelligence page — hook angle win rates, decay curve, copy patterns
- [ ] Meta Ads API write — auto-upload approved variants
- [ ] Higgsfield API — generate video from image + prompt per card
- [ ] Video assembly — stitch selected clips into one downloadable file
- [ ] Full agent scheduler — cron-based background jobs
- [ ] Slack / email alerts for critical fatigue events
- [ ] TikTok Ads connector
- [ ] Multi-account support

---

<div align="center">

Built for the It's Today Media Build Challenge · June 2026

</div>
