from fastapi import APIRouter, HTTPException
from app.waterdata.services import analyze_water_quality, calculate_wqi, get_available_months, get_monthly_analysis, get_year_monthly_wqi, get_year_overall_wqi, get_yearly_stats


router = APIRouter(prefix="/water", tags=["Water Quality"])



@router.get("/months/{area_name}")
async def read_months(area_name: str):
    return get_available_months(area_name)

@router.get("/analysis/{area_name}/{month_ts}")
async def read_monthly_data(area_name: str, month_ts: str):
    # Παράδειγμα κλήσης: /water/analysis/40_Ekklisies/2023-12-01
    res = get_monthly_analysis(area_name, month_ts)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/wqi/monthly/{area_name}/{year}")
async def wqi_by_month(area_name: str, year: str):
    # Παράδειγμα: /water/wqi/monthly/40_Ekklisies/2023
    res = get_year_monthly_wqi(area_name, year)
    if isinstance(res, dict) and "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/wqi/overall/{area_name}/{year}")
async def wqi_overall(area_name: str, year: str):
    # Παράδειγμα: /water/wqi/overall/40_Ekklisies/2023
    res = get_year_overall_wqi(area_name, year)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/stats/{area}/{year}")
async def read_stats(area: str, year: str):
    return get_yearly_stats(area, year)