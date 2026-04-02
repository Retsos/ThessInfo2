from fastapi import APIRouter

router = APIRouter(prefix="/air", tags=["Air"])

@router.get("/")
def get_air_status():
    return {"status": "Clean", "location": "Thessaloniki"}