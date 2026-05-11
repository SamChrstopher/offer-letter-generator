from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from config.settings import JWT_SECRET, JWT_ALGORITHM
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def create_access_token(data: dict, expires_minutes: int):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload.update({"exp": expire, "type": "access"})
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(data: dict, expires_days: int):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=expires_days)
    payload.update({"exp": expire, "type": "refresh"})
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

def generate_reset_token() -> str:
    """Generate a secure random token for password reset"""
    return secrets.token_urlsafe(32)