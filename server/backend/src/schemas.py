from pydantic import BaseModel, field_validator
from datetime import datetime


# Pydantic schemas (Pydantic v2 style)
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(BaseModel):
    password: str
    telegram: str | None = None
    email: str
    username: str

    @field_validator('password')
    def validate_password_length(cls, v):
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            raise ValueError('Password cannot be longer than 72 bytes')
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    model_config = {"from_attributes": True}  # pydantic v2: allow model creation from ORM objects

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
