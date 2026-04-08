from __future__ import annotations

import calendar
import json
from collections import defaultdict
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).parent / "datasheets"

POLLUTANT_LIMITS: dict[str, float] = {
    "no2_conc": 9.5,
    "so2_conc": 10.0,
    "o3_conc": 50.0,
    "co_conc": 4.0,
    "no_conc": 1.5,
}

POLLUTANTS = tuple(POLLUTANT_LIMITS.keys())


def _aqi_label(score: float | None) -> str:
    if score is None:
        return "No data"
    if score <= 50:
        return "Good"
    if score <= 100:
        return "Moderate"
    if score <= 150:
        return "Unhealthy for Sensitive Groups"
    if score <= 200:
        return "Unhealthy"
    if score <= 300:
        return "Very Unhealthy"
    return "Hazardous"


def _safe_float(value: Any) -> float | None:
    if value in (None, ""):
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _normalize_pollutant_value(pollutant: str, raw_value: Any) -> float | None:
    value = _safe_float(raw_value)
    if value is None:
        return None

    # Source data has CO in ug/m3, convert to mg/m3 to match WHO limit.
    if pollutant == "co_conc":
        return value / 1000.0

    return value


def _calculate_pollutant_indices(
    averages: dict[str, float | None]
) -> tuple[dict[str, float | None], float | None, str | None]:
    pollutant_indices: dict[str, float | None] = {}
    dominant_pollutant: str | None = None
    max_index: float | None = None

    for pollutant in POLLUTANTS:
        value = averages.get(pollutant)
        limit = POLLUTANT_LIMITS[pollutant]

        if value is None:
            pollutant_indices[pollutant] = None
            continue

        pollutant_index = round((value / limit) * 100, 2)
        pollutant_indices[pollutant] = pollutant_index

        if max_index is None or pollutant_index > max_index:
            max_index = pollutant_index
            dominant_pollutant = pollutant

    return pollutant_indices, max_index, dominant_pollutant

@lru_cache(maxsize=1)
def _build_aggregates() -> dict[str, Any]:
    areas: set[str] = set()

    monthly_stats: dict[str, dict[tuple[int, int], dict[str, Any]]] = defaultdict(dict)

    if not DATA_DIR.exists():
        return {"areas": [], "monthly_stats": {}}

    year_dirs = sorted(
        [d for d in DATA_DIR.iterdir() if d.is_dir() and d.name.isdigit()],
        key=lambda p: int(p.name),
    )

    for year_dir in year_dirs:
        for area_dir in sorted([d for d in year_dir.iterdir() if d.is_dir()], key=lambda p: p.name.lower()):
            area = area_dir.name
            area_key = area.lower()
            areas.add(area)

            for json_file in sorted(area_dir.glob("*.json")):
                try:
                    records = json.loads(json_file.read_text(encoding="utf-8"))
                except (json.JSONDecodeError, OSError):
                    continue

                if not isinstance(records, list):
                    continue

                for record in records:
                    if not isinstance(record, dict):
                        continue

                    raw_time = record.get("time")
                    if not isinstance(raw_time, str):
                        continue

                    try:
                        dt = datetime.strptime(raw_time, "%Y-%m-%d %H:%M:%S")
                    except ValueError:
                        continue

                    month_key = (dt.year, dt.month)
                    bucket = monthly_stats[area_key].setdefault(
                        month_key,
                        {
                            "totals": defaultdict(float),
                            "counts": defaultdict(int),
                            "total_checks": 0,
                            "compliant_checks": 0,
                            "records_count": 0,
                        },
                    )

                    bucket["records_count"] += 1

                    for pollutant in POLLUTANTS:
                        value = _normalize_pollutant_value(pollutant, record.get(pollutant))
                        if value is None:
                            continue

                        bucket["totals"][pollutant] += value
                        bucket["counts"][pollutant] += 1
                        bucket["total_checks"] += 1

                        if value <= POLLUTANT_LIMITS[pollutant]:
                            bucket["compliant_checks"] += 1

    return {
        "areas": sorted(areas, key=str.lower),
        "monthly_stats": monthly_stats,
    }


def _ensure_area_exists(area: str) -> str:
    payload = _build_aggregates()
    match = next((a for a in payload["areas"] if a.lower() == area.lower()), "")
    if not match:
        raise ValueError(f"Area '{area}' not found")
    return match


def _month_payload(area: str, year: int, month: int, stats: dict[str, Any]) -> dict[str, Any]:
    averages: dict[str, float | None] = {}

    for pollutant in POLLUTANTS:
        count = stats["counts"].get(pollutant, 0)
        if count:
            averages[pollutant] = round(stats["totals"][pollutant] / count, 4)
        else:
            averages[pollutant] = None

    total_checks = stats["total_checks"]
    compliant_checks = stats["compliant_checks"]
    pollutant_indices, aqi_score, dominant_pollutant = _calculate_pollutant_indices(averages)

    return {
        "area": area,
        "year": year,
        "month": month,
        "month_name": calendar.month_name[month],
        "month_key": f"{year}-{month:02d}",
        "limits": POLLUTANT_LIMITS,
        "averages": averages,
        "compliant_count": f"{compliant_checks}/{total_checks}",
        "pollutant_indices": pollutant_indices,
        "dominant_pollutant": dominant_pollutant,
        "aqi_score": aqi_score,
        "aqi_label": _aqi_label(aqi_score),
        "records_count": stats["records_count"],
    }


def list_areas() -> list[str]:
    return _build_aggregates()["areas"]


def list_available_months(area: str) -> list[tuple[int, int]]:
    canonical_area = _ensure_area_exists(area)
    area_key = canonical_area.lower()
    month_keys = list(_build_aggregates()["monthly_stats"].get(area_key, {}).keys())
    return sorted(month_keys)


def get_month_concentrations(area: str, year: int, month: int) -> dict[str, Any]:
    canonical_area = _ensure_area_exists(area)
    area_key = canonical_area.lower()

    monthly = _build_aggregates()["monthly_stats"].get(area_key, {})
    target_key = (year, month)

    if target_key not in monthly:
        return {
            "error": f"No data for {canonical_area} at {year}-{month:02d}",
        }

    ordered_months = sorted(monthly.keys())
    idx = ordered_months.index(target_key)
    prev_key = ordered_months[idx - 1] if idx > 0 else None
    next_key = ordered_months[idx + 1] if idx < len(ordered_months) - 1 else None

    base = _month_payload(canonical_area, year, month, monthly[target_key])
    base["navigation"] = {
        "previous": f"{prev_key[0]}-{prev_key[1]:02d}" if prev_key else None,
        "next": f"{next_key[0]}-{next_key[1]:02d}" if next_key else None,
    }

    return base


def get_latest_month_concentrations(area: str) -> dict[str, Any]:
    months = list_available_months(area)
    if not months:
        return {"error": f"No data for area '{area}'"}

    latest_year, latest_month = months[-1]
    return get_month_concentrations(area, latest_year, latest_month)


def get_monthly_air_quality_index(area: str) -> dict[str, Any]:
    canonical_area = _ensure_area_exists(area)
    area_key = canonical_area.lower()

    monthly = _build_aggregates()["monthly_stats"].get(area_key, {})
    by_year: dict[int, list[dict[str, Any]]] = defaultdict(list)

    for (year, month), stats in sorted(monthly.items()):
        month_data = _month_payload(canonical_area, year, month, stats)
        by_year[year].append(
            {
                "month": month,
                "month_name": month_data["month_name"],
                "month_key": month_data["month_key"],
                "aqi_score": month_data["aqi_score"],
                "aqi_label": month_data["aqi_label"],
                "compliant_count": month_data["compliant_count"],
            }
        )

    return {
        "area": canonical_area,
        "monthly_index": {str(year): rows for year, rows in sorted(by_year.items())},
    }


def get_yearly_air_quality_index(area: str) -> dict[str, Any]:
    canonical_area = _ensure_area_exists(area)
    area_key = canonical_area.lower()

    monthly = _build_aggregates()["monthly_stats"].get(area_key, {})

    year_totals: dict[int, dict[str, Any]] = defaultdict(
        lambda: {
            "checks": 0,
            "compliant": 0,
            "pollutant_totals": defaultdict(float),
            "pollutant_counts": defaultdict(int),
        }
    )

    for (year, _month), stats in monthly.items():
        year_totals[year]["checks"] += stats["total_checks"]
        year_totals[year]["compliant"] += stats["compliant_checks"]
        for pollutant in POLLUTANTS:
            count = stats["counts"].get(pollutant, 0)
            if not count:
                continue
            year_totals[year]["pollutant_totals"][pollutant] += stats["totals"][pollutant]
            year_totals[year]["pollutant_counts"][pollutant] += count

    rows = []
    for year in sorted(year_totals.keys()):
        checks = year_totals[year]["checks"]
        compliant = year_totals[year]["compliant"]
        yearly_averages: dict[str, float | None] = {}
        for pollutant in POLLUTANTS:
            count = year_totals[year]["pollutant_counts"].get(pollutant, 0)
            if count:
                yearly_averages[pollutant] = round(
                    year_totals[year]["pollutant_totals"][pollutant] / count, 4
                )
            else:
                yearly_averages[pollutant] = None

        pollutant_indices, aqi_score, dominant_pollutant = _calculate_pollutant_indices(yearly_averages)
        rows.append(
            {
                "year": year,
                "aqi_score": aqi_score,
                "aqi_label": _aqi_label(aqi_score),
                "compliant_count": f"{compliant}/{checks}",
                "pollutant_indices": pollutant_indices,
                "dominant_pollutant": dominant_pollutant,
            }
        )

    return {
        "area": canonical_area,
        "yearly_index": rows,
    }
