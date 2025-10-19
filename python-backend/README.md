# FastAPI Backend API

This is a Python FastAPI backend that replicates the functionality of the NestJS and Express.js backends. It includes JWT authentication, user management, and product management features.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs with Python
- **JWT Authentication**: Secure token-based authentication
- **User Management**: CRUD operations for users
- **Product Management**: CRUD operations for products with filtering, sorting, and pagination
- **MySQL Database**: SQLAlchemy ORM with MySQL database
- **Auto Documentation**: Automatic OpenAPI/Swagger documentation
- **Type Safety**: Full Python type hints with Pydantic models

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires JWT token)
- `GET /auth/validate?token=<token>` - Validate JWT token

### Users
- `GET /user/` - Get all users
- `POST /user/` - Create new user
- `PUT /user/{id}` - Update user
- `DELETE /user/{id}` - Delete user (requires JWT token)

### Products
- `GET /product/` - Get all products with filtering, sorting, and pagination (requires JWT token)
- `POST /product/` - Create new product (requires JWT token)
- `PUT /product/{id}` - Update product (requires JWT token)
- `DELETE /product/{id}` - Delete product (requires JWT token)

## Installation

1. **Install Python dependencies:**
```bash
cd python-backend
pip install -r requirements.txt
```

2. **Create environment file:**
Create a `.env` file with:
```
PORT=3006
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345
DB_NAME=test_db
```

3. **Make sure your MySQL database is running and create the database:**
```sql
CREATE DATABASE test_db;
```

4. **The application will automatically create the required tables when you start the server.**

## Running the Application

### Development
```bash
python main.py
```

### Using Uvicorn directly
```bash
uvicorn main:app --host 0.0.0.0 --port 3006 --reload
```

The server will start on port 3006 (or the port specified in your .env file).

## API Documentation

Once the server is running, you can access:
- **Swagger UI**: http://localhost:3006/docs
- **ReDoc**: http://localhost:3006/redoc

## Database Schema

### User Table
- id (Primary Key)
- name
- email (Unique)
- userName (Unique)
- password (Hashed)
- dob
- phone
- address
- city
- createdAt
- updatedAt

### Product Table
- id (Primary Key)
- product_name
- description
- price
- quantity
- category
- createdAt
- updatedAt

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Features

### FastAPI Advantages
- **Automatic Documentation**: Interactive API docs at `/docs`
- **Type Safety**: Full Python type hints with automatic validation
- **High Performance**: One of the fastest Python frameworks
- **Modern**: Built for Python 3.7+ with async support
- **Easy Testing**: Built-in test client

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS enabled
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy ORM

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Development

### Project Structure
```
python-backend/
├── main.py                 # FastAPI application
├── config.py              # Configuration settings
├── database.py            # Database connection
├── models.py              # SQLAlchemy models
├── schemas.py             # Pydantic schemas
├── auth.py                # Authentication utilities
├── routers/               # API route handlers
│   ├── __init__.py
│   ├── auth.py           # Authentication routes
│   ├── users.py          # User management routes
│   └── products.py       # Product management routes
├── requirements.txt       # Python dependencies
└── README.md             # This file
```
