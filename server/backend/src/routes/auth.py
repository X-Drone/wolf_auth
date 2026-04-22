# app/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from db.db import db
from db.models import User
from schemas import UserCreate, UserResponse, Token, TokenVerification, TokenVerificationResponse
from misc import get_password_hash, verify_password, create_access_token
from config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse)
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

@router.post("/login", response_model=Token)
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

@router.post("/verify", response_model=TokenVerificationResponse)
def verify_token(token_data: TokenVerification):
    """
    Проверить валидность JWT токена.
    
    Возвращает информацию о токене и его статус.
    """
    try:
        payload = jwt.decode(token_data.token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            return TokenVerificationResponse(
                valid=False,
                detail="Token does not contain a valid username"
            )
        return TokenVerificationResponse(
            valid=True,
            username=username
        )
    except JWTError as e:
        return TokenVerificationResponse(
            valid=False,
            detail="Invalid or expired token"
        )
