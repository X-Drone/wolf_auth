from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel, field_validator
from config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time
from sqlalchemy import exc
import logging
import hashlib
import secrets

from models import User as UserModel, Base  # ← Импортируем модель и Base

app = FastAPI(debug=settings.debug)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"] if settings.debug else ["https://wolf_auth.laureni.synology.me.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup - теперь зависит от режима
if settings.debug:
    # Для разработки используем SQLite
    engine = create_engine(
        settings.local_db_path,
        connect_args={"check_same_thread": False}  # для SQLite
    )
    print("Using SQLite for development")
else:
    # Для продакшена используем PostgreSQL
    engine = create_engine(
        settings.database_url,
        pool_size=settings.database_pool_size,
        pool_timeout=settings.database_pool_timeout,
        pool_recycle=300
    )
    print("Using PostgreSQL for production")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Password hashing (встроенный)
def get_password_hash(password: str):
    # Преобразуем строку в байты
    password_bytes = password.encode('utf-8')

    # Генерируем соль
    salt = secrets.token_bytes(32)
    # Хешируем с помощью PBKDF2
    iterations = 100000
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, iterations)
    # Сохраняем как строку: iterations$salt$hash
    salt_hex = salt.hex()
    hash_hex = hash_bytes.hex()
    return f"{iterations}${salt_hex}${hash_hex}"

def verify_password(plain_password, hashed_password):
    # Преобразуем строку в байты
    password_bytes = plain_password.encode('utf-8')

    # Разбираем строку хеша
    parts = hashed_password.split('$')
    if len(parts) != 3:
        raise ValueError("Invalid hash format")
    iterations = int(parts[0])
    salt_hex = parts[1]
    stored_hash_hex = parts[2]
    # Декодируем соль и хеш
    salt = bytes.fromhex(salt_hex)
    stored_hash = bytes.fromhex(stored_hash_hex)
    # Хешируем введенный пароль
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, iterations)
    # Сравниваем хеши
    return secrets.compare_digest(hash_bytes, stored_hash)

# Security scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def wait_for_db(max_retries=5, retry_interval=5):
    if settings.debug:
        # Для SQLite не нужно ждать подключения
        try:
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            logging.info("Successfully connected to SQLite")
            return
        except Exception as e:
            logging.error(f"SQLite connection failed: {e}")
            raise

    retries = 0
    while retries < max_retries:
        try:
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            logging.info("Successfully connected to the database")
            return
        except exc.OperationalError as e:
            retries += 1
            logging.warning(f"Database connection attempt {retries} failed: {e}. Retrying in {retry_interval} seconds...")
            time.sleep(retry_interval)

    raise Exception("Could not connect to the database")

# Schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(BaseModel):
    password: str
    telegram: str
    email: str
    username: str

    @field_validator('password')
    def validate_password_length(cls, v):
        # Проверяем длину пароля в байтах
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            raise ValueError('Password cannot be longer than 72 bytes')
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Helper functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = db.query(UserModel).filter(UserModel.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# Endpoints
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Проверить, существует ли пользователь с таким email
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Проверить, существует ли пользователь с таким username
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,  # ← Правильное имя поля
        telegram=user.telegram
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    # Проверяем, является ли form_data.username email-адресом
    if "@" in form_data.username:
        # Ищем пользователя по email
        user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    else:
        # Ищем пользователя по username
        user = db.query(UserModel).filter(UserModel.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.username})  # или user.email, если хотите
    return {"access_token": access_token, "token_type": "bearer"}
@app.get("/api/users/me", response_model=UserResponse)
async def read_users_me(
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    return current_user

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "debug": settings.debug}

# Create tables
Base.metadata.create_all(bind=engine)