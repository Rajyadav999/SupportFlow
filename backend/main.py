from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import init_db
from routes.tickets import router as tickets_router

# ── App setup ──────────────────────────────────────────────
app = FastAPI(
    title="Support CRM API",
    description="Customer support ticketing system for Datastraw assessment",
    version="1.0.0"
)

# ── CORS ───────────────────────────────────────────────────
# Allows the React frontend (on a different origin) to call this API.
# In production, replace "*" with your actual Vercel frontend URL.
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Init DB on startup ─────────────────────────────────────
@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Database initialised")

# ── Register routers ───────────────────────────────────────
app.include_router(tickets_router)

# ── Health check ───────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "Support CRM API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}