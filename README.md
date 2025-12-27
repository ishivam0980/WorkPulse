# WorkPulse - B2B Team Project Management Platform

WorkPulse is a full-stack Software-as-a-Service (SaaS) application designed for B2B team collaboration and project management. Built with modern web technologies, it provides organizations with tools to manage workspaces, projects, tasks, and team members with granular role-based access control.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technical Highlights](#technical-highlights)

## Overview

WorkPulse addresses the need for efficient team collaboration in modern organizations. The platform enables teams to create isolated workspaces, organize work into projects, track tasks through customizable workflows, and manage team members with appropriate access levels.

The application follows a client-server architecture with a RESTful API backend and a single-page application frontend. It implements industry-standard security practices including OAuth 2.0 authentication, session management, and role-based access control.

## Technology Stack

### Backend

| Technology     | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| Node.js        | JavaScript runtime environment                         |
| Express.js     | Web application framework                              |
| TypeScript     | Static type checking and enhanced developer experience |
| MongoDB        | NoSQL document database                                |
| Mongoose       | Object Data Modeling (ODM) library                     |
| Passport.js    | Authentication middleware                              |
| Zod            | Schema validation library                              |
| Cookie-Session | Session management                                     |
| Socket.IO      | Real-time bidirectional event-based communication      |

### Frontend

| Technology           | Purpose                                   |
| -------------------- | ----------------------------------------- |
| React 18             | Component-based user interface library    |
| TypeScript           | Static type checking                      |
| Vite                 | Build tool and development server         |
| React Router v7      | Client-side routing                       |
| TanStack React Query | Server state management and data fetching |
| Zustand              | Client state management                   |
| Tailwind CSS         | Utility-first CSS framework               |
| Shadcn/UI            | Accessible component library              |
| Axios                | HTTP client                               |

## Features

### Workspace Management

- Create and manage multiple workspaces
- Workspace-level settings and configuration
- Invite team members via shareable invite links
- Workspace analytics and activity overview

### Project Management

- Create projects within workspaces
- Project-level task organization
- Progress tracking with visual indicators
- Project analytics including task completion rates

### Task Management

- Create, update, and delete tasks
- Assign tasks to team members
- Set task priority levels (Low, Medium, High)
- Track task status through workflow stages (Backlog, To Do, In Progress, In Review, Done)
- Set due dates and track overdue tasks
- Filter and search tasks by multiple criteria
- Table and Kanban board views

### Team Collaboration

- Invite members to workspaces
- Role-based access control with three roles (Owner, Admin, Member)
- 16 granular permissions for fine-grained access control
- Member management and role assignment

### User Experience

- Responsive design for desktop and mobile devices
- Dark mode and light mode themes
- Global search functionality with keyboard shortcuts
- Real-time form validation
- Loading states and skeleton loaders
- Error handling with user-friendly messages

## System Architecture

```
Client (React SPA)
       |
       | HTTPS (REST API)
       v
Express.js Server
       |
       | Mongoose ODM
       v
MongoDB Database
```

### Request Flow

1. Client sends HTTP request with session cookie
2. Express middleware validates session and authenticates user
3. Route handler processes request with input validation
4. Service layer executes business logic
5. Database operations performed via Mongoose models
6. Response returned to client with appropriate status code

## Database Schema

### Collections

**Users**

- Stores user profile information
- References current workspace
- Supports multiple authentication providers

**Accounts**

- Manages authentication provider details
- Supports local authentication and OAuth providers
- Links to user documents

**Workspaces**

- Contains workspace metadata
- Stores unique invite codes
- References owner user

**Members**

- Junction collection for user-workspace relationships
- Stores role assignments
- Tracks join dates

**Projects**

- Belongs to a workspace
- Contains project metadata and emoji identifiers
- References creator user

**Tasks**

- Belongs to a workspace and project
- Stores task details including title, description, status, priority
- References assigned user and creator
- Tracks due dates

**Roles and Permissions**

- Defines available roles
- Maps permissions to roles
- Used for authorization checks

## Authentication and Authorization

### Authentication Methods

**Local Authentication**

- Email and password-based registration and login
- Passwords hashed using bcrypt with salt rounds
- Session-based authentication with HTTP-only cookies

**OAuth 2.0 (Google)**

- Google Sign-In integration
- Automatic account creation for new OAuth users
- Account linking for existing users

### Authorization Model

The application implements Role-Based Access Control (RBAC) with the following hierarchy:

**Owner**

- Full access to all workspace features
- Can delete workspace
- Can manage all members including admins

**Admin**

- Can manage projects and tasks
- Can invite and remove members
- Cannot delete workspace or manage owners

**Member**

- Can view workspace content
- Can create and manage own tasks
- Limited administrative capabilities

### Permission Types

| Permission                | Description                       |
| ------------------------- | --------------------------------- |
| CREATE_WORKSPACE          | Create new workspaces             |
| EDIT_WORKSPACE            | Modify workspace settings         |
| DELETE_WORKSPACE          | Delete workspace and all contents |
| MANAGE_WORKSPACE_SETTINGS | Access workspace configuration    |
| ADD_MEMBER                | Invite new members                |
| CHANGE_MEMBER_ROLE        | Modify member roles               |
| REMOVE_MEMBER             | Remove members from workspace     |
| CREATE_PROJECT            | Create new projects               |
| EDIT_PROJECT              | Modify project details            |
| DELETE_PROJECT            | Remove projects                   |
| CREATE_TASK               | Create new tasks                  |
| EDIT_TASK                 | Modify task details               |
| DELETE_TASK               | Remove tasks                      |
| VIEW_ONLY                 | Read-only access                  |

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /auth/register        | Register new user      |
| POST   | /auth/login           | Login with credentials |
| POST   | /auth/logout          | End user session       |
| GET    | /auth/google          | Initiate Google OAuth  |
| GET    | /auth/google/callback | Google OAuth callback  |

### User Endpoints

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | /user/current | Get authenticated user |
| PUT    | /user/current | Update user profile    |

### Workspace Endpoints

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | /workspace/create/new      | Create workspace        |
| GET    | /workspace/all             | Get user workspaces     |
| GET    | /workspace/:id             | Get workspace by ID     |
| PUT    | /workspace/update/:id      | Update workspace        |
| DELETE | /workspace/delete/:id      | Delete workspace        |
| GET    | /workspace/members/:id     | Get workspace members   |
| GET    | /workspace/analytics/:id   | Get workspace analytics |
| PUT    | /workspace/change-role/:id | Change member role      |

### Project Endpoints

| Method | Endpoint                               | Description           |
| ------ | -------------------------------------- | --------------------- |
| POST   | /project/workspace/:workspaceId/create | Create project        |
| GET    | /project/workspace/:workspaceId/all    | Get all projects      |
| GET    | /project/:workspaceId/:id              | Get project by ID     |
| PUT    | /project/:workspaceId/update/:id       | Update project        |
| DELETE | /project/:workspaceId/delete/:id       | Delete project        |
| GET    | /project/:workspaceId/:id/analytics    | Get project analytics |

### Task Endpoints

| Method | Endpoint                                                   | Description    |
| ------ | ---------------------------------------------------------- | -------------- |
| POST   | /task/project/:projectId/workspace/:workspaceId/create     | Create task    |
| GET    | /task/workspace/:workspaceId/all                           | Get all tasks  |
| GET    | /task/:workspaceId/project/:projectId/:id                  | Get task by ID |
| PUT    | /task/project/:projectId/workspace/:workspaceId/update/:id | Update task    |
| DELETE | /task/workspace/:workspaceId/delete/:id                    | Delete task    |

### Member Endpoints

| Method | Endpoint                           | Description               |
| ------ | ---------------------------------- | ------------------------- |
| POST   | /member/workspace/:inviteCode/join | Join workspace via invite |

## Installation

### Prerequisites

- Node.js version 18 or higher
- npm or yarn package manager
- MongoDB database (local or Atlas)
- Google Cloud Console project (for OAuth)

### Clone Repository

```bash
git clone <repository-url>
cd WorkPulse
```

### Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Environment Configuration

### Backend Configuration

Create a file named `.env.local` in the `/backend` directory:

```env
PORT=8000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/workpulse_db

SESSION_SECRET=<random-secret-string>
SESSION_EXPIRES_IN=1d

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/google/callback
```

### Frontend Configuration

Create a file named `.env.local` in the `/client` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Google OAuth Setup

1. Navigate to Google Cloud Console
2. Create a new project or select existing
3. Enable the Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized JavaScript origins: `http://localhost:5173`
7. Add authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
8. Copy Client ID and Client Secret to environment variables

## Running the Application

### Development Mode

```bash
# Terminal 1 - Start backend server
cd backend
npm run seed  # Run once to seed roles
npm run dev

# Terminal 2 - Start frontend development server
cd client
npm run dev
```

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd client
npm run build
```

### Docker Deployment

The easiest way to run WorkPulse in production is using Docker:

```bash
# 1. Copy environment file and configure
cp .env.docker.example .env

# 2. Build and start all services
docker-compose up --build -d

# 3. Seed the database (first time only)
docker-compose exec backend node dist/index.js
# Then in another terminal:
docker-compose exec mongodb mongosh workpulse_db --eval "db.roles.find()"
```

**Docker Services:**
- **MongoDB**: Database on port 27017
- **Backend**: API server on port 8000
- **Frontend**: Nginx server on port 80

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

## Project Structure

```
WorkPulse/
├── backend/
│   ├── src/
│   │   ├── @types/          # TypeScript type definitions
│   │   ├── config/          # Application configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── enums/           # Enumeration definitions
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── seeders/         # Database seeders
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Utility functions
│   │   ├── validation/      # Input validation schemas
│   │   └── index.ts         # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── task/        # Task-related components
│   │   │   ├── workspace/   # Workspace components
│   │   │   └── ...
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── api/         # API integration hooks
│   │   ├── layout/          # Layout components
│   │   ├── lib/             # Utility libraries
│   │   ├── page/            # Page components
│   │   ├── routes/          # Route configuration
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Application entry
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Technical Highlights

### Backend Architecture

**Layered Architecture**

- Controllers handle HTTP request/response
- Services contain business logic
- Models define data structure and database operations
- Clear separation of concerns for maintainability

**Error Handling**

- Centralized error handling middleware
- Custom error classes for different error types
- Consistent error response format across API

**Input Validation**

- Zod schemas for request validation
- Type-safe validation with TypeScript integration
- Detailed validation error messages

**Security Measures**

- HTTP-only session cookies
- CORS configuration for cross-origin requests
- Password hashing with bcrypt
- Environment-based configuration

### Frontend Architecture

**State Management Strategy**

- TanStack React Query for server state (API data)
- Zustand for client state (UI state, dialogs)
- Optimistic updates for better user experience

**Component Design**

- Reusable UI components with Shadcn/UI
- Compound component patterns
- Accessible components following WAI-ARIA guidelines

**Performance Optimizations**

- Code splitting with React Router
- Lazy loading for route components
- Debounced search inputs
- Skeleton loaders for perceived performance

**Type Safety**

- End-to-end TypeScript implementation
- Shared type definitions for API responses
- Strict TypeScript configuration

### Development Practices

- Git version control with meaningful commit messages
- Environment-based configuration
- Consistent code formatting
- Modular and scalable project structure
