# Express.js Backend API

This is a Node.js Express.js backend API that replicates the functionality of the NestJS backend. It includes JWT authentication, user management, and product management features.

## Features

- **Authentication**: JWT-based authentication with signup, login, and profile endpoints
- **User Management**: CRUD operations for users
- **Product Management**: CRUD operations for products with filtering, sorting, and pagination
- **Database**: MySQL database integration
- **Security**: Password hashing with bcrypt, JWT tokens, CORS, and Helmet

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires JWT token)
- `GET /auth/validate?token=<token>` - Validate JWT token

### Users
- `GET /user` - Get all users
- `POST /user` - Create new user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user (requires JWT token)

### Products
- `GET /product` - Get all products with filtering, sorting, and pagination (requires JWT token)
- `POST /product` - Create new product (requires JWT token)
- `PUT /product/:id` - Update product (requires JWT token)
- `DELETE /product/:id` - Delete product (requires JWT token)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3005
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345
DB_NAME=test_db
```

3. Make sure your MySQL database is running and create the database:
```sql
CREATE DATABASE test_db;
```

4. The application will automatically create the required tables when you start the server.

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3005 (or the port specified in your .env file).

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

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS enabled
- Helmet for security headers
- Input validation with express-validator
