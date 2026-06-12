import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Default to SQLite database crm.db if DATABASE_URL is not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm.db")

# For SQLite, check_same_thread=False is required since FastAPI handles requests on multiple threads.
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency generator to yield DB sessions and ensure they are closed afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
