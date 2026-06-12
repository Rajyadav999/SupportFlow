from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List

# ─────────────────────────────────────────────────────────
#  REQUEST SCHEMAS (Input Validation)
# ─────────────────────────────────────────────────────────

class CreateTicketRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=5000)
    priority: Optional[str] = Field("Medium", pattern="^(Low|Medium|High)$")

    @field_validator("customer_name", "subject", "description")
    @classmethod
    def strip_and_validate(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Field cannot be empty or whitespace only")
        return val


class UpdateTicketRequest(BaseModel):
    status: Optional[str] = Field(None, pattern="^(Open|In Progress|Closed)$")
    note: Optional[str] = Field(None, max_length=5000)

    @field_validator("note")
    @classmethod
    def validate_note(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        val = v.strip()
        if not val:
            return None  # empty note ignores adding
        return val


# ─────────────────────────────────────────────────────────
#  RESPONSE SCHEMAS (Serialization)
# ─────────────────────────────────────────────────────────

class NoteResponse(BaseModel):
    id: int
    ticket_id: str
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketSummary(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TicketDetail(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


class CreateTicketResponse(BaseModel):
    ticket_id: str
    created_at: datetime


class UpdateTicketResponse(BaseModel):
    success: bool
    updated_at: datetime


class StatsResponse(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int
