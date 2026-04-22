# app/routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from db import db
from db.models import User, Friend, Achievement, UserAchievement
from auth import get_current_user

router = APIRouter()

@router.get("/")
def get_achievements(db_s: Session = Depends(db.get_db)):
    ach = db_s.query(Achievement).all()
    return {
        "achievements": ach,
        "total": len(ach)
    }

@router.post("/trigger")
def trigger_achievement(data: dict, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    trigger_type = data.get("trigger_type")

    unlocked = []

    if trigger_type == "friend_added":
        count = db_s.query(Friend)\
            .filter(or_(
                Friend.id_user == current_user.id,
                Friend.id_friend == current_user.id
            )).count()

        if count == 1:
            ach = db_s.query(Achievement).first()
            ua = UserAchievement(user_id=current_user.id, achievement_id=ach.id)
            db_s.add(ua)
            db_s.commit()

            unlocked.append({
                "id": ach.id,
                "title": ach.title,
                "message": f"Congratulations! You unlocked: {ach.title}"
            })

    return {
        "unlocked_achievements": unlocked,
        "total_unlocked": len(unlocked)
    }
