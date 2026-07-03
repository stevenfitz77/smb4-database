from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import teams, players

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default dev port
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router)
app.include_router(players.router)

@app.get("/")
def read_root():
    return {"status": "ok"}