from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import teams, players, bug_reports

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://supermegadb.com", "https://supermegadb.com", "http://localhost:5173", "https://smb4-database.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router)
app.include_router(players.router)
app.include_router(bug_reports.router)

@app.get("/")
def read_root():
    return {"status": "ok"}