from __future__ import annotations

from dataclasses import dataclass


def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(value, max_value))


def normalize_air_quality(aqi: float) -> float:
    """
    AQI normalization (0-500 -> 0-100).
    0 = perfect, 100 = bad.
    """
    return (clamp(aqi, 0.0, 500.0) / 500.0) * 100.0


def normalize_water_score(water_value: float) -> float:
    """
    Water normalization (0-100 -> 0-100).
    0 = perfect, 100 = bad.
    """
    return clamp(water_value, 0.0, 100.0)


def compute_eqi_raw(air_quality: float, water_score: float) -> float:
    """
    Composite score before inversion.
    """
    return (0.7 * air_quality) + (0.3 * water_score)


def compute_eqi_display(air_quality: float, water_score: float) -> float:
    """
    Final public EQI scale:
    100 = perfect, 0 = bad.
    """
    raw_eqi = compute_eqi_raw(air_quality, water_score)
    return clamp(100.0 - raw_eqi, 0.0, 100.0)


def classify_eqi(eqi_display: float) -> str:
    if eqi_display >= 90:
        return "Excellent"
    if eqi_display >= 75:
        return "Good"
    if eqi_display >= 50:
        return "Moderate"
    return "Poor"


@dataclass(frozen=True)
class EQIResult:
    air_norm: float
    water_norm: float
    eqi_raw: float
    eqi_display: float
    band: str


def build_eqi(aqi: float, water_value: float) -> EQIResult:
    """
    Full pipeline:
    Air_norm = min(AQI, 500) / 500 * 100
    Water_norm = min(Water, 100)
    EQI_raw = 0.7 * Air_norm + 0.3 * Water_norm
    EQI_display = 100 - EQI_raw
    """
    air_norm = normalize_air_quality(aqi)
    water_norm = normalize_water_score(water_value)
    eqi_raw = compute_eqi_raw(air_norm, water_norm)
    eqi_display = compute_eqi_display(air_norm, water_norm)
    band = classify_eqi(eqi_display)

    return EQIResult(
        air_norm=round(air_norm, 2),
        water_norm=round(water_norm, 2),
        eqi_raw=round(eqi_raw, 2),
        eqi_display=round(eqi_display, 2),
        band=band,
    )
