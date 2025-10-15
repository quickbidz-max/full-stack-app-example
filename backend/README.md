# Backend API

A robust NestJS backend API with authentication, user management, and product management features.

## Features

- **JWT Authentication**: Secure login and signup with token-based authentication
- **User Management**: Complete CRUD operations for user accounts
- **Product Management**: Full product inventory management with CRUD operations
- **Protected Routes**: JWT guards for secure API endpoints
- **Database Integration**: TypeORM with PostgreSQL/MySQL support
- **Validation**: Request validation with DTOs
- **Error Handling**: Comprehensive error handling and responses

## Tech Stack

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **TypeORM**: Object-Relational Mapping
- **JWT**: JSON Web Tokens for authentication
- **Class Validator**: Request validation
- **Class Transformer**: Data transformation

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt/             # JWT guard and strategy
│       └── jwt.guard.ts
├── user/                 # User management module
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.module.ts
│   ├── entity/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create.user.dto.ts
│       └── update.user.dto.ts
├── product/              # Product management module
│   ├── product.controller.ts
│   ├── product.service.ts
│   ├── product.module.ts
│   ├── entity/
│   │   └── product.entity.ts
│   └── dto/
│       ├── create.product.dto.ts
│       └── update.product.dto.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL or MySQL database
- Redis (optional, for session management)

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=3005
```

5. Run database migrations:
```bash
npm run migration:run
```

6. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3005`

## API Documentation

### Authentication Endpoints

#### Public Endpoints (No Authentication Required)

- **POST** `/auth/signup` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "userName": "johndoe",
    "password": "password123"
  }
  ```

- **POST** `/auth/login` - User login
  ```json
  {
    "emailOrUsername": "john@example.com",
    "password": "password123"
  }
  ```

#### Protected Endpoints (JWT Token Required)

- **GET** `/auth/profile` - Get user profile
  - Headers: `Authorization: Bearer <token>`

### User Management Endpoints

#### Public Endpoints

- **GET** `/user` - Get all users
- **POST** `/user` - Create new user
- **PUT** `/user/:id` - Update user by ID

#### Protected Endpoints

- **DELETE** `/user/:id` - Delete user by ID
  - Headers: `Authorization: Bearer <token>`

### Product Management Endpoints

#### All Protected Endpoints (JWT Token Required)

- **GET** `/product` - Get all products
- **POST** `/product` - Create new product
- **PUT** `/product/:id` - Update product by ID
- **DELETE** `/product/:id` - Delete product by ID

All product endpoints require authentication:
- Headers: `Authorization: Bearer <token>`

#### Product Schema
```json
{
  "product_name": "Product Name",
  "description": "Product description",
  "price": "99.99",
  "quantity": "10",
  "category": "Electronics"
}
```

## Authentication Flow

1. **Registration**: User signs up via `/auth/signup`
2. **Login**: User authenticates via `/auth/login`
3. **Token**: JWT token is returned upon successful authentication
4. **Protected Routes**: Include token in `Authorization: Bearer <token>` header
5. **Token Validation**: JWT guard validates token on protected endpoints

## Database Schema

### User Entity
```typescript
{
  id: number (Primary Key)
  name: string
  email: string (Unique)
  userName: string (Unique)
  password: string (Hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Product Entity
```typescript
{
  id: number (Primary Key)
  product_name: string
  description: string
  price: string
  quantity: string
  category: string
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Route Guards**: JWT guards protect sensitive endpoints
- **Input Validation**: DTO validation for all requests
- **CORS**: Configurable Cross-Origin Resource Sharing

## Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug         # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage
npm run test:watch         # Run tests in watch mode

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3005 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |

## Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t backend-api .
```

2. Run the container:
```bash
docker run -p 3005:3005 backend-api
```

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start in production mode:
```bash
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.