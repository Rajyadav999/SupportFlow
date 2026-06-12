from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class UserSignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=50)

    @field_validator("name")
    @classmethod
    def strip_and_validate(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Name cannot be empty or whitespace only")
        return val


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=6, max_length=6)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    token: str
    user: UserResponse


class AuthMeResponse(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool

    class Config:
        from_attributes = True
