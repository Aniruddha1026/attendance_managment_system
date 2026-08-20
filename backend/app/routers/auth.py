from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse

router=APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/login",response_model=TokenResponse)
def login(login_data: LoginRequest, db: str = Depends(get_db)):
    statement=select(User).where(User.username == login_data.username)
    user=db.scalar(statement)

    if user is None:
        raise HTTPException(
            status=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials"
        )

    if not verify_password(login_data.password,user.password_hash):
        raise HTTPException(
            status=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials"
        )

    if not user.is_active:
        raise HTTPException(
            status=status.HTTP_403_UNAUTHORIZED,
            detail="User Account is inactive"
        )

    access_token=create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        }
    )

    return { 
        "access_token": access_token,
        "token_type": "bearer"
    }