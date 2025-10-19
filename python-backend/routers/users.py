from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import UserCreate, UserUpdate, UserResponse
from auth import get_password_hash, get_current_user

router = APIRouter(prefix="/user", tags=["users"])

@router.get("/", response_model=List[UserResponse])
async def get_all_users(db: Session = Depends(get_db)):
    """Get all users."""
    users = db.query(User).order_by(User.createdAt.desc()).all()
    return users

@router.post("/", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user."""
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
        password=hashed_password,
        dob=user_data.dob,
        phone=user_data.phone,
        address=user_data.address,
        city=user_data.city
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: int, 
    user_data: UserUpdate, 
    db: Session = Depends(get_db)
):
    """Update a user."""
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if email or username is already used by another user
    if user_data.email or user_data.userName:
        existing_user = db.query(User).filter(
            ((User.email == user_data.email) | (User.userName == user_data.userName)) &
            (User.id != user_id)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or Username already used"
            )
    
    # Update user fields
    update_data = user_data.dict(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data:
        update_data["password"] = get_password_hash(update_data["password"])
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return {"message": "User updated successfully"}

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a user (protected route)."""
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
