# app/routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional
from pydantic import BaseModel

from db.db import db
from db.models import User
from schemas import UserCreate, UserResponse, Token, TokenVerification, TokenVerificationResponse
from misc import get_password_hash, verify_password, create_access_token
from config import settings

router = APIRouter()

# Модель для ответа с редиректом
class TokenWithRedirect(BaseModel):
    access_token: str
    token_type: str
    redirect_url: Optional[str] = None
    state: Optional[str] = None

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

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db_s: Session = Depends(db.get_db),
    redirect_url: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """
    Вход в систему.
    
    Параметры:
    - username: email или username
    - password: пароль
    - redirect_url (optional): URL для редиректа после успешного логина, токен будет добавлен как параметр ?token=...
    
    Возвращает токен, и если указан redirect_url, также возвращает URL для редиректа.
    """
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
    
    # Если указан redirect_url, возвращаем его вместе с токеном
    if redirect_url:
        # Проверяем валидность URL (базовая проверка)
        if not redirect_url.startswith(('http://', 'https://')):
            raise HTTPException(
                status_code=400,
                detail="Invalid redirect_url: must start with http:// or https://"
            )
        return TokenWithRedirect(
            access_token=access_token, 
            token_type="bearer",
            redirect_url=redirect_url,
            state=state
        )
    
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

@router.get("/verify", response_model=TokenVerificationResponse)
def verify_token(token: str = Depends(db.oauth2_scheme)):
    """
    Проверить валидность JWT токена - GET запрос с параметром token.
    
    Возвращает информацию о токене и его статус.
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
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
