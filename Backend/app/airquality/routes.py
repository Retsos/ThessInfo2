from fastapi import APIRouter, HTTPException

from app.airquality.services import (
    get_latest_month_concentrations,
    get_month_concentrations,
    get_monthly_air_quality_index,
    get_yearly_air_quality_index,
    list_areas,
)

router = APIRouter(prefix="/air", tags=["Air"])


@router.get("/areas")
def read_areas():
    return {"areas": list_areas()}


@router.get("/area/{area}/latest-month")
def read_latest_month(area: str):
    result = get_latest_month_concentrations(area)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/area/{area}/month/{year}/{month}")
def read_month_concentrations(area: str, year: int, month: int):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="month must be between 1 and 12")

    result = get_month_concentrations(area, year, month)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/area/{area}/air-index/monthly")
def read_monthly_air_index(area: str):
    try:
        return get_monthly_air_quality_index(area)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/area/{area}/air-index/yearly")
def read_yearly_air_index(area: str):
    try:
        return get_yearly_air_quality_index(area)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
