"""Recycling data service layer.

Loads recycle.json once (cached), builds structured lookups, and exposes
methods for each API endpoint: areas, monthly, compare, efficiency, summary.
"""

from __future__ import annotations

import json
from collections import defaultdict
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.recycle.parser import MONTH_NAMES, parse_month_key, parse_number

DATA_FILE = Path(__file__).parent / "datasheets" / "recycle.json"

# ──────────────────────────────────────────────
# Internal types
# ──────────────────────────────────────────────

# area → {(year,month): value}
AreaMonthly = dict[str, dict[tuple[int, int], float]]

# (year,month) → {category: value}
MaterialsMonthly = dict[tuple[int, int], dict[str, float]]


# ──────────────────────────────────────────────
# Data loading (cached)
# ──────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_data() -> dict[str, Any]:
    """Parse recycle.json into structured lookup dicts.

    Returns a dict with keys:
        areas         : sorted list of area names
        kg_per_ota    : area → {(year,month): total_kg}
        kg_per_capita : area → {(year,month): kg/capita}
        materials     : (year,month) → {category: kg}
        years         : sorted list of available years
    """
    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    kg_per_ota: AreaMonthly = defaultdict(dict)
    kg_per_capita: AreaMonthly = defaultdict(dict)
    materials: MaterialsMonthly = defaultdict(dict)
    areas: set[str] = set()
    years: set[int] = set()

    for record in raw:
        record_type: str = record.get("ΤΥΠΟΣ", "")

        # ── Per-area records (kg/ΟΤΑ and kg/Κάτοικο) ──
        area = record.get("ΠΕΡΙΟΧΗ")
        if area:
            areas.add(area)
            is_per_capita = "kg/Κάτοικο" in record_type
            is_per_ota = "kg/ΟΤΑ" in record_type

            for key, val in record.items():
                if key in ("ΤΥΠΟΣ", "ΠΕΡΙΟΧΗ"):
                    continue

                parsed = parse_month_key(key)
                if parsed is None:
                    continue

                year, month = parsed
                value = parse_number(val)

                # Treat 0.00 in per-capita as no data (placeholder)
                if is_per_capita and value is not None and value == 0.0:
                    value = None

                if value is None:
                    continue

                years.add(year)

                if is_per_capita:
                    kg_per_capita[area][(year, month)] = value
                elif is_per_ota:
                    kg_per_ota[area][(year, month)] = value

        # ── Facility-level records (ΑΞΙΟΠΟΙΗΣΙΜΑ ΥΛΙΚΑ) ──
        category = record.get("ΚΑΤΗΓΟΡΙΑ")
        if category and "ΑΞΙΟΠΟΙΗΣΙΜΑ" in record_type:
            for key, val in record.items():
                if key in ("ΤΥΠΟΣ", "ΚΑΤΗΓΟΡΙΑ"):
                    continue

                parsed = parse_month_key(key)
                if parsed is None:
                    continue

                year, month = parsed
                value = parse_number(val)

                if value is None:
                    continue

                years.add(year)
                materials[(year, month)][category] = value

    return {
        "areas": sorted(areas),
        "kg_per_ota": dict(kg_per_ota),
        "kg_per_capita": dict(kg_per_capita),
        "materials": dict(materials),
        "years": sorted(years),
    }


# ──────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────

def list_areas() -> list[str]:
    """Return sorted list of available recycling areas."""
    return _load_data()["areas"]


def list_years() -> list[int]:
    """Return sorted list of years with data."""
    return _load_data()["years"]


def get_monthly(area: str, year: int) -> list[dict[str, Any]]:
    """Get monthly recycling data for a specific area and year.

    Returns a list of dicts sorted by month:
        [{month, month_name, kg_total, kg_per_capita}, ...]

    Only months with actual data are included.
    """
    data = _load_data()

    # Validate area (case-insensitive lookup)
    canonical = _resolve_area(area, data["areas"])
    if canonical is None:
        return []

    ota = data["kg_per_ota"].get(canonical, {})
    capita = data["kg_per_capita"].get(canonical, {})

    result = []
    for month in range(1, 13):
        key = (year, month)
        kg_total = ota.get(key)
        kg_cap = capita.get(key)

        # Skip months with no data at all
        if kg_total is None and kg_cap is None:
            continue

        result.append({
            "month": month,
            "month_name": MONTH_NAMES.get(month, ""),
            "kg_total": kg_total,
            "kg_per_capita": kg_cap,
        })

    return result


def get_compare(year: int) -> list[dict[str, Any]]:
    """Compare areas by average kg/capita for a given year.

    Returns sorted list (best performer first):
        [{area, avg_kg_per_capita, total_months}, ...]
    """
    data = _load_data()
    result = []

    for area in data["areas"]:
        capita = data["kg_per_capita"].get(area, {})
        values = [v for (y, _m), v in capita.items() if y == year]

        if not values:
            continue

        avg = round(sum(values) / len(values), 2)
        result.append({
            "area": area,
            "avg_kg_per_capita": avg,
            "total_months": len(values),
        })

    # Sort descending — best performer (highest kg/capita) first
    result.sort(key=lambda x: x["avg_kg_per_capita"], reverse=True)
    return result


def get_efficiency(year: int) -> list[dict[str, Any]]:
    """Calculate recycling efficiency ratio per month.

    Efficiency = Recyclables / (Recyclables + Residual)

    Uses:
        - Ανακυκλώσιμα → recyclables
        - Υπόλειμμα του ΚΔΑΥ → residual (sorting center residual)

    Returns sorted by month:
        [{month, month_name, recyclables, residual, efficiency}, ...]
    """
    data = _load_data()
    result = []

    for month in range(1, 13):
        key = (year, month)
        mat = data["materials"].get(key)

        if mat is None:
            continue

        recyclables = mat.get("Ανακυκλώσιμα")
        residual = mat.get("Υπόλειμμα του ΚΔΑΥ")

        if recyclables is None or residual is None:
            continue

        total = recyclables + residual
        efficiency = round(recyclables / total, 4) if total > 0 else 0.0

        result.append({
            "month": month,
            "month_name": MONTH_NAMES.get(month, ""),
            "recyclables": recyclables,
            "residual": residual,
            "total": total,
            "efficiency": round(efficiency, 2),
        })

    return result


def get_summary(year: int) -> dict[str, Any]:
    """Build a dashboard summary for a given year.

    Returns:
        {
            year, best_area, worst_area, avg_efficiency,
            total_recyclables, total_residual,
            areas_ranking: [{area, avg_kg_per_capita}, ...]
        }
    """
    comparison = get_compare(year)
    efficiency_data = get_efficiency(year)

    best_area = comparison[0]["area"] if comparison else None
    worst_area = comparison[-1]["area"] if comparison else None

    # Average efficiency across all months
    if efficiency_data:
        avg_eff = round(
            sum(e["efficiency"] for e in efficiency_data) / len(efficiency_data), 2
        )
        total_recyclables = sum(e["recyclables"] for e in efficiency_data)
        total_residual = sum(e["residual"] for e in efficiency_data)
    else:
        avg_eff = None
        total_recyclables = 0
        total_residual = 0

    return {
        "year": year,
        "best_area": best_area,
        "worst_area": worst_area,
        "avg_efficiency": avg_eff,
        "total_recyclables": total_recyclables,
        "total_residual": total_residual,
        "areas_ranking": comparison,
    }


# ──────────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────────

def _resolve_area(area: str, known_areas: list[str]) -> str | None:
    """Case-insensitive area lookup. Returns canonical name or None."""
    for a in known_areas:
        if a.lower() == area.lower():
            return a
    return None
