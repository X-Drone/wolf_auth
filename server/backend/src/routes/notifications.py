# app/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from db import db
from models import User, Notification
from auth import get_current_user

router = APIRouter()

@router.get("/")
def get_notifications(skip: int = 0, limit: int = 20,
                      current_user: User = Depends(get_current_user),
                      db_s: Session = Depends(db.get_db)):
    notifications = db_s.query(Notification)\
        .filter(Notification.id_user == current_user.id)\
        .offset(skip).limit(limit).all()

    return {
        "notifications": [
            {
                "id": n.id,
                "type": n.type,
                "message": n.message,
                "data": json.loads(n.data) if n.data else None,
                "is_read": bool(n.is_read),
                "created_at": n.created_at
            }
            for n in notifications
        ],
        "total": len(notifications)
    }

@router.get("/{id}")
def get_notification(id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    n = db_s.query(Notification).filter_by(id=id, id_user=current_user.id).first()
    if not n:
        raise HTTPException(404, "Notification not found")

    return {
        "id": n.id,
        "type": n.type,
        "message": n.message,
        "data": json.loads(n.data) if n.data else None,
        "is_read": bool(n.is_read),
        "created_at": n.created_at
    }

@router.delete("/{id}")
def delete_notification(id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    n = db_s.query(Notification).filter_by(id=id, id_user=current_user.id).first()
    if not n:
        raise HTTPException(404, "Notification not found")

    db_s.delete(n)
    db_s.commit()
    return {"message": "Notification deleted successfully"}

@router.post("/mark_read")
def mark_read(data: dict, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    ids = data.get("notification_ids", [])
    updated = 0

    for nid in ids:
        n = db_s.query(Notification).filter_by(id=nid, id_user=current_user.id).first()
        if n:
            n.is_read = 1
            updated += 1

    db_s.commit()
    return {"marked_count": updated, "message": "Notifications marked as read"}

@router.get("/unread_count")
def unread_count(current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    count = db_s.query(Notification)\
        .filter_by(id_user=current_user.id, is_read=0).count()

    return {"unread_count": count}
