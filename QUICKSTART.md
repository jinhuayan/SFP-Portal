# SFP Portal - Quick Start Guide

Get the Save Fur Pets (SFP) Animal Management System up and running in minutes!

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- pnpm (recommended)

## 🚀 Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd SFP-Portal

# Install dependencies for both frontend and backend
cd api && pnpm install
cd ../web && pnpm install
```

### 2. Database Setup

**Option A: Docker (Easiest)**

```bash
cd infra
docker-compose up -d postgres
```

**Option B: Local PostgreSQL**

```bash
# Start PostgreSQL service
brew services start postgresql@14  # macOS
# or
sudo systemctl start postgresql     # Linux

# Create database
psql -U postgres -c "CREATE DATABASE sfp_portal;"
```

### 3. Configure Environment

**Backend** (`api/.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sfp_portal
DB_USER=sfp_user
DB_PASSWORD=sfp_password
PORT=5001
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

**Frontend** (`web/.env`):

```env
VITE_API_BASE_URL=http://localhost:5001
```

### 4. Initialize Database & Seed Data

```bash
cd api

# Run migrations (creates tables)
node src/migrations/runMigrations.js

# Seed with sample data
node src/seeds/seedVolunteers.js
node src/seeds/seedAnimals.js
node src/seeds/seedApplications.js
```

### 5. Start the Application

**Terminal 1 - Backend:**

```bash
cd api
pnpm dev
```

**Terminal 2 - Frontend:**

```bash
cd web
pnpm dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 🔑 Test Accounts

After seeding, you can login with:

| Role        | Email                 | Password         | Access            |
| ----------- | --------------------- | ---------------- | ----------------- |
| Admin       | `admin@sfp.com`       | `admin123`       | Full access       |
| Foster      | `foster@sfp.com`      | `foster123`      | Manage animals    |
| Interviewer | `interviewer@sfp.com` | `interviewer123` | Manage interviews |

## ✅ Verify Setup

1. **Check Backend**: http://localhost:5001/api/health

   - Should return: `{"status": "OK"}`

2. **Check Frontend**: http://localhost:5173

   - Should show the home page

3. **Login**: Click "Login" and use admin credentials

   - Email: `admin@sfp.com`
   - Password: `admin123`

4. **View Animals**: Navigate to "Adoptables"
   - Should show seeded animals

## 🛠️ Common Issues

### Port Already in Use

```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
brew services list  # macOS
# or
sudo systemctl status postgresql  # Linux

# Verify database exists
psql -U postgres -l | grep sfp_portal
```

### Migration Errors

```bash
# Reset database
psql -U postgres -c "DROP DATABASE sfp_portal;"
psql -U postgres -c "CREATE DATABASE sfp_portal;"

# Re-run migrations
cd api
node src/migrations/runMigrations.js
```

### Cannot Login

```bash
# Re-seed volunteers
cd api
node src/seeds/seedVolunteers.js
```

## 📚 Next Steps

- [Backend Documentation](api/README.md)
- [Frontend Documentation](web/README.md)
- [Application Workflow Guide](docs/APPLICATION_WORKFLOW_IMPLEMENTATION.md)
- [Role Permissions Guide](docs/ROLE_PERMISSIONS_GUIDE.md)
- [API Testing Guide](tests/README.md)

## 🎯 Key Features to Try

1. **Browse Animals**: Go to http://localhost:5173/adoptables
2. **Submit Application**: Click on an animal → "Apply to Adopt"
3. **Admin Dashboard**: Login as admin → Go to Dashboard
4. **Manage Applications**: Login as admin/interviewer → "Manage Applications"
5. **Schedule Interview**: Select an application → "Schedule Interview"
6. **Animal Management**: Login as admin/foster → "Manage Animals"

## 🧪 Development Workflow

```bash
# Start both services in watch mode
# Terminal 1
cd api && pnpm dev

# Terminal 2
cd web && pnpm dev

# Make changes to code - both will auto-reload!
```

## 🐳 Using Docker (Full Stack)

```bash
# Start everything with Docker
cd infra
docker-compose up -d

# Access:
# - Frontend: http://localhost:80
# - Backend: http://localhost:5001
```

## 📝 Environment Variables Reference

### Backend (api/.env)

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: sfp_portal)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `PORT` - API server port (default: 5001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (web/.env)

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5001)

## 🎉 You're All Set!

Your SFP Portal is now running. Check out the documentation for more advanced features and deployment instructions.

**Need Help?**

- [API Documentation](api/README.md)
- [Frontend Documentation](web/README.md)
- [Troubleshooting Guide](api/README.md#troubleshooting)
