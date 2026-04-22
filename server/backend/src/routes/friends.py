from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from uuid import uuid4

from db.db import db
from db.models import User, Friend, Requests, Notification
from auth import get_current_user

router = APIRouter()

@router.get("/")
def get_friends(current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    friends = db_s.query(Friend).filter(
        or_(
            Friend.id_user == current_user.id,
            Friend.id_friend == current_user.id
        )
    ).all()

    result = []
    for f in friends:
        friend_id = f.id_friend if f.id_user == current_user.id else f.id_user
        user = db_s.query(User).filter(User.id == friend_id).first()
        if user:
            result.append({
                "username": user.username,
                "avatar_url": user.avatar_url,
                "added_at": None
            })

    return {"friends": result, "total": len(result)}

@router.post("/requests")
def send_friend_request(data: dict, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    recipient_id = data.get("recipient_id")

    existing = db_s.query(Requests).filter_by(
        sender_id=current_user.id,
        recipient_id=recipient_id,
        status="pending"
    ).first()

    if existing:
        raise HTTPException(409, "Request already exists")

    req = Requests(
        sender_id=current_user.id,
        recipient_id=recipient_id,
        status="pending"
    )
    db_s.add(req)
    db_s.commit()
    db_s.refresh(req)

    return {
        "request_id": f"freq-{req.id}",
        "sender_id": req.sender_id,
        "recipient_id": req.recipient_id,
        "status": req.status,
        "created_at": req.created_at
    }

@router.post("/requests/{request_id}/accept")
def accept_request(request_id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    req = db_s.query(Requests).filter_by(id=request_id, recipient_id=current_user.id).first()
    if not req:
        raise HTTPException(404, "Request not found")

    req.status = "accepted"
    db_s.add(Friend(id_user=req.sender_id, id_friend=req.recipient_id))
    db_s.commit()

    user = db_s.query(User).filter(User.id == req.sender_id).first()

    return {
        "status": "accepted",
        "friend": {
            "username": user.username,
            "avatar_url": user.avatar_url,
            "added_at": datetime.utcnow()
        }
    }

@router.post("/requests/{request_id}/reject")
def reject_request(request_id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    req = db_s.query(Requests).filter_by(id=request_id, recipient_id=current_user.id).first()
    if not req:
        raise HTTPException(404, "Request not found")

    req.status = "rejected"
    db_s.commit()
    return {"status": "rejected"}

@router.delete("/{friend_id}")
def delete_friend(friend_id: int, current_user: User = Depends(get_current_user), db_s: Session = Depends(db.get_db)):
    rel = db_s.query(Friend).filter(
        or_(
            (Friend.id_user == current_user.id) & (Friend.id_friend == friend_id),
            (Friend.id_friend == current_user.id) & (Friend.id_user == friend_id)
        )
    ).first()

    if not rel:
        raise HTTPException(404, "Friend not found")

    db_s.delete(rel)
    db_s.commit()
    return {"message": "Friend removed successfully"}
