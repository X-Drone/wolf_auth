# app/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    telegram = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Friend(Base):
    __tablename__ = "friend"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, index=True)
    id_friend = Column(Integer, index=True)

class Notification(Base):
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, index=True)
    data = Column(String) # json

class Achievement(Base):
    __tablename__ = "achievement"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, index=True)
    data = Column(String) # json
