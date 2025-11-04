from datetime import datetime, timedelta
from jose import jwt
import logging
import hashlib
import secrets

from config import settings


# Password hashing (встроенный)
def get_password_hash(password: str):
    # Преобразуем строку в байты
    password_bytes = password.encode('utf-8')

    # Генерируем соль
    salt = secrets.token_bytes(32)
    # Хешируем с помощью PBKDF2
    iterations = 100000
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, iterations)
    # Сохраняем как строку: iterations$salt$hash
    salt_hex = salt.hex()
    hash_hex = hash_bytes.hex()
    return f"{iterations}${salt_hex}${hash_hex}"

def verify_password(plain_password, hashed_password):
    # Преобразуем строку в байты
    password_bytes = plain_password.encode('utf-8')

    # Разбираем строку хеша
    parts = hashed_password.split('$')
    if len(parts) != 3:
        raise ValueError("Invalid hash format")
    iterations = int(parts[0])
    salt_hex = parts[1]
    stored_hash_hex = parts[2]
    # Декодируем соль и хеш
    salt = bytes.fromhex(salt_hex)
    stored_hash = bytes.fromhex(stored_hash_hex)
    # Хешируем введенный пароль
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, iterations)
    # Сравниваем хеши
    return secrets.compare_digest(hash_bytes, stored_hash)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt
