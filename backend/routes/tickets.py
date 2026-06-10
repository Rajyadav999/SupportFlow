from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timezone

from database import get_connection
from schemas import (
    CreateTicketRequest, CreateTicketResponse,
    UpdateTicketRequest, UpdateTicketResponse,
    TicketSummary, TicketDetail, NoteResponse, StatsResponse
)

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


# ─────────────────────────────────────────────────────────
#  HELPER — generate ticket IDs like TKT-001, TKT-002 ...
# ─────────────────────────────────────────────────────────

def generate_ticket_id(conn) -> str:
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM tickets")
    count = cursor.fetchone()["cnt"]
    return f"TKT-{str(count + 1).zfill(3)}"   # TKT-001, TKT-042, TKT-100 ...


def now_iso() -> str:
    """Current UTC time as ISO string — consistent format everywhere"""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


# ─────────────────────────────────────────────────────────
#  POST /api/tickets   — Create a new ticket
# ─────────────────────────────────────────────────────────

@router.post("", response_model=CreateTicketResponse, status_code=201)
def create_ticket(body: CreateTicketRequest):
    conn = get_connection()
    try:
        ticket_id = generate_ticket_id(conn)
        ts = now_iso()

        conn.execute("""
            INSERT INTO tickets
                (ticket_id, customer_name, customer_email, subject, description,
                 status, priority, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?)
        """, (ticket_id, body.customer_name, body.customer_email,
              body.subject, body.description, body.priority, ts, ts))

        conn.commit()
        return CreateTicketResponse(ticket_id=ticket_id, created_at=ts)

    finally:
        conn.close()   # always close — prevents connection leaks


# ─────────────────────────────────────────────────────────
#  GET /api/tickets   — List all tickets (search + filter)
# ─────────────────────────────────────────────────────────

@router.get("", response_model=list[TicketSummary])
def list_tickets(
    status: Optional[str] = Query(None, description="Open | In Progress | Closed"),
    search: Optional[str] = Query(None, description="Search in name, email, subject, description"),
    priority: Optional[str] = Query(None, description="Low | Medium | High"),
):
    conn = get_connection()
    try:
        # Build query dynamically based on which filters are provided
        query = "SELECT * FROM tickets WHERE 1=1"
        params = []

        if status:
            query += " AND status = ?"
            params.append(status)

        if priority:
            query += " AND priority = ?"
            params.append(priority)

        if search:
            # Search across 4 fields with a single LIKE on each
            query += """ AND (
                customer_name  LIKE ? OR
                customer_email LIKE ? OR
                subject        LIKE ? OR
                description    LIKE ? OR
                ticket_id      LIKE ?
            )"""
            term = f"%{search}%"
            params.extend([term, term, term, term, term])

        query += " ORDER BY created_at DESC"

        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]

    finally:
        conn.close()


# ─────────────────────────────────────────────────────────
#  GET /api/tickets/{ticket_id}   — Get single ticket + notes
# ─────────────────────────────────────────────────────────

@router.get("/{ticket_id}", response_model=TicketDetail)
def get_ticket(ticket_id: str):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM tickets WHERE ticket_id = ?", (ticket_id,)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")

        ticket = dict(row)

        # Fetch all notes for this ticket, newest first
        notes_rows = conn.execute(
            "SELECT * FROM notes WHERE ticket_id = ? ORDER BY created_at DESC",
            (ticket_id,)
        ).fetchall()

        ticket["notes"] = [dict(n) for n in notes_rows]
        return ticket

    finally:
        conn.close()


# ─────────────────────────────────────────────────────────
#  PUT /api/tickets/{ticket_id}   — Update status / add note
# ─────────────────────────────────────────────────────────

VALID_STATUSES = {"Open", "In Progress", "Closed"}

@router.put("/{ticket_id}", response_model=UpdateTicketResponse)
def update_ticket(ticket_id: str, body: UpdateTicketRequest):
    conn = get_connection()
    try:
        # Check ticket exists
        row = conn.execute(
            "SELECT id FROM tickets WHERE ticket_id = ?", (ticket_id,)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")

        ts = now_iso()

        # Update status if provided
        if body.status:
            if body.status not in VALID_STATUSES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
                )
            conn.execute(
                "UPDATE tickets SET status = ?, updated_at = ? WHERE ticket_id = ?",
                (body.status, ts, ticket_id)
            )

        # Add note if provided
        if body.note and body.note.strip():
            conn.execute(
                "INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?)",
                (ticket_id, body.note.strip(), ts)
            )
            # Also bump updated_at on the ticket
            conn.execute(
                "UPDATE tickets SET updated_at = ? WHERE ticket_id = ?",
                (ts, ticket_id)
            )

        conn.commit()
        return UpdateTicketResponse(success=True, updated_at=ts)

    finally:
        conn.close()


# ─────────────────────────────────────────────────────────
#  GET /api/stats   — Dashboard counts (bonus feature)
# ─────────────────────────────────────────────────────────

@router.get("/stats/summary", response_model=StatsResponse)
def get_stats():
    conn = get_connection()
    try:
        total      = conn.execute("SELECT COUNT(*) FROM tickets").fetchone()[0]
        open_      = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='Open'").fetchone()[0]
        in_prog    = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='In Progress'").fetchone()[0]
        closed     = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='Closed'").fetchone()[0]

        return StatsResponse(total=total, open=open_, in_progress=in_prog, closed=closed)

    finally:
        conn.close()