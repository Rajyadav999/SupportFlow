from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.ticket import Ticket, Note
from app.schemas.ticket import CreateTicketRequest, UpdateTicketRequest
from app.utils.helpers import generate_ticket_id, now_utc

def create_ticket(db: Session, req: CreateTicketRequest) -> Ticket:
    """Creates a new ticket with an auto-generated ID."""
    ts = now_utc()
    tkt_id = generate_ticket_id(db)
    
    ticket = Ticket(
        ticket_id=tkt_id,
        customer_name=req.customer_name,
        customer_email=req.customer_email,
        subject=req.subject,
        description=req.description,
        status="Open",
        priority=req.priority,
        created_at=ts,
        updated_at=ts
    )
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def list_tickets(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
) -> List[Ticket]:
    """Lists tickets filtering by status/priority and searching across fields."""
    query = db.query(Ticket)
    
    if status:
        query = query.filter(Ticket.status == status)
        
    if priority:
        query = query.filter(Ticket.priority == priority)
        
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.customer_name.ilike(term),
                Ticket.customer_email.ilike(term),
                Ticket.subject.ilike(term),
                Ticket.description.ilike(term),
                Ticket.ticket_id.ilike(term)
            )
        )
        
    # Order by newest first
    return query.order_by(Ticket.created_at.desc()).all()


def get_ticket(db: Session, ticket_id: str) -> Optional[Ticket]:
    """Fetches details of a single ticket by its TKT-XXX ID."""
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def update_ticket(db: Session, ticket_id: str, req: UpdateTicketRequest) -> Optional[Ticket]:
    """Updates status and/or adds comments to an existing ticket."""
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        return None
        
    ts = now_utc()
    updated = False
    
    if req.status:
        ticket.status = req.status
        ticket.updated_at = ts
        updated = True
        
    if req.note:
        note_obj = Note(
            ticket_id=ticket_id,
            note_text=req.note,
            created_at=ts
        )
        db.add(note_obj)
        ticket.updated_at = ts
        updated = True
        
    if updated:
        db.commit()
        db.refresh(ticket)
        
    return ticket


def get_stats(db: Session) -> dict:
    """Aggregates count statistics for the support dashboard."""
    total = db.query(Ticket).count()
    open_count = db.query(Ticket).filter(Ticket.status == "Open").count()
    in_progress = db.query(Ticket).filter(Ticket.status == "In Progress").count()
    closed = db.query(Ticket).filter(Ticket.status == "Closed").count()
    
    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "closed": closed
    }
