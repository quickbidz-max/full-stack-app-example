# Frontend Application

A modern React/Next.js frontend application with authentication and CRUD operations.

## Features

- **Authentication**: Login and signup with JWT token management
- **Protected Routes**: Automatic redirection based on authentication status
- **Dashboard**: Overview of user information and quick actions
- **User Profile**: Edit user information with form validation
- **Products Management**: Full CRUD operations for products
- **Responsive Design**: Mobile-friendly interface using Ant Design components

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Ant Design**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form handling and validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3005`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/          # Reusable components
│   ├── Navigation.tsx   # Main navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── services/            # API services
│   └── api.ts          # Axios configuration and interceptors
├── login/              # Login page
├── signup/             # Signup page
├── dashboard/          # Dashboard page
├── profile/            # User profile page
├── products/           # Products management page
├── layout.tsx          # Root layout with providers
└── page.tsx            # Home page with redirects
```

## Authentication Flow

1. **Login/Signup**: Users can authenticate via `/login` or `/signup` pages
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Protected Routes**: Routes are automatically protected and redirect to login if not authenticated
4. **API Integration**: All API calls include the Bearer token in Authorization header
5. **Token Expiration**: Automatic logout and redirect to login on token expiration

## API Integration

The application integrates with the backend API at `http://localhost:3005`:

- **Authentication**: `/auth/login`, `/auth/signup`, `/auth/profile`
- **Users**: `/user/*` (CRUD operations)
- **Products**: `/product/*` (CRUD operations)

## Key Features

### Protected Routes
- Automatic redirection to login for unauthenticated users
- Loading states during authentication checks
- Seamless navigation between protected pages

### Form Validation
- Client-side validation using Ant Design Form components
- Real-time validation feedback
- Server-side error handling

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface

### Error Handling
- Network error handling
- Token expiration handling
- User-friendly error messages

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3005
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.