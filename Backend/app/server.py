from fastapi import FastAPI
from app.waterdata.routes import router as water_router
from app.airquality.routes import router as air_router
from app.recycle.routes import router as recycle_router
from app.sharedqi_routes import router as sharedqi_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 1. Όρισε τις διευθύνσεις που επιτρέπεται να "χτυπάνε" το API σου
origins = [
    "http://localhost:3000",      # Το τοπικό σου Next.js/React
    "http://192.168.2.6:3000",    # Αν μπαίνεις από την IP του δικτύου
    "https://το-site-sou.vercel.app" # Το domain σου στο Vercel (όταν το κάνεις deploy)
]

# 2. Πρόσθεσε το Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Επιτρέπει τα συγκεκριμένα sites
    allow_credentials=True,
    allow_methods=["*"],              # Επιτρέπει όλα τα methods (GET, POST, κλπ)
    allow_headers=["*"],              # Επιτρέπει όλα τα headers
)

app.include_router(water_router)
app.include_router(air_router)
app.include_router(recycle_router)
app.include_router(sharedqi_router)

@app.get("/")
def read_root():
    return {"message": "Γεια σου από το FastAPI!"}


#uvicorn app.server:app --reload --host
#uvicorn app.server:app --reload --host
