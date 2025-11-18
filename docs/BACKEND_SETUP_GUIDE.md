# Backend Setup & Migration Guide - Summary

## What Was Created

### 1. Comprehensive Backend README (`api/README.md`)

**New Sections Added:**

- ✅ **Quick Start Guide** - Step-by-step setup instructions
- ✅ **PostgreSQL Setup Options** - Docker vs Manual installation
- ✅ **Migration Instructions** - How to use `runMigrations.js`
- ✅ **Database Seeding Guide** - Creating test accounts and data
- ✅ **Default Test Accounts** - Credentials for admin, foster, interviewer
- ✅ **Troubleshooting Section** - Common issues and solutions
- ✅ **Role-Based Access Control Details** - Complete RBAC documentation
- ✅ **Application Workflow** - Visual workflow diagram
- ✅ **Testing Examples** - cURL and Postman examples
- ✅ **Project Structure** - Directory layout explanation
- ✅ **Development Tips** - Hot reload, database reset, environment variables

### 2. Quick Start Guide (`QUICKSTART.md`)

A separate quick reference guide for getting started in minutes:

- Fast setup instructions
- Test account credentials table
- Common troubleshooting
- Docker setup option
- Environment variables reference

## Key Improvements

### Migration Process

**Before:**

```bash
npm run migrate  # Unclear what this does
npm run seed    # Unclear what this creates
```

**After:**

```bash
# Clear, explicit commands
node src/migrations/runMigrations.js  # Creates all tables

node src/seeds/seedVolunteers.js      # Creates test accounts
node src/seeds/seedAnimals.js         # Creates sample animals
node src/seeds/seedApplications.js    # Creates sample applications
```

### Database Setup

**New Options:**

1. **Docker (Recommended)**

   ```bash
   cd infra
   docker-compose up -d postgres
   ```

2. **Manual Setup**
   ```bash
   psql -U postgres -c "CREATE DATABASE sfp_portal;"
   ```

### Test Accounts Documentation

| Role        | Email               | Password       | Capabilities              |
| ----------- | ------------------- | -------------- | ------------------------- |
| Admin       | admin@sfp.com       | admin123       | Full access, approve apps |
| Foster      | foster@sfp.com      | foster123      | Manage animals            |
| Interviewer | interviewer@sfp.com | interviewer123 | Manage interviews         |

## Running the Backend

### Development Mode

```bash
cd api
pnpm dev
```

Server starts on: http://localhost:5001

Features:

- ✅ Auto-reload on file changes
- ✅ Automatic migrations on startup
- ✅ Detailed console logging
- ✅ CORS enabled for frontend

### Production Mode

```bash
cd api
pnpm start
```

## Troubleshooting Quick Reference

### Database Connection Failed

```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Verify credentials in .env
```

### Port Already in Use

```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Migration Errors

```bash
# Reset database
psql -U postgres -c "DROP DATABASE sfp_portal;"
psql -U postgres -c "CREATE DATABASE sfp_portal;"
node src/migrations/runMigrations.js
```

### Cannot Login

```bash
# Re-seed volunteers
node src/seeds/seedVolunteers.js
```

## API Testing

### Health Check

```bash
curl http://localhost:5001/api/health
```

### Login Example

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sfp.com", "password": "admin123"}'
```

### Protected Endpoint

```bash
curl http://localhost:5001/api/animals \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Complete Setup Flow

```bash
# 1. Install dependencies
cd api && pnpm install

# 2. Setup PostgreSQL (Docker)
cd ../infra && docker-compose up -d postgres

# 3. Configure environment
cd ../api
# Create .env with database credentials

# 4. Run migrations
node src/migrations/runMigrations.js

# 5. Seed data
node src/seeds/seedVolunteers.js
node src/seeds/seedAnimals.js
node src/seeds/seedApplications.js

# 6. Start server
pnpm dev
```

## Documentation Structure

```
SFP-Portal/
├── QUICKSTART.md              # Quick setup guide (NEW)
├── api/
│   └── README.md              # Complete backend docs (UPDATED)
├── web/
│   └── README.md              # Frontend documentation
├── docs/
│   ├── APPLICATION_WORKFLOW_IMPLEMENTATION.md
│   ├── ROLE_PERMISSIONS_GUIDE.md
│   ├── MOCK_DATA_REMOVAL.md
│   └── ANIMAL_STATUS_FORMATTING.md
└── tests/
    └── README.md              # Testing guide
```

## What Developers Should Know

### 1. Migrations Are Automatic

- Migrations run automatically when you start the server
- No need for manual migration commands in most cases
- Use `node src/migrations/runMigrations.js` for manual control

### 2. Seeding Is Optional

- Seeding creates test data for development
- Not required for production
- Safe to run multiple times (uses upsert)

### 3. Environment Variables Matter

- `.env` file must exist in `api/` directory
- Critical variables: DB credentials, JWT_SECRET, PORT
- Frontend needs `VITE_API_BASE_URL` to connect

### 4. Database Reset Process

```bash
# Complete reset
psql -U postgres -c "DROP DATABASE sfp_portal;"
psql -U postgres -c "CREATE DATABASE sfp_portal;"
node src/migrations/runMigrations.js
node src/seeds/seedVolunteers.js
node src/seeds/seedAnimals.js
```

## Related Documentation

- [API README](../api/README.md) - Complete backend documentation
- [Quick Start Guide](../QUICKSTART.md) - Fast setup instructions
- [Application Workflow](../docs/APPLICATION_WORKFLOW_IMPLEMENTATION.md)
- [Role Permissions](../docs/ROLE_PERMISSIONS_GUIDE.md)
- [Mock Data Removal](../docs/MOCK_DATA_REMOVAL.md)

## Summary

✅ **Comprehensive backend README** with setup, migrations, seeding, and troubleshooting  
✅ **Quick Start Guide** for fast setup  
✅ **Clear migration process** using `runMigrations.js`  
✅ **Database setup options** (Docker and manual)  
✅ **Test account documentation** with credentials  
✅ **Troubleshooting guide** for common issues  
✅ **API testing examples** using cURL  
✅ **Role-based access control** documentation  
✅ **Application workflow** visualization  
✅ **Development tips** and best practices

The backend is now fully documented and easy to set up for new developers! 🎉
