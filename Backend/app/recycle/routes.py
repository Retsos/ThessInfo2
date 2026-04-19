"""Recycling API routes.

Endpoints:
    GET /recycling/areas       — Available recycling areas
    GET /recycling/monthly     — Monthly trend data (line chart)
    GET /recycling/compare     — Area comparison (bar chart)
    GET /recycling/efficiency  — Recycling efficiency ratio
    GET /recycling/summary     — Dashboard overview
"""

from fastapi import APIRouter, HTTPException, Query

from app.recycle.services import (
    get_compare,
    get_efficiency,
    get_monthly,
    get_summary,
    list_areas,
    list_years,
)

router = APIRouter(prefix="/recycling", tags=["Recycling"])


@router.get("/areas")
def read_areas():
    """Return all available recycling areas and years."""
    return {
        "areas": list_areas(),
        "years": list_years(),
    }


@router.get("/monthly")
def read_monthly(
    area: str = Query(..., description="Area name, e.g. ΘΕΡΜΗ"),
    year: int = Query(..., description="Year, e.g. 2023 or 2024"),
):
    """Monthly recycling data for a specific area and year.

    Returns kg_total and kg_per_capita per month — ready for line charts.
    """
    data = get_monthly(area, year)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No recycling data for area '{area}' in {year}",
        )
    return {
        "area": area.upper(),
        "year": year,
        "months": data,
    }


@router.get("/compare")
def read_compare(
    year: int = Query(..., description="Year to compare, e.g. 2023"),
):
    """Compare areas by average kg/capita — ready for bar charts.

    Returns areas sorted by performance (best first).
    """
    data = get_compare(year)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No comparison data for year {year}",
        )
    return {
        "year": year,
        "comparison": data,
    }


@router.get("/efficiency")
def read_efficiency(
    year: int = Query(..., description="Year, e.g. 2023"),
):
    """Recycling efficiency ratio per month.

    Efficiency = Recyclables / (Recyclables + Residual)
    The "paper-level" insight — not just how much, but how well.
    """
    data = get_efficiency(year)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No efficiency data for year {year}",
        )
    return {
        "year": year,
        "months": data,
    }


@router.get("/summary")
def read_summary(
    year: int = Query(..., description="Year, e.g. 2023"),
):
    """Dashboard overview — best/worst area, avg efficiency, totals.

    Ready for UI summary cards.
    """
    data = get_summary(year)
    if data["best_area"] is None:
        raise HTTPException(
            status_code=404,
            detail=f"No summary data for year {year}",
        )
    return data