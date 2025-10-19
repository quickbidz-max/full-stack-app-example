from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserSignup, UserLogin, Token, UserResponse
from auth import authenticate_user, create_access_token, get_password_hash, get_current_user, validate_token

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=dict)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """User registration endpoint."""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.userName == user_data.userName)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or Username already used"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create new user
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        userName=user_data.userName,
        password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Signup successful"}

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """User login endpoint."""
    user = authenticate_user(db, user_credentials.emailOrUsername, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    
    # Return user without password
    user_dict = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "userName": user.userName,
        "dob": user.dob,
        "phone": user.phone,
        "address": user.address,
        "city": user.city,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt
    }
    
    return {
        "access_token": access_token,
        "user": user_dict
    }

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user

@router.get("/validate")
async def validate(token: str):
    """Validate JWT token."""
    return validate_token(token)
