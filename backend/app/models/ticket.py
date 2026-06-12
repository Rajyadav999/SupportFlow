from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="Open")  # Open | In Progress | Closed
    priority = Column(String, nullable=False, default="Medium")  # Low | Medium | High
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    # Relationships
    # cascade="all, delete-orphan" ensures when a ticket is deleted, its notes are also deleted
    notes = relationship("Note", back_populates="ticket", cascade="all, delete-orphan", order_by="Note.created_at.desc()")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("tickets.ticket_id"), nullable=False)
    note_text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)

    # Relationships
    ticket = relationship("Ticket", back_populates="notes")
