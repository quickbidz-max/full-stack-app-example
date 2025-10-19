from sqlalchemy import Column, Integer, String, Text, DateTime, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    userName = Column(String(255), unique=True, nullable=True)
    password = Column(String(255), nullable=False)
    dob = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Product(Base):
    __tablename__ = "product"
    
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(String(255), nullable=False)
    quantity = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, server_default=func.now(), onupdate=func.now())
