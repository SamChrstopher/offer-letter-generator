from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.auth_schema import LoginRequest, RegisterRequest, TokenResponse
from schemas.user_schema import UserResponse
from utils.dependencies import get_current_user
from pydantic import BaseModel
from services.auth_service import (
    login_user,
    register_user,
    refresh_access_token,
    logout_user,
    request_password_reset,
    reset_password,
    verify_reset_token
)
from schemas.password_reset_schema import ForgotPasswordRequest, ResetPasswordRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=UserResponse)
def get_profile(user=Depends(get_current_user)):
    return user


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, payload.username, payload.email, payload.password)
    return {"message": "User registered successfully", "user_id": user.id}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    access, refresh = login_user(db, payload.username, payload.password)
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    access, refresh = refresh_access_token(db, payload.refresh_token)
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(refresh_token: str, db: Session = Depends(get_db)):
    logout_user(db, refresh_token)
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Send password reset email.
    Returns 404 if email doesn't exist in the database.
    """
    result = request_password_reset(db, request.email)
    return result


@router.post("/reset-password")
async def reset_password_endpoint(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Reset password using token"""
    result = reset_password(db, request.token, request.new_password)
    return result


@router.get("/verify-reset-token/{token}")
async def verify_reset_token_endpoint(
    token: str,
    db: Session = Depends(get_db)
):
    """Verify if reset token is valid"""
    db_token = verify_reset_token(db, token)
    if not db_token:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"valid": True}