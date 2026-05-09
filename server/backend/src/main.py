from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db.db import db
from db.models import Base
from routes import router

app = FastAPI(debug=settings.debug)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)

# Создать таблицы при старте (если нужно)
Base.metadata.create_all(bind=db.engine)

# Регистрация роутера
app.include_router(router)
