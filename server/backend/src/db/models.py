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
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Friend(Base):
    __tablename__ = "friend"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, index=True)
    id_friend = Column(Integer, index=True)

class Requests(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, index=True)
    recipient_id = Column(Integer, index=True)
    status = Column(String)  # e.g., pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, index=True)
    type = Column(String)
    message = Column(String)
    data = Column(String) # json
    is_read = Column(Integer, default=0) # 0 - unread, 1 - read
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievement"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    icon_url = Column(String)
    rarity = Column(String)  # e.g., common, rare, epic, legendary

class UserAchievement(Base):
    __tablename__ = "user_achievement"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_id = Column(Integer, index=True)
    date_earned = Column(DateTime, default=datetime.utcnow)
