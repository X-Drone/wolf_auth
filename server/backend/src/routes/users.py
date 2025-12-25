from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from db import db
from models import User, Friend, Achievement, UserAchievement
from schemas import UserResponse
from auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/achievements")
def get_user_achievements(current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    achievements = db_s.query(Achievement).join(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    return {
        "achievements": achievements,
        "total": len(achievements)
    }
@router.get("/search")
def search_users(query: str, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    users = db_s.query(User).filter(
        or_(
            User.username.ilike(f"%{query}%"),
            User.email.ilike(f"%{query}%")
        )
    ).all()

    result = []
    for user in users:
        if user.id == current_user.id:
            continue
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "telegram": user.telegram
        })

    return {
        "results": result,
        "total": len(result)
    }

@router.get("/{user_id}")
def get_user_by_id(user_id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    user = db_s.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    is_friend = db_s.query(Friend).filter(
        or_(
            (Friend.id_user == current_user.id) & (Friend.id_friend == user_id),
            (Friend.id_friend == current_user.id) & (Friend.id_user == user_id)
        )
    ).first() is not None

    return {
        "username": user.username,
        "email": user.email,
        "telegram": user.telegram,
        "created_at": user.created_at,
        "friends_count": 0,
        "is_friend": is_friend
    }