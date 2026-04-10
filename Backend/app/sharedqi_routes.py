from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.airquality.services import get_month_concentrations, list_areas, list_available_months
from app.sharedqi import build_eqi, normalize_air_quality, normalize_water_score
from app.waterdata.services import get_available_months, get_year_monthly_wqi

router = APIRouter(prefix="/sharedqi", tags=["Shared QI"])


WATER_AREA_BY_AIR_AREA: dict[str, str] = {
    "Ampelokipoi": "ampelokipoi",
    "Kalamaria": "kalamaria",
    "Oraiokastro": "oraiokastro",
    "Pulaia": "pylaia",
    "Thessaloniki": "kentro_polis",
    "Kordelio": "euosmos",
    "Pavlou_Mela": "xirokrini",
    "Neapoli": "triandria",
}

AREA_ALIASES: dict[str, list[str]] = {
    "Ampelokipoi": ["Ampelokipoi Municipality"],
    "Kalamaria": ["Kalamaria Municipality"],
    "Oraiokastro": ["Oreokastro Municipality", "Oraiokastro Municipality"],
    "Pulaia": ["Pylaia Municipality", "Pulaia Municipality"],
    "Thessaloniki": ["Thessaloniki Municipality"],
    "Kordelio": ["Kordelio Municipality", "Evosmos Municipality", "Kordelio-Evosmos Municipality"],
    "Pavlou_Mela": ["Pavlou Mela Municipality"],
    "Neapoli": ["Neapoli Municipality", "Neapolis-Sykeon Municipality"],
}


def _latest_value(values: list[str]) -> str | None:
    if not values:
        return None
    return sorted(values)[-1]


def _available_water_months(area_name: str) -> list[str]:
    months_payload = get_available_months(area_name)
    if not isinstance(months_payload, dict):
        return []
    months = months_payload.get("available_months") or []
    if not months:
        return []

    out: set[str] = set()
    for month_ts in months:
        text = str(month_ts)
        if len(text) >= 7 and text[:4].isdigit() and text[5:7].isdigit():
            out.add(text[:7])

    return sorted(out)


def _water_score(area_name: str, month_key: str | None) -> tuple[float | None, str | None]:
    if month_key is None:
        return None, None

    year = month_key[:4]
    payload = get_year_monthly_wqi(area_name, year)
    if not isinstance(payload, list):
        return None, None

    selected = next(
        (
            row
            for row in payload
            if isinstance(row, dict) and str(row.get("month_ts", "")).startswith(month_key)
        ),
        None,
    )
    if not isinstance(selected, dict):
        return None, None

    monthly_wqi = selected.get("wqi")
    if not isinstance(monthly_wqi, dict):
        return None, None

    score = monthly_wqi.get("score")
    rating = monthly_wqi.get("rating")
    try:
        parsed = float(score) if score is not None else None
    except (TypeError, ValueError):
        parsed = None
    return parsed, rating if isinstance(rating, str) else None


def _available_air_months(area_name: str) -> list[str]:
    out: list[str] = []
    try:
        months = list_available_months(area_name)
    except ValueError:
        return out

    for year, month in months:
        out.append(f"{year}-{month:02d}")
    return sorted(out)


def _air_score(area_name: str, month_key: str | None) -> tuple[float | None, str | None]:
    if month_key is None:
        return None, None

    parts = month_key.split("-")
    if len(parts) != 2:
        return None, None
    try:
        year = int(parts[0])
        month = int(parts[1])
    except ValueError:
        return None, None

    payload = get_month_concentrations(area_name, year, month)
    if not isinstance(payload, dict) or "error" in payload:
        return None, None

    raw = payload.get("aqi_score")
    label = payload.get("aqi_label")
    try:
        parsed = float(raw) if raw is not None else None
    except (TypeError, ValueError):
        parsed = None
    return parsed, label if isinstance(label, str) else None


@router.get("/areas")
def shared_qi_areas() -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for air_area in list_areas():
        water_area = WATER_AREA_BY_AIR_AREA.get(air_area)

        air_months = _available_air_months(air_area)
        water_months = _available_water_months(water_area) if water_area else []

        common_months = sorted(set(air_months).intersection(set(water_months)))
        common_month = _latest_value(common_months)

        selected_air_month = common_month if common_month is not None else _latest_value(air_months)
        selected_water_month = common_month if common_month is not None else _latest_value(water_months)

        air_raw, air_label = _air_score(air_area, selected_air_month)
        water_raw, water_rating = (None, None)
        if water_area:
            water_raw, water_rating = _water_score(water_area, selected_water_month)

        eqi_payload: dict[str, Any] = {
            "eqi_raw": None,
            "eqi_display": None,
            "band": "No data",
        }
        dominant_factor: str | None = None

        if air_raw is not None and water_raw is not None:
            eqi = build_eqi(air_raw, water_raw)
            eqi_payload = {
                "eqi_raw": eqi.eqi_raw,
                "eqi_display": eqi.eqi_display,
                "band": eqi.band,
            }
            dominant_factor = "air" if eqi.air_norm >= eqi.water_norm else "water"
        elif air_raw is not None:
            dominant_factor = "air"
        elif water_raw is not None:
            dominant_factor = "water"

        records.append(
            {
                "area": air_area,
                "aliases": AREA_ALIASES.get(air_area, []),
                "metrics": {
                    "air": {
                        "aqi_raw": round(air_raw, 2) if air_raw is not None else None,
                        "air_norm": round(normalize_air_quality(air_raw), 2) if air_raw is not None else None,
                        "aqi_label": air_label,
                    },
                    "water": {
                        "wqi_raw": round(water_raw, 2) if water_raw is not None else None,
                        "water_norm": round(normalize_water_score(water_raw), 2) if water_raw is not None else None,
                        "wqi_rating": water_rating,
                    },
                    "eqi": eqi_payload,
                },
                "dominant_factor": dominant_factor,
                "sources": {
                    "air_area": air_area,
                    "water_area": water_area,
                    "air_month": selected_air_month,
                    "water_month": selected_water_month,
                    "common_month": common_month,
                },
            }
        )

    return {"areas": records, "total": len(records)}
