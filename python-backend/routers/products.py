from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
from database import get_db
from models import Product, User
from schemas import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from auth import get_current_user

router = APIRouter(prefix="/product", tags=["products"])

@router.get("/", response_model=ProductListResponse)
async def get_products(
    search: Optional[str] = Query(None, description="Search in product name"),
    sortBy: Optional[str] = Query("createdAt", description="Sort by field"),
    sortOrder: Optional[str] = Query("DESC", description="Sort order (ASC/DESC)"),
    page: Optional[int] = Query(1, ge=1, description="Page number"),
    limit: Optional[int] = Query(10, ge=1, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all products with filtering, sorting, and pagination (protected route)."""
    
    # Build query
    query = db.query(Product)
    
    # Apply search filter
    if search:
        query = query.filter(Product.product_name.like(f"%{search}%"))
    
    # Get total count
    total = query.count()
    
    # Apply sorting
    if sortBy in ["product_name", "category", "price", "quantity", "createdAt", "updatedAt"]:
        if sortOrder == "ASC":
            query = query.order_by(asc(getattr(Product, sortBy)))
        else:
            query = query.order_by(desc(getattr(Product, sortBy)))
    else:
        query = query.order_by(desc(Product.createdAt))
    
    # Apply pagination
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    # Calculate total pages
    total_pages = (total + limit - 1) // limit
    
    return ProductListResponse(
        data=products,
        total=total,
        page=page,
        limit=limit,
        totalPages=total_pages
    )

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new product (protected route)."""
    
    # Create new product
    db_product = Product(
        product_name=product_data.product_name,
        description=product_data.description,
        price=product_data.price,
        quantity=product_data.quantity,
        category=product_data.category
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@router.put("/{product_id}", response_model=dict)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a product (protected route)."""
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update product fields
    update_data = product_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return {"message": "Product updated successfully"}

@router.delete("/{product_id}", response_model=dict)
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a product (protected route)."""
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}
