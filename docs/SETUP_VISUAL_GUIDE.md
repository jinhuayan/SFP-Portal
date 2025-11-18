# SFP Portal Backend - Setup Visual Guide

## 📋 Complete Setup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   SFP Portal Backend Setup                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: Prerequisites
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Node.js v18 │  │PostgreSQL v14│  │     pnpm     │
│     ✅       │  │      ✅      │  │      ✅      │
└──────────────┘  └──────────────┘  └──────────────┘

                        ⬇️

Step 2: Install Dependencies
┌────────────────────────────────────────────────────────────────┐
│  cd api && pnpm install                                         │
│                                                                 │
│  Installing:                                                    │
│  ✅ Express - Web framework                                    │
│  ✅ Sequelize - ORM                                            │
│  ✅ pg - PostgreSQL driver                                     │
│  ✅ jsonwebtoken - Authentication                              │
│  ✅ bcrypt - Password hashing                                  │
└────────────────────────────────────────────────────────────────┘

                        ⬇️

Step 3: Database Setup (Choose One)
┌─────────────────────────┐    OR    ┌─────────────────────────┐
│  🐳 Docker (Easy)       │          │  💻 Manual Setup        │
│                         │          │                         │
│  cd infra               │          │  psql -U postgres       │
│  docker-compose up -d   │          │  CREATE DATABASE        │
│                         │          │  sfp_portal;            │
└─────────────────────────┘          └─────────────────────────┘

                        ⬇️

Step 4: Configure Environment
┌────────────────────────────────────────────────────────────────┐
│  Create: api/.env                                              │
│                                                                 │
│  DB_HOST=localhost                                             │
│  DB_PORT=5432                                                  │
│  DB_NAME=sfp_portal                                            │
│  DB_USER=sfp_user                                              │
│  DB_PASSWORD=your_password                                     │
│  PORT=5001                                                     │
│  JWT_SECRET=your_secret_key                                    │
│  NODE_ENV=development                                          │
└────────────────────────────────────────────────────────────────┘

                        ⬇️

Step 5: Run Migrations
┌────────────────────────────────────────────────────────────────┐
│  node src/migrations/runMigrations.js                          │
│                                                                 │
│  Creating tables:                                              │
│  ✅ volunteers - User accounts                                │
│  ✅ animals - Animal profiles                                 │
│  ✅ applications - Adoption applications                       │
│  ✅ interviews - Interview records                             │
│  ✅ contracts - Adoption contracts                             │
│  ✅ Setting up relationships & foreign keys                    │
└────────────────────────────────────────────────────────────────┘

                        ⬇️

Step 6: Seed Test Data (Optional)
┌────────────────────────────────────────────────────────────────┐
│  node src/seeds/seedVolunteers.js                              │
│  → Creates: admin@sfp.com / admin123                           │
│  → Creates: foster@sfp.com / foster123                         │
│  → Creates: interviewer@sfp.com / interviewer123               │
│                                                                 │
│  node src/seeds/seedAnimals.js                                 │
│  → Creates: 10+ sample animals (cats, dogs, rabbits)           │
│                                                                 │
│  node src/seeds/seedApplications.js                            │
│  → Creates: Sample adoption applications                       │
└────────────────────────────────────────────────────────────────┘

                        ⬇️

Step 7: Start the Server
┌────────────────────────────────────────────────────────────────┐
│  pnpm dev                                                       │
│                                                                 │
│  ✅ Database connected successfully                           │
│  ✅ Running migrations...                                     │
│  ✅ All migrations completed successfully                     │
│  🚀 Server running on http://localhost:5001                   │
└────────────────────────────────────────────────────────────────┘

                        ⬇️

Step 8: Verify Setup
┌────────────────────────────────────────────────────────────────┐
│  curl http://localhost:5001/api/health                         │
│  → {"status": "OK"} ✅                                         │
│                                                                 │
│  curl http://localhost:5001/api/animals/available              │
│  → Returns array of animals ✅                                 │
└────────────────────────────────────────────────────────────────┘
```

## 🎯 What Each Step Does

### Step 1: Prerequisites

Check that you have the required software installed.

### Step 2: Install Dependencies

Downloads all npm packages needed to run the backend.

### Step 3: Database Setup

Creates a PostgreSQL database named `sfp_portal`.

**Docker Option**: Easiest, runs PostgreSQL in a container.  
**Manual Option**: Install PostgreSQL on your system.

### Step 4: Configure Environment

Sets up database connection and server configuration.

### Step 5: Run Migrations

Creates all database tables and relationships using Sequelize.

**Tables Created**:

- `volunteers` - Stores user accounts (admin, foster, interviewer)
- `animals` - Stores animal profiles and details
- `applications` - Stores adoption applications
- `interviews` - Stores interview schedules and results
- `contracts` - Stores signed adoption contracts

### Step 6: Seed Test Data

Populates database with sample data for testing.

**Test Accounts Created**:
| Email | Password | Role |
|-------|----------|------|
| admin@sfp.com | admin123 | Admin |
| foster@sfp.com | foster123 | Foster |
| interviewer@sfp.com | interviewer123 | Interviewer |

### Step 7: Start the Server

Launches the Express server with hot-reload enabled.

### Step 8: Verify Setup

Tests that the API is responding correctly.

## 🔧 Common Setup Issues

### Issue 1: Database Connection Failed

```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL
brew services start postgresql@14     # macOS
sudo systemctl start postgresql       # Linux
```

### Issue 2: Database Does Not Exist

```
❌ Error: database "sfp_portal" does not exist
```

**Solution**:

```bash
psql -U postgres -c "CREATE DATABASE sfp_portal;"
```

### Issue 3: Port Already in Use

```
❌ Error: EADDRINUSE: address already in use :::5001
```

**Solution**:

```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change port in .env
PORT=5002
```

### Issue 4: Migration Errors

```
❌ Error: relation "volunteers" already exists
```

**Solution**:

```bash
# Reset database
psql -U postgres -d sfp_portal -c "DROP SCHEMA public CASCADE;"
psql -U postgres -d sfp_portal -c "CREATE SCHEMA public;"
psql -U postgres -d sfp_portal -c "GRANT ALL ON SCHEMA public TO sfp_user;"

# Re-run migrations
node src/migrations/runMigrations.js
```

### Issue 5: JWT Secret Not Set

```
❌ Error: JWT_SECRET is not defined
```

**Solution**:

```bash
# Add to api/.env
JWT_SECRET=my_super_secret_key_change_in_production
```

## 📊 Database Schema

```
┌─────────────┐
│ volunteers  │
├─────────────┤
│ id          │←──┐
│ email       │   │
│ password    │   │
│ full_name   │   │
│ role        │   │
│ created_at  │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│  animals    │   │
├─────────────┤   │
│ id          │   │
│ unique_id   │   │
│ name        │   │
│ species     │   │
│ status      │   │
│volunteer_id │───┘
│ created_at  │
└─────────────┘
      ↑
      │
┌─────────────┐
│applications │
├─────────────┤
│ id          │
│ animal_id   │───→ animals.id
│ full_name   │
│ email       │
│ status      │
│ created_at  │
└─────────────┘
      ↑
      │
┌─────────────┐
│ interviews  │
├─────────────┤
│ id          │
│application_id│──→ applications.id
│volunteer_id │───→ volunteers.id
│interview_time│
│ status      │
└─────────────┘
```

## 🎓 Learning Resources

### Understanding Migrations

- `src/migrations/runMigrations.js` - Creates database schema
- Uses Sequelize `sync()` to create tables from models
- Idempotent: Safe to run multiple times

### Understanding Seeds

- `src/seeds/seedVolunteers.js` - Creates test user accounts
- `src/seeds/seedAnimals.js` - Creates sample animals
- Uses `upsert()` to avoid duplicates

### Understanding Models

- `src/models/` - Sequelize model definitions
- `associations.js` - Defines relationships between tables
- Models auto-map to PostgreSQL tables

## 🚀 Next Steps After Setup

1. **Test API Endpoints**

   ```bash
   # Use the test accounts to login
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@sfp.com","password":"admin123"}'
   ```

2. **Start Frontend**

   ```bash
   cd web
   pnpm install
   pnpm dev
   # Visit http://localhost:5173
   ```

3. **Test Full Workflow**

   - Login as admin
   - View animals
   - Create application
   - Schedule interview
   - Approve application

4. **Read Documentation**
   - [API README](../api/README.md) - Full API documentation
   - [Quick Start](../QUICKSTART.md) - Fast setup guide
   - [Workflow Guide](./APPLICATION_WORKFLOW_IMPLEMENTATION.md)

## 📝 Checklist

Use this checklist to verify your setup:

- [ ] Node.js v18+ installed
- [ ] PostgreSQL v14+ installed
- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] `.env` file created with correct values
- [ ] Database created (`sfp_portal`)
- [ ] Migrations run successfully
- [ ] Volunteers seeded (test accounts created)
- [ ] Animals seeded (sample data)
- [ ] Server starts without errors
- [ ] Health check returns OK
- [ ] Can login with test accounts
- [ ] API endpoints respond correctly

## 🎉 Success!

If all steps completed successfully, you should see:

```
✅ Database connected successfully
✅ Running migrations...
✅ All migrations completed successfully
🚀 Server running on http://localhost:5001

Available endpoints:
  GET  http://localhost:5001/api/health
  GET  http://localhost:5001/api/animals/available
  POST http://localhost:5001/api/auth/login
```

Your SFP Portal backend is now fully operational! 🐾
