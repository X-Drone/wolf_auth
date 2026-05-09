from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import Optional, List, Union
import re

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # === Общие настройки ===
    secret_key: str = "your-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = False

    # === CORS настройки ===
    # Вариант 1: список конкретных разрешённых источников
    cors_allow_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        description="Список разрешённых origin (игнорируется, если задан cors_allow_origin_regex)"
    )
    
    # Вариант 2: регулярное выражение для гибкого матчинга (приоритетнее)
    cors_allow_origin_regex: Optional[str] = Field(
        default=None,
        description="Regex для match origin. При наличии игнорирует cors_allow_origins",
        example=r"^https?://(localhost(:\d{1,5})?|.*\.example\.com)$"
    )
    
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = Field(
        default_factory=lambda: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )
    cors_allow_headers: List[str] = Field(
        default_factory=lambda: ["Authorization", "Content-Type", "X-Requested-With"]
    )

    # === База данных ===
    database_url: str
    database_pool_size: int = 5
    database_pool_timeout: int = 30
    local_db_path: str = "sqlite:///./test.db"

    # === Валидация ===
    @field_validator("cors_allow_origin_regex")
    @classmethod
    def validate_regex(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                re.compile(v)  # Проверяем валидность регулянки при инициализации
            except re.error as e:
                raise ValueError(f"Invalid regex pattern: {e}")
        return v

    # === Хелпер для применения CORS в FastAPI ===
    def get_cors_config(self) -> dict:
        """Возвращает параметры для add_middleware(CORSMiddleware, ...)"""
        config = {
            "allow_credentials": self.cors_allow_credentials,
            "allow_methods": self.cors_allow_methods,
            "allow_headers": self.cors_allow_headers,
        }
        
        # Приоритет: regex > список > дефолт для dev
        if self.cors_allow_origin_regex:
            config["allow_origin_regex"] = self.cors_allow_origin_regex
        elif self.cors_allow_origins:
            config["allow_origins"] = self.cors_allow_origins
        else:
            # Fallback для локальной разработки
            config["allow_origins"] = ["http://localhost:3000"]
        
        return config

settings = Settings()
