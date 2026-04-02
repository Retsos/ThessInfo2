from fastapi import APIRouter

router = APIRouter(prefix="/recycle", tags=["Recycle"])

@router.get("/")
def get_recycle_status():
    return {"status": "Clean", "location": "Thessaloniki"}