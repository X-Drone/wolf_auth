# app/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db import db
from models import UserCreate, UserResponse, User, Token
from misc import get_password_hash, verify_password, create_access_token
from auth import get_current_user

router = APIRouter()

@router.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db_s: Session = Depends(db.get_db)):
    # Проверить, существует ли пользователь с таким email
    db_user = db_s.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Проверить, существует ли пользователь с таким username
    db_user = db_s.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        telegram=user.telegram
    )
    db_s.add(db_user)
    db_s.commit()
    db_s.refresh(db_user)
    return db_user

@router.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db_s: Session = Depends(db.get_db)):
    if "@" in form_data.username:
        user = db_s.query(User).filter(User.email == form_data.username).first()
    else:
        user = db_s.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/api/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/api/health")
def health_check():
    return {"status": "healthy", "debug": db.engine.url if hasattr(db.engine, 'url') else str(db.engine)}
