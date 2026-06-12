from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def now_utc() -> datetime:
    """Returns the current UTC time with timezone awareness."""
    return datetime.now(timezone.utc)

def generate_ticket_id(db: Session) -> str:
    """
    Generates a unique Ticket ID like TKT-001, TKT-002, etc.
    Avoids collision even if records are deleted by searching if the ID exists.
    """
    count = db.query(Ticket).count()
    ticket_id = f"TKT-{str(count + 1).zfill(3)}"
    
    # In case there's an existing ID matching this due to deletion, increment count
    while db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first() is not None:
        count += 1
        ticket_id = f"TKT-{str(count + 1).zfill(3)}"
        
    return ticket_id
