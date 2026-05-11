from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from models.user_model import User
from models.token_model import RefreshToken
from models.password_reset_model import PasswordResetToken
from utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_reset_token
)
from config.settings import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from config.settings import JWT_SECRET, JWT_ALGORITHM
from config.database import get_db
from utils.email_service import send_reset_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def register_user(db: Session, username: str, email: str, password: str):
    existing_user = db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=username,
        email=email,
        hashed_password=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        {"sub": str(user.id), "username": user.username, "role": user.role},
        ACCESS_TOKEN_EXPIRE_MINUTES
    )

    refresh_token = create_refresh_token(
        {"sub": str(user.id)},
        REFRESH_TOKEN_EXPIRE_DAYS
    )

    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=expires_at
    )

    db.add(db_refresh)
    db.commit()

    return access_token, refresh_token


def refresh_access_token(db: Session, refresh_token: str):
    try:
        payload = decode_token(refresh_token)
    except:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    token_db = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.is_revoked == False
    ).first()

    if not token_db:
        raise HTTPException(status_code=401, detail="Refresh token revoked or not found")

    if token_db.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired")

    user = db.query(User).filter(User.id == token_db.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(
        {"sub": str(user.id), "username": user.username, "role": user.role},
        ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Keep same refresh token
    return new_access, refresh_token


def logout_user(db: Session, refresh_token: str):
    token_db = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).first()

    if token_db:
        token_db.is_revoked = True
        db.commit()

    return True


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        user_id = payload.get("sub")
        token_type = payload.get("type")

        if token_type != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ==============================
# PASSWORD RESET FUNCTIONS
# ==============================

def request_password_reset(db: Session, email: str):
    """
    Handle forgot password request.
    Returns:
        - dict with success: True and message if email exists
        - Raises HTTPException if email doesn't exist
    """
    # Check if user exists with this email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # User doesn't exist
        raise HTTPException(
            status_code=404, 
            detail="No account found with this email address"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=403, 
            detail="This account is inactive. Please contact administrator."
        )
    
    # Generate reset token
    reset_token = generate_reset_token()
    
    # Set expiration 
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Save token to database
    db_token = PasswordResetToken(
        user_id=user.id,
        token=reset_token,
        expires_at=expires_at
    )
    
    db.add(db_token)
    db.commit()
    
    # Send email
    email_sent = send_reset_email(email, reset_token)
    
    if not email_sent:
        raise HTTPException(
            status_code=500,
            detail="Failed to send reset email. Please try again later."
        )
    
    return {
        "success": True,
        "message": "Password reset link has been sent to your email address",
        "email": email
    }


def verify_reset_token(db: Session, token: str):
    """Verify if reset token is valid"""
    db_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token,
        PasswordResetToken.is_used == False
    ).first()
    
    if not db_token:
        return None
    
    if db_token.expires_at < datetime.now(timezone.utc):
        return None
    
    return db_token


def reset_password(db: Session, token: str, new_password: str):
    """Reset user's password"""
    # Verify token
    db_token = verify_reset_token(db, token)
    
    if not db_token:
        raise HTTPException(
            status_code=400, 
            detail="Invalid or expired reset link. Please request a new one."
        )
    
    # Get user
    user = db.query(User).filter(User.id == db_token.user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if new password meets requirements
    if len(new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )
    
    # Update password
    user.hashed_password = hash_password(new_password)
    
    # Mark token as used
    db_token.is_used = True
    
    # Revoke all refresh tokens for this user 
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    
    db.commit()
    
    return {"success": True, "message": "Password has been reset successfully"}