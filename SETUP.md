# SFP Portal - Development Setup Status

## ✅ Current State

### API (Backend)

- **Status**: Running on `http://localhost:5000`
- **Mode**: MOCK DATA MODE (PostgreSQL not available)
- **Features Ready**:
  - ✓ Express.js server
  - ✓ JWT authentication middleware
  - ✓ RBAC middleware
  - ✓ Prometheus metrics endpoint (`/metrics`)
  - ✓ Health check endpoint (`/api/health`)
  - ✓ CORS configured
  - ✓ Error handling middleware
  - ✓ All routes defined (auth, animals, volunteers, applications, interviews, contracts)

### Web (Frontend)

- **Status**: Not yet started
- **Tech**: React + TypeScript, Vite, Tailwind CSS
- **Package Manager**: pnpm v10.22.0
- **Build**: Ready to run

### Database

- **PostgreSQL 18**: Installed locally, but connection failing
- **Issue**: Password authentication not working (tried multiple approaches)
- **Alternative**: Docker Compose setup created, but Docker CLI not accessible from bash shell

### Infrastructure

- **Docker Compose**: Configuration created in `/infra/docker-compose.yml`
- **Services Defined**: PostgreSQL 18, Redis 7

## 🚀 Quick Start

### 1. Start the API Server

```bash
cd CloudComputing/SFP-Portal/api
pnpm start
# Output should show: "✓ Server running on port 5000 (MOCK DATA MODE)"
```

### 2. Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### 3. Start the Web App (in a new terminal)

```bash
cd CloudComputing/SFP-Portal/web
pnpm install  # if needed
pnpm run dev
# Should start on http://localhost:3000
```

### 4. Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Metrics
curl http://localhost:5000/metrics

# Note: Endpoint functionality requires working database
# Currently, database endpoints will return "connect ECONNREFUSED" errors
```

## 🔴 Current Blockers

### Database Connection Issues

1. **Local PostgreSQL** - Password authentication failing despite setting `DB_PASSWORD=postgres`
2. **Docker CLI** - Not accessible from bash shell (Windows/WSL PATH issue)
3. **docker-compose** - v1 not installed; v2 (integrated) requires Docker daemon

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

- PostgreSQL service is not running
- Port 5432 is not accessible

## ✅ What's Working

### API Infrastructure

- Server startup and shutdown
- HTTP request handling
- Middleware pipeline (CORS, JSON parsing, auth, error handling)
- Health endpoint returns proper status
- Metrics endpoint responds

### Frontend Ready

- TypeScript compilation successful
- No import or type errors
- All pages and components properly typed
- RBAC routes configured for correct role checks

### Project Configuration

- All imports fixed (casing issues resolved)
- ES modules properly configured (`"type": "module"` in package.json)
- pnpm scripts working correctly
- Environment variables template ready

## 🔧 To Get Full Database Functionality

### Option 1: Fix Local PostgreSQL (Recommended)

1. Check PostgreSQL service status:

   ```bash
   "C:\Program Files\PostgreSQL\18\bin\pg_ctl" -D "C:\Program Files\PostgreSQL\18\data" status
   ```

2. If not running, start it:

   ```bash
   "C:\Program Files\PostgreSQL\18\bin\pg_ctl" -D "C:\Program Files\PostgreSQL\18\data" start
   ```

3. Connect with psql:

   ```bash
   psql -U postgres -h 127.0.0.1 -d postgres
   ```

4. Create the database:

   ```sql
   CREATE DATABASE sfp_portal;
   ```

5. Test connection:
   ```bash
   psql -U postgres -h 127.0.0.1 -d sfp_portal -c "SELECT 1;"
   ```

### Option 2: Use Docker Compose

From Command Prompt (CMD) or PowerShell (NOT bash):

```bash
cd CloudComputing\SFP-Portal\infra
docker compose up -d
```

Then update `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sfp_portal
DB_USER=postgres
DB_PASSWORD=postgres
```

Then restart API:

```bash
cd CloudComputing\SFP-Portal\api
pnpm start
```

## 📊 Available API Endpoints (when DB connected)

### Authentication

- `POST /api/auth/register` - Register new volunteer
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify token (protected)

### Animals

- `GET /api/animals/available` - Get available animals (public)
- `GET /api/animals` - Get all animals (requires VOLUNTEER role)
- `POST /api/animals` - Create animal (requires COORDINATOR role)
- `PUT /api/animals/:id` - Update animal (RBAC: FOSTER self-only, COORDINATOR all)
- `DELETE /api/animals/:id` - Delete animal (RBAC: FOSTER self-only, COORDINATOR all)

### Applications & Interviews

- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id/approve` - Approve application
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id/complete` - Complete interview

### Contracts

- `GET /api/contracts/:applicationId` - Get contract
- `PUT /api/contracts/:id/sign` - Sign contract

### System

- `GET /api/health` - Health check
- `GET /metrics` - Prometheus metrics

## 🎯 Next Steps

1. **Get PostgreSQL running** (highest priority)

   - Option: Use Docker Desktop GUI to start Docker daemon, then use docker-compose
   - Option: Troubleshoot local PostgreSQL authentication

2. **Run API endpoint tests** (once DB is connected)

   - Test registration → login → get token flow
   - Test animal CRUD operations
   - Verify RBAC enforcement

3. **Start web app**

   ```bash
   cd web && pnpm run dev
   ```

4. **Test frontend integration**

   - Login flow
   - Animal listing
   - Application submission

5. **Deploy to Kubernetes**
   - Use `/infra/k8s/` configuration
   - Set up ingress
   - Configure persistent volumes

## 📝 Configuration Files

- **Backend**: `/api/.env` (environment variables)
- **Database**: `/api/src/config/database.js`
- **Frontend**: `/web/.env` (if needed)
- **Docker**: `/infra/docker-compose.yml`
- **Kubernetes**: `/infra/k8s/`

## 🆘 Troubleshooting

### "Port 5000 already in use"

```bash
netstat -ano | grep 5000 | awk '{print $NF}' | xargs -I {} taskkill //PID {} //F
```

### "Cannot connect to database"

Check if PostgreSQL is running:

```bash
"C:\Program Files\PostgreSQL\18\bin\pg_ctl" -D "C:\Program Files\PostgreSQL\18\data" status
```

### "Module not found" errors

Make sure you're in the correct directory and run:

```bash
cd CloudComputing/SFP-Portal/api  # for API
pnpm install

# or

cd CloudComputing/SFP-Portal/web  # for web
pnpm install
```

### Docker not working from bash

Use PowerShell or Command Prompt instead:

```powershell
cd C:\Users\RayXu\Desktop\UofT_Projects\CloudComputing\SFP-Portal\infra
docker compose up -d
```

## 📚 Documentation

- API Specification: `/docs/Project Proposal.md`
- README: `/docs/readme.md`
- API README: `/api/README.md`
- Web README: `/web/README.md`
