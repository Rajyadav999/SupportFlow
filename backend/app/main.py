import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load local environment variables if .env exists
load_dotenv()

from app.database.connection import engine, Base
from app.routes.tickets import router as tickets_router
from app.routes.auth import router as auth_router

# ── Database Initialization ─────────────────────────────────
# This generates SQLite/PostgreSQL schemas if they do not exist.
try:
    Base.metadata.create_all(bind=engine)
    print("Database schema initialised successfully (SQLAlchemy).")
except Exception as e:
    print(f"Failed to initialise SQLAlchemy schemas: {e}")

# ── App setup ──────────────────────────────────────────────
app = FastAPI(
    title="Support CRM API",
    description="Customer support ticketing CRM API backend using FastAPI, Pydantic, and SQLAlchemy",
    version="1.0.0"
)

# ── CORS Setup ─────────────────────────────────────────────
# Allows cross-origin requests from frontends (e.g. React).
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ────────────────────────────────────────
app.include_router(tickets_router)
app.include_router(auth_router)

# ── Health check & Root ─────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Customer Support Ticketing CRM API is running"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
