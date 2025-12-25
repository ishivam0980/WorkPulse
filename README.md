# WorkPulse

A powerful B2B team project management SaaS application built with the MERN stack.

## 🚀 Features

- 🔐 Authentication (Google OAuth & Email/Password)
- 🏢 Multi-workspace management
- 📊 Projects & Task tracking
- ✅ Task management with status, priority & assignments
- 👥 Role-based access control (Owner, Admin, Member)
- ✉️ Invite members via invite code
- 📈 Analytics dashboard
- 🔍 Advanced filtering & search

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Google OAuth & Local)
- TypeScript
- Zod validation

### Frontend
- React 18 + Vite
- TailwindCSS + Shadcn/UI
- React Query (TanStack)
- React Router v7
- TypeScript
- Zustand

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run seed  # Seeds the roles
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

## 📄 License

MIT
