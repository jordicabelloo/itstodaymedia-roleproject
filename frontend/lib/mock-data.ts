export type HealthStatus = "healthy" | "warning" | "critical";

export interface Creative {
  id: string;
  name: string;
  platform: "meta" | "google";
  campaign: string;
  headline: string;
  body: string;
  health_score: number;
  health_status: HealthStatus;
  spend_7d: number;
  roas_7d: number;
  ctr_7d: number;
  frequency: number;
  signals: Signal[];
  history: DailyMetric[];
  variants?: Variant[];
}

export interface Signal {
  name: string;
  value: number;
  threshold_warning: number;
  threshold_critical: number;
  severity: HealthStatus;
}

export interface DailyMetric {
  date: string;
  ctr: number;
  cpm: number;
  roas: number;
  frequency: number;
  spend: number;
}

export interface Variant {
  headline: string;
  body: string;
  hook_angle: string;
  rationale: string;
}

export const CREATIVES: Creative[] = [
  {
    id: "ad_001",
    name: "Summer Sale — Pain Point v1",
    platform: "meta",
    campaign: "BOFU — Retargeting 30d",
    headline: "Still paying too much for X?",
    body: "Join 12,000+ customers who cut their costs in half. Limited spots available this week.",
    health_score: 14,
    health_status: "critical",
    spend_7d: 4820,
    roas_7d: 1.2,
    ctr_7d: 0.008,
    frequency: 4.1,
    signals: [
      { name: "frequency", value: 4.1, threshold_warning: 2.5, threshold_critical: 3.5, severity: "critical" },
      { name: "roas_drop_7d", value: 0.41, threshold_warning: 0.20, threshold_critical: 0.35, severity: "critical" },
      { name: "ctr_decay_7d", value: 0.32, threshold_warning: 0.15, threshold_critical: 0.25, severity: "critical" },
    ],
    history: [
      { date: "Jun 16", ctr: 0.031, cpm: 12.4, roas: 3.8, frequency: 1.2, spend: 580 },
      { date: "Jun 17", ctr: 0.028, cpm: 13.1, roas: 3.5, frequency: 1.5, spend: 610 },
      { date: "Jun 18", ctr: 0.025, cpm: 14.2, roas: 3.1, frequency: 1.9, spend: 640 },
      { date: "Jun 19", ctr: 0.021, cpm: 15.8, roas: 2.6, frequency: 2.4, spend: 700 },
      { date: "Jun 20", ctr: 0.016, cpm: 17.3, roas: 2.0, frequency: 3.0, spend: 740 },
      { date: "Jun 21", ctr: 0.011, cpm: 19.1, roas: 1.5, frequency: 3.6, spend: 780 },
      { date: "Jun 22", ctr: 0.008, cpm: 21.4, roas: 1.2, frequency: 4.1, spend: 820 },
    ],
    variants: [
      {
        headline: "12,000 people already made the switch. You haven't?",
        body: "See why customers are ditching their old solution. No contracts, cancel anytime.",
        hook_angle: "social_proof",
        rationale: "Shifts focus to the crowd momentum — breaks the familiarity loop that's causing frequency fatigue.",
      },
      {
        headline: "Your competitor just cut their costs by 47%",
        body: "Here's exactly what they changed — and how you can do it before they scale.",
        hook_angle: "curiosity",
        rationale: "Competitive framing creates urgency without price pressure. Fresh angle for a saturated audience.",
      },
      {
        headline: "This offer disappears July 4th",
        body: "We can only onboard 50 accounts this month. 31 spots left. Get locked in at today's rate.",
        hook_angle: "urgency",
        rationale: "Hard deadline + scarcity re-engages a fatigued audience that has been passively ignoring the ad.",
      },
    ],
  },
  {
    id: "ad_002",
    name: "Benefit Lead — v3",
    platform: "meta",
    campaign: "TOFU — Broad Interest",
    headline: "Get results in 14 days or we refund you",
    body: "No risk. No contracts. Just results. See what 5,000 businesses did differently.",
    health_score: 48,
    health_status: "warning",
    spend_7d: 2310,
    roas_7d: 2.9,
    ctr_7d: 0.021,
    frequency: 2.7,
    signals: [
      { name: "frequency", value: 2.7, threshold_warning: 2.5, threshold_critical: 3.5, severity: "warning" },
      { name: "ctr_decay_7d", value: 0.18, threshold_warning: 0.15, threshold_critical: 0.25, severity: "warning" },
    ],
    history: [
      { date: "Jun 16", ctr: 0.029, cpm: 10.1, roas: 3.8, frequency: 1.1, spend: 290 },
      { date: "Jun 17", ctr: 0.028, cpm: 10.4, roas: 3.6, frequency: 1.3, spend: 310 },
      { date: "Jun 18", ctr: 0.027, cpm: 10.8, roas: 3.4, frequency: 1.6, spend: 320 },
      { date: "Jun 19", ctr: 0.025, cpm: 11.2, roas: 3.2, frequency: 1.9, spend: 330 },
      { date: "Jun 20", ctr: 0.024, cpm: 11.9, roas: 3.1, frequency: 2.2, spend: 340 },
      { date: "Jun 21", ctr: 0.022, cpm: 12.5, roas: 3.0, frequency: 2.5, spend: 350 },
      { date: "Jun 22", ctr: 0.021, cpm: 13.1, roas: 2.9, frequency: 2.7, spend: 370 },
    ],
  },
  {
    id: "ad_003",
    name: "Google Search — Brand Intent",
    platform: "google",
    campaign: "Search — Branded KW",
    headline: "Official Site — Get Started Free",
    body: "Trusted by 12,000+ businesses. Start your free trial today. No credit card required.",
    health_score: 88,
    health_status: "healthy",
    spend_7d: 1150,
    roas_7d: 5.4,
    ctr_7d: 0.047,
    frequency: 1.1,
    signals: [],
    history: [
      { date: "Jun 16", ctr: 0.044, cpm: 8.2, roas: 5.1, frequency: 1.0, spend: 155 },
      { date: "Jun 17", ctr: 0.046, cpm: 8.0, roas: 5.3, frequency: 1.0, spend: 160 },
      { date: "Jun 18", ctr: 0.045, cpm: 8.1, roas: 5.2, frequency: 1.1, spend: 162 },
      { date: "Jun 19", ctr: 0.048, cpm: 7.9, roas: 5.5, frequency: 1.1, spend: 158 },
      { date: "Jun 20", ctr: 0.047, cpm: 8.3, roas: 5.4, frequency: 1.1, spend: 165 },
      { date: "Jun 21", ctr: 0.049, cpm: 7.8, roas: 5.6, frequency: 1.0, spend: 168 },
      { date: "Jun 22", ctr: 0.047, cpm: 8.0, roas: 5.4, frequency: 1.1, spend: 182 },
    ],
  },
  {
    id: "ad_004",
    name: "TOFU — Curiosity Hook v2",
    platform: "meta",
    campaign: "TOFU — Lookalike 2%",
    headline: "Most businesses do this backwards",
    body: "We analyzed 10,000 ad accounts. Here's the single thing separating profitable from unprofitable.",
    health_score: 76,
    health_status: "healthy",
    spend_7d: 3200,
    roas_7d: 3.8,
    ctr_7d: 0.038,
    frequency: 1.8,
    signals: [],
    history: [
      { date: "Jun 16", ctr: 0.035, cpm: 11.2, roas: 3.5, frequency: 1.2, spend: 420 },
      { date: "Jun 17", ctr: 0.037, cpm: 11.0, roas: 3.6, frequency: 1.4, spend: 440 },
      { date: "Jun 18", ctr: 0.039, cpm: 10.8, roas: 3.7, frequency: 1.5, spend: 450 },
      { date: "Jun 19", ctr: 0.040, cpm: 10.5, roas: 3.9, frequency: 1.6, spend: 460 },
      { date: "Jun 20", ctr: 0.038, cpm: 10.9, roas: 3.8, frequency: 1.7, spend: 470 },
      { date: "Jun 21", ctr: 0.039, cpm: 11.1, roas: 3.8, frequency: 1.7, spend: 480 },
      { date: "Jun 22", ctr: 0.038, cpm: 11.3, roas: 3.8, frequency: 1.8, spend: 480 },
    ],
  },
  {
    id: "ad_005",
    name: "Google Display — Retarget",
    platform: "google",
    campaign: "Display — Site Visitors 7d",
    headline: "Still thinking about it?",
    body: "Your free trial expires soon. Don't miss out — thousands of businesses already started.",
    health_score: 31,
    health_status: "critical",
    spend_7d: 890,
    roas_7d: 1.4,
    ctr_7d: 0.006,
    frequency: 3.8,
    signals: [
      { name: "frequency", value: 3.8, threshold_warning: 2.5, threshold_critical: 3.5, severity: "critical" },
      { name: "ctr_decay_7d", value: 0.29, threshold_warning: 0.15, threshold_critical: 0.25, severity: "critical" },
      { name: "cpm_spike_7d", value: 0.38, threshold_warning: 0.20, threshold_critical: 0.35, severity: "critical" },
    ],
    history: [
      { date: "Jun 16", ctr: 0.018, cpm: 6.1, roas: 2.8, frequency: 1.3, spend: 110 },
      { date: "Jun 17", ctr: 0.015, cpm: 6.8, roas: 2.4, frequency: 1.8, spend: 118 },
      { date: "Jun 18", ctr: 0.013, cpm: 7.5, roas: 2.1, frequency: 2.3, spend: 125 },
      { date: "Jun 19", ctr: 0.011, cpm: 7.9, roas: 1.9, frequency: 2.8, spend: 130 },
      { date: "Jun 20", ctr: 0.009, cpm: 8.3, roas: 1.7, frequency: 3.2, spend: 135 },
      { date: "Jun 21", ctr: 0.007, cpm: 8.1, roas: 1.5, frequency: 3.5, spend: 138 },
      { date: "Jun 22", ctr: 0.006, cpm: 8.4, roas: 1.4, frequency: 3.8, spend: 134 },
    ],
  },
];

export const ACCOUNT_STATS = {
  total_spend_7d: 12370,
  avg_roas: 3.14,
  critical_count: 2,
  warning_count: 1,
  healthy_count: 2,
  accounts_connected: 2,
};
