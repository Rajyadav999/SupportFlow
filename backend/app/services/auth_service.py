import hashlib
import secrets
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from typing import Optional, Tuple

from app.models.user import User, OTP, UserSession
from app.schemas.user import UserSignUpRequest, UserLoginRequest, OTPVerifyRequest
from app.utils.helpers import now_utc

APP_SALT = "crm_support_desk_salt_key_12345!"

def hash_password(password: str) -> str:
    """Helper to hash user passwords safely without bcrypt library requirements."""
    salted = password + APP_SALT
    return hashlib.sha256(salted.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verify password matches its hashed equivalent."""
    return hash_password(password) == hashed


def generate_otp_code() -> str:
    """Generates a random 6-digit verification code."""
    return "".join(random.choices("0123456789", k=6))


def register_user(db: Session, req: UserSignUpRequest) -> Tuple[User, str]:
    """
    Registers a new support agent account.
    If the email already exists and is verified, throws an exception.
    Generates a 6-digit OTP code, saves it, and prints it to console.
    """
    # Check if verified user exists
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        if existing.is_verified:
            raise ValueError("An account with this email address already exists.")
        else:
            # Delete unverified account to re-create
            db.delete(existing)
            db.commit()

    ts = now_utc()
    hashed = hash_password(req.password)
    
    # Create inactive user
    user = User(
        name=req.name,
        email=req.email,
        hashed_password=hashed,
        is_verified=False,
        created_at=ts
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate OTP (valid for 10 minutes)
    otp_code = generate_otp_code()
    expires_at = ts + timedelta(minutes=10)
    
    # Clean old OTPs for this email first
    db.query(OTP).filter(OTP.email == req.email).delete()
    
    otp_record = OTP(
        email=req.email,
        otp_code=otp_code,
        expires_at=expires_at,
        created_at=ts
    )
    db.add(otp_record)
    db.commit()

    # Print verification code to console logs
    print(f"\n[AUTH SERVICE - OTP VERIFICATION CODE] Email: {req.email} | OTP: {otp_code}\n")

    return user, otp_code


def verify_user_otp(db: Session, req: OTPVerifyRequest) -> bool:
    """
    Verifies the OTP code for an email.
    If correct, activates the user and deletes verification records.
    """
    ts = now_utc()
    otp_record = db.query(OTP).filter(
        OTP.email == req.email,
        OTP.otp_code == req.otp_code
    ).order_by(OTP.created_at.desc()).first()

    if not otp_record:
        return False

    if otp_record.expires_at < ts:
        db.delete(otp_record)
        db.commit()
        return False  # Expired code

    # Activate user
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        user.is_verified = True
        # Clear all OTP records for this user
        db.query(OTP).filter(OTP.email == req.email).delete()
        db.commit()
        db.refresh(user)
        return True

    return False


def login_user(db: Session, req: UserLoginRequest) -> Optional[User]:
    """Validates login credentials for a verified account."""
    user = db.query(User).filter(
        User.email == req.email,
        User.is_verified == True
    ).first()
    
    if not user:
        return None
        
    if not verify_password(req.password, user.hashed_password):
        return None
        
    return user


def create_session(db: Session, user_id: int) -> UserSession:
    """Generates a secure database-backed session token for a user."""
    ts = now_utc()
    token = secrets.token_hex(32)
    expires_at = ts + timedelta(days=30)  # Token active for 30 days
    
    session = UserSession(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def validate_session_token(db: Session, token: str) -> Optional[User]:
    """Validates session token and returns the corresponding User object."""
    ts = now_utc()
    session = db.query(UserSession).filter(UserSession.token == token).first()
    
    if not session:
        return None
        
    if session.expires_at < ts:
        db.delete(session)
        db.commit()
        return None
        
    return session.user


def revoke_session(db: Session, token: str) -> bool:
    """Deletes the session token from database on user logout."""
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if session:
        db.delete(session)
        db.commit()
        return True
    return False
