from pydantic import BaseModel, EmailStr
from typing import Optional, List


# ─────────────────────────────────────────────
#  REQUEST bodies  (what the frontend sends IN)
# ─────────────────────────────────────────────

class CreateTicketRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr        # Pydantic validates email format automatically
    subject: str
    description: str
    priority: Optional[str] = "Medium"   # Low | Medium | High


class UpdateTicketRequest(BaseModel):
    status: Optional[str] = None         # Open | In Progress | Closed
    note: Optional[str] = None           # new note text to add


# ─────────────────────────────────────────────
#  RESPONSE shapes  (what we send back OUT)
# ─────────────────────────────────────────────

class NoteResponse(BaseModel):
    id: int
    ticket_id: str
    note_text: str
    created_at: str


class TicketSummary(BaseModel):
    """Used in the list view — no notes, keeps payload small"""
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    priority: str
    created_at: str
    updated_at: str


class TicketDetail(BaseModel):
    """Used in the detail view — includes full info + notes"""
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: str
    updated_at: str
    notes: List[NoteResponse] = []


class CreateTicketResponse(BaseModel):
    ticket_id: str
    created_at: str


class UpdateTicketResponse(BaseModel):
    success: bool
    updated_at: str


class StatsResponse(BaseModel):
    """Dashboard counts — bonus feature"""
    total: int
    open: int
    in_progress: int
    closed: int