from fastapi import FastAPI
from app.waterdata.routes import router as water_router
from app.airquality.routes import router as air_router
from app.recycle.routes import router as recycle_router
from app.sharedqi_routes import router as sharedqi_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",     
    "http://192.168.2.6:3000",   
    "https://το-site-sou.vercel.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],            
)

app.include_router(water_router)
app.include_router(air_router)
app.include_router(recycle_router)
app.include_router(sharedqi_router)

@app.get("/")
def read_root():
    return {"message": "Γεια σου από το FastAPI!"}


#uvicorn app.server:app --reload --host
