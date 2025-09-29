from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Общие настройки
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Режим разработки
    debug: bool = False
    
    # База данных
    database_url: str
    database_pool_size: int = 5
    database_pool_timeout: int = 30
    
    # Настройки для локальной разработки
    local_db_path: str = "sqlite:///./test.db"  # для SQLite в dev режиме
    
    class Config:
        env_file = ".env"

settings = Settings()