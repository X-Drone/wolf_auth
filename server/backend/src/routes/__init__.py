__version__ = "1.0.0"
__author__ = "X-Drone"


from fastapi import APIRouter

from db import db
from .friends import router as friends_router
from .auth import router as auth_router
from .users import router as users_router
from .notifications import router as notifications_router
from .achievements import router as achievements_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth")
router.include_router(users_router, prefix="/users")
router.include_router(friends_router, prefix="/friends")
router.include_router(notifications_router, prefix="/notifications")
router.include_router(achievements_router, prefix="/achievements")

@router.get("/health")
def health_check():
    return {"status": "healthy", "debug": db.engine.url if hasattr(db.engine, 'url') else str(db.engine)}


__all__ = ["auth",
           "users",
           "router"]
