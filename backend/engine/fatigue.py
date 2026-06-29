from dataclasses import dataclass
from models import HealthStatus

FATIGUE_SIGNALS = {
    "frequency":    {"warning": 2.5,  "critical": 3.5},
    "ctr_decay_7d": {"warning": 0.15, "critical": 0.25},
    "cpm_spike_7d": {"warning": 0.20, "critical": 0.35},
    "roas_drop_7d": {"warning": 0.20, "critical": 0.35},
}

SIGNAL_WEIGHTS = {
    "frequency":    0.30,
    "ctr_decay_7d": 0.30,
    "cpm_spike_7d": 0.20,
    "roas_drop_7d": 0.20,
}


@dataclass
class FatigueSignal:
    name: str
    value: float
    threshold_warning: float
    threshold_critical: float
    severity: HealthStatus
    weight: float


def analyze_fatigue(metrics_7d: list[dict], metrics_14d: list[dict]) -> tuple[float, list[FatigueSignal]]:
    """
    Returns (health_score 0-100, list of triggered signals).
    metrics_7d and metrics_14d are lists of daily metric dicts.
    """
    if not metrics_7d:
        return 100.0, []

    signals: list[FatigueSignal] = []
    penalty = 0.0

    avg_frequency = _avg(metrics_7d, "frequency")
    avg_ctr_7d = _avg(metrics_7d, "ctr")
    avg_ctr_prior = _avg(metrics_14d[:7], "ctr") if len(metrics_14d) >= 7 else avg_ctr_7d
    avg_cpm_7d = _avg(metrics_7d, "cpm")
    avg_cpm_prior = _avg(metrics_14d[:7], "cpm") if len(metrics_14d) >= 7 else avg_cpm_7d
    avg_roas_7d = _avg(metrics_7d, "roas")
    avg_roas_prior = _avg(metrics_14d[:7], "roas") if len(metrics_14d) >= 7 else avg_roas_7d

    ctr_decay = (avg_ctr_prior - avg_ctr_7d) / avg_ctr_prior if avg_ctr_prior > 0 else 0
    cpm_spike = (avg_cpm_7d - avg_cpm_prior) / avg_cpm_prior if avg_cpm_prior > 0 else 0
    roas_drop = (avg_roas_prior - avg_roas_7d) / avg_roas_prior if avg_roas_prior > 0 else 0

    checks = [
        ("frequency",    avg_frequency, avg_frequency),
        ("ctr_decay_7d", ctr_decay,     ctr_decay),
        ("cpm_spike_7d", cpm_spike,     cpm_spike),
        ("roas_drop_7d", roas_drop,     roas_drop),
    ]

    for name, raw_value, check_value in checks:
        thresholds = FATIGUE_SIGNALS[name]
        weight = SIGNAL_WEIGHTS[name]

        if check_value >= thresholds["critical"]:
            severity = HealthStatus.CRITICAL
            penalty += weight * 60
        elif check_value >= thresholds["warning"]:
            severity = HealthStatus.WARNING
            penalty += weight * 30
        else:
            continue

        signals.append(FatigueSignal(
            name=name,
            value=raw_value,
            threshold_warning=thresholds["warning"],
            threshold_critical=thresholds["critical"],
            severity=severity,
            weight=weight,
        ))

    health_score = max(0.0, 100.0 - penalty)
    return round(health_score, 1), signals


def classify(health_score: float) -> HealthStatus:
    if health_score >= 70:
        return HealthStatus.HEALTHY
    if health_score >= 40:
        return HealthStatus.WARNING
    return HealthStatus.CRITICAL


def _avg(metrics: list[dict], key: str) -> float:
    values = [m[key] for m in metrics if m.get(key) is not None]
    return sum(values) / len(values) if values else 0.0
