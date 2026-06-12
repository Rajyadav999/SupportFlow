from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.schemas.ticket import (
    CreateTicketRequest, CreateTicketResponse,
    UpdateTicketRequest, UpdateTicketResponse,
    TicketSummary, TicketDetail, StatsResponse
)
from app.services import ticket_service

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

@router.post("", response_model=CreateTicketResponse, status_code=201)
def create_new_ticket(body: CreateTicketRequest, db: Session = Depends(get_db)):
    """Creates a new customer support ticket."""
    try:
        new_ticket = ticket_service.create_ticket(db, body)
        return CreateTicketResponse(
            ticket_id=new_ticket.ticket_id,
            created_at=new_ticket.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error while creating ticket: {str(e)}"
        )


@router.get("", response_model=List[TicketSummary])
def get_tickets_list(
    status: Optional[str] = Query(None, description="Filter by status (Open | In Progress | Closed)"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low | Medium | High)"),
    search: Optional[str] = Query(None, description="Search across ticket fields"),
    db: Session = Depends(get_db)
):
    """Retrieves list of tickets matching filters/search."""
    try:
        tickets = ticket_service.list_tickets(db, status=status, priority=priority, search=search)
        return tickets
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error while listing tickets: {str(e)}"
        )


@router.get("/stats/summary", response_model=StatsResponse)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    """Retrieves tickets counts for the dashboard stats widget."""
    try:
        stats = ticket_service.get_stats(db)
        return StatsResponse(**stats)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error while fetching statistics: {str(e)}"
        )


@router.get("/{ticket_id}", response_model=TicketDetail)
def get_ticket_details(ticket_id: str, db: Session = Depends(get_db)):
    """Retrieves detailed information of a single ticket including its comments timeline."""
    ticket = ticket_service.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket with ID {ticket_id} was not found"
        )
    return ticket


@router.put("/{ticket_id}", response_model=UpdateTicketResponse)
def update_existing_ticket(
    ticket_id: str,
    body: UpdateTicketRequest,
    db: Session = Depends(get_db)
):
    """Updates status and/or adds comments to a ticket."""
    # Validate request payload has at least one field to update
    if body.status is None and body.note is None:
        raise HTTPException(
            status_code=400,
            detail="Request body must contain either 'status' or 'note' to execute an update"
        )
        
    ticket = ticket_service.update_ticket(db, ticket_id, body)
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket with ID {ticket_id} was not found"
        )
        
    return UpdateTicketResponse(
        success=True,
        updated_at=ticket.updated_at
    )
