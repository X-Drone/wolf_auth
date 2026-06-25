__version__ = "1.0.0"
__author__ = "X-Drone"


from .db import DB
from .models import User, Friend, Requests, Notification, Achievement, UserAchievement

db = DB()

__all__ = [
    "__version__",
    "__author__",
    'db',
    'User',
    'Friend',
    'Requests',
    'Achievement',
    'Notification',
    'UserAchievement',
]
