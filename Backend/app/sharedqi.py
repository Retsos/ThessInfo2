from __future__ import annotations

from dataclasses import dataclass


def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(value, max_value))


# ─── Piecewise normalization breakpoints ──────────────────────────────────────
#
# Both AQI and WQI are mapped to a common 0-100 normalised scale where
# *equivalent quality bands align to the same ranges*.
#
# AQI bands → normalised:
#   0-50   Good                        →  0-20
#  51-100  Moderate                    → 20-40
# 101-150  Unhealthy for Sensitive Gr. → 40-60
# 151-200  Unhealthy                   → 60-80
# 201-300  Very Unhealthy              → 80-90
# 301-500  Hazardous                   → 90-100
#
# WQI bands → normalised:
#   0-25   Excellent  →  0-20
#  26-50   Good       → 20-40
#  51-75   Poor       → 40-60
#  76-100  Very Poor  → 60-80
# 101-200  Unsuitable → 80-100

_AQI_BP: list[tuple[float, float, float, float]] = [
    (0.0,   50.0,   0.0,  20.0),
    (50.0,  100.0, 20.0,  40.0),
    (100.0, 150.0, 40.0,  60.0),
    (150.0, 200.0, 60.0,  80.0),
    (200.0, 300.0, 80.0,  90.0),
    (300.0, 500.0, 90.0, 100.0),
]

_WQI_BP: list[tuple[float, float, float, float]] = [
    (0.0,   25.0,   0.0,  20.0),
    (25.0,  50.0,  20.0,  40.0),
    (50.0,  75.0,  40.0,  60.0),
    (75.0, 100.0,  60.0,  80.0),
    (100.0, 200.0, 80.0, 100.0),
]

# If either normalised factor exceeds this, it "drags down" the whole EQI
# so a single critical metric can't be masked by a healthy one.
CRITICAL_NORM_THRESHOLD = 60.0  # ≈ "Unhealthy" / "Very Poor"


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _piecewise(value: float, breakpoints: list[tuple[float, float, float, float]]) -> float:
    """Map *value* through piecewise-linear breakpoints [(in_lo, in_hi, out_lo, out_hi), ...]."""
    for in_lo, in_hi, out_lo, out_hi in breakpoints:
        if value <= in_hi:
            span = in_hi - in_lo
            ratio = (value - in_lo) / span if span > 0 else 0.0
            return out_lo + ratio * (out_hi - out_lo)
    return breakpoints[-1][3]


def _aqi_severity(aqi: float) -> int:
    """Severity level 0-5 based on standard AQI bands."""
    if aqi <= 50:  return 0   # Good
    if aqi <= 100: return 1   # Moderate
    if aqi <= 150: return 2   # Unhealthy for Sensitive Groups
    if aqi <= 200: return 3   # Unhealthy
    if aqi <= 300: return 4   # Very Unhealthy
    return 5                  # Hazardous


def _wqi_severity(wqi: float) -> int:
    """Severity level 0-4 based on WQI bands."""
    if wqi <= 25:  return 0   # Excellent
    if wqi <= 50:  return 1   # Good
    if wqi <= 75:  return 2   # Poor
    if wqi <= 100: return 3   # Very Poor
    return 4                  # Unsuitable


# ─── Public API ───────────────────────────────────────────────────────────────

def normalize_air_quality(aqi: float) -> float:
    """
    Piecewise AQI normalisation (0-500 → 0-100).

    Band-aligned so that equivalent quality levels map to the same ranges
    as the WQI normalisation.  0 = perfect, 100 = worst.
    """
    return _piecewise(clamp(aqi, 0.0, 500.0), _AQI_BP)


def normalize_water_score(water_value: float) -> float:
    """
    Piecewise WQI normalisation (0-200 → 0-100).

    Band-aligned so that equivalent quality levels map to the same ranges
    as the AQI normalisation.  0 = perfect, 100 = worst.
    """
    return _piecewise(clamp(water_value, 0.0, 200.0), _WQI_BP)


def compute_eqi_raw(air_norm: float, water_norm: float) -> float:
    """
    Composite EQI score (0-100, higher = worse).

    Normal mode:    0.7 × air_norm + 0.3 × water_norm
    Critical mode:  if either factor exceeds CRITICAL_NORM_THRESHOLD,
                    the EQI is at least 85 % of the worst factor so that
                    a single critical metric can't be masked by a healthy one.
    """
    weighted = (0.7 * air_norm) + (0.3 * water_norm)
    worst = max(air_norm, water_norm)

    if worst >= CRITICAL_NORM_THRESHOLD:
        return max(weighted, worst * 0.85)

    return weighted


def compute_eqi_display(air_norm: float, water_norm: float) -> float:
    """
    Final public EQI scale:
    100 = perfect, 0 = worst.
    """
    raw_eqi = compute_eqi_raw(air_norm, water_norm)
    return clamp(100.0 - raw_eqi, 0.0, 100.0)


def classify_eqi(eqi_display: float) -> str:
    if eqi_display >= 90:
        return "Excellent"
    if eqi_display >= 75:
        return "Good"
    if eqi_display >= 50:
        return "Moderate"
    return "Poor"


def determine_dominant_factor(aqi: float, water_value: float) -> str:
    """
    Determine which factor contributes more to environmental degradation
    by comparing **severity bands** rather than raw normalised values.

    This prevents the old bug where AQI = 140 (Unhealthy) would look
    "better" than WQI = 40 (Good) just because 140/500 < 40/100.
    """
    air_sev = _aqi_severity(aqi)
    water_sev = _wqi_severity(water_value)

    if air_sev > water_sev:
        return "air"
    if water_sev > air_sev:
        return "water"

    # Tied severity → fallback to weighted contribution
    air_norm = normalize_air_quality(aqi)
    water_norm = normalize_water_score(water_value)
    return "air" if (0.7 * air_norm) >= (0.3 * water_norm) else "water"


@dataclass(frozen=True)
class EQIResult:
    air_norm: float
    water_norm: float
    eqi_raw: float
    eqi_display: float
    band: str
    dominant_factor: str


def build_eqi(aqi: float, water_value: float) -> EQIResult:
    """
    Full EQI pipeline with:
      1. Piecewise band-aligned normalisation (fixes scale imbalance)
      2. Severity-based dominant factor      (fixes misleading comparison)
      3. Critical override                    (prevents masking)
    """
    air_norm = normalize_air_quality(aqi)
    water_norm = normalize_water_score(water_value)
    eqi_raw = compute_eqi_raw(air_norm, water_norm)
    eqi_display = compute_eqi_display(air_norm, water_norm)
    band = classify_eqi(eqi_display)
    dominant = determine_dominant_factor(aqi, water_value)

    return EQIResult(
        air_norm=round(air_norm, 2),
        water_norm=round(water_norm, 2),
        eqi_raw=round(eqi_raw, 2),
        eqi_display=round(eqi_display, 2),
        band=band,
        dominant_factor=dominant,
    )
