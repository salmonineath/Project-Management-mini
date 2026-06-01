# Project Management (mini)

## 📌 Project Description

This project is a lightweight project management backend API that lets users create workspaces (projects), manage tasks within them, and collaborate through a clean RESTful interface. Think of it as a simplified Trello clone — minus the frontend.

The goal of this project is to demonstrate a solid understanding of the **NestJS framework** through practical implementation: modular architecture, JWT authentication, role-based route protection, data validation, and containerized deployment.

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- Password hashing with **bcrypt**
- **JWT**-based authentication
- Protected routes via global `JwtAuthGuard`
- `@Public()` decorator to opt out of auth on specific routes

### 📁 Projects
- Create, update, and delete projects
- Ownership enforcement — only the project creator can modify or delete it
- List all projects belonging to the authenticated user

### ✅ Tasks
- Create tasks within a project
- Assign and update task status (`TODO`, `IN_PROGRESS`, `DONE`)
- Update and delete tasks
- Ownership and project membership checks

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) + TypeScript |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | MariaDB |
| Auth | JWT + bcrypt |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |

---

## 🏗️ Architecture

This project follows a **feature-based modular monolith** architecture — each domain (auth, users, projects, tasks) is fully encapsulated in its own NestJS module with its own controller, service, and DTOs.

```
src/
├── features/
│   ├── auth/             # Register, login, JWT strategy
│   ├── users/            # User profile
│   ├── projects/         # Project CRUD
│   └── tasks/            # Task CRUD + status management
├── common/               # Shared guards, decorators, filters, pipes
├── config/               # Environment & app configuration
├── prisma/               # Prisma schema & migrations
├── app.module.ts
└── main.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js v18+ (for local development without Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskify-api.git
cd taskify-api
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# App
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="mysql://taskify_user:taskify_pass@db:3306/taskify_db"

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Run with Docker Compose

```bash
docker compose up --build
```

This spins up:
- **NestJS API** on port `3000`
- **MariaDB** on port `3306`
- **Nginx** reverse proxy on port `80`

### 4. Run Database Migrations

```bash
docker compose exec app npx prisma migrate deploy
```

### 5. (Optional) Open Prisma Studio

```bash
docker compose exec app npx prisma studio
```

---

## 💻 Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Start in watch mode
npm run start:dev
```

---

---

## 🗄️ Database Schema (Overview)

```
User
 ├── id, email, password, name
 └── projects[]

Project
 ├── id, title, description, ownerId
 └── tasks[]

Task
 ├── id, title, description, status
 ├── dueDate (optional)
 ├── projectId
 └── assignedTo (optional)
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📦 Project Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start in development (watch mode) |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

---

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---