# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db import db
from models import Base
from api import router

app = FastAPI(debug=settings.debug)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"] if settings.debug else ["https://wolf_auth.laureni.synology.me.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создать таблицы при старте (если нужно)
Base.metadata.create_all(bind=db.engine)

# Регистрация роутера
app.include_router(router)
