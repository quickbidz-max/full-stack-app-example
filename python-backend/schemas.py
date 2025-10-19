from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    userName: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    userName: Optional[str] = None
    password: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None

class UserResponse(UserBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    product_name: str
    description: str
    price: str
    quantity: str
    category: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    quantity: Optional[str] = None
    category: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class UserSignup(BaseModel):
    name: str
    email: str
    userName: str
    password: str

class UserLogin(BaseModel):
    emailOrUsername: str
    password: str

class Token(BaseModel):
    access_token: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    sub: Optional[int] = None

# Product query schema
class ProductQuery(BaseModel):
    search: Optional[str] = None
    sortBy: Optional[str] = "createdAt"
    sortOrder: Optional[str] = "DESC"
    page: Optional[int] = 1
    limit: Optional[int] = 10

class ProductListResponse(BaseModel):
    data: list[ProductResponse]
    total: int
    page: int
    limit: int
    totalPages: int
