# Running API Tests - Quick Start

## 🎯 The Simple Version

### Terminal 1 - Start the API

```bash
cd ~/Desktop/UofT_Projects/CloudComputing/SFP-Portal/api
pnpm start
```

Wait for: `✓ Server running on port 5000`

### Terminal 2 - Run Tests (Choose One)

#### Option A: Automated Tests (Recommended)

```bash
cd ~/Desktop/UofT_Projects/CloudComputing/SFP-Portal
bash tests/api-tests.sh
```

#### Option B: Node.js Tests

```bash
cd ~/Desktop/UofT_Projects/CloudComputing/SFP-Portal
node tests/test-runner.js
```

#### Option C: Manual cURL

```bash
# Test health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "VOLUNTEER"
  }'
```

## ✅ What Works Now

| Test                | Status | Notes                  |
| ------------------- | ------ | ---------------------- |
| Health Check        | ✅     | API is responding      |
| Error Validation    | ✅     | Invalid input rejected |
| API Structure       | ✅     | Endpoints are working  |
| Database Operations | ❌     | Needs PostgreSQL       |
| Authentication      | ❌     | Needs database         |
| RBAC                | ❌     | Needs database         |

## 🔧 To Fix Failing Tests

You need PostgreSQL running:

```bash
# Option 1: Docker (easiest)
cd CloudComputing/SFP-Portal/infra
docker compose up -d

# Option 2: Local PostgreSQL on Windows
"C:\Program Files\PostgreSQL\18\bin\pg_ctl" -D "C:\Program Files\PostgreSQL\18\data" start
psql -U postgres -c "CREATE DATABASE sfp_portal;"
```

Then restart API and tests will pass.

## 📁 Test Files Location

```
CloudComputing/SFP-Portal/tests/
├── api-tests.sh                     ← Run this (bash)
├── test-runner.js                   ← Or this (node)
├── curl-commands.txt                ← Or use these commands
├── SFP-Portal-API.postman_collection.json  ← Or import in Postman
├── INDEX.md                         ← Full documentation
├── README.md                        ← Complete guide
├── TESTING.md                       ← Quick guide
└── token-examples.sh                ← JWT examples
```

## 🎓 Key Concepts

### API is in Mock Mode

- Running without database for development
- Accepts requests and validates input
- Database operations fail gracefully

### Tests Use 4 Methods

1. **Bash Script** - Full automation, color output
2. **Node.js** - Programmatic, fast
3. **cURL** - Manual control, learning
4. **Postman** - Visual GUI

### All 4 Methods Test Same Endpoints

- Authentication
- Animals (CRUD)
- Applications
- Interviews
- Contracts
- System health

## 🚀 Next Steps

1. **Start API**: `cd api && pnpm start`
2. **Pick a test method** (bash, node, curl, or Postman)
3. **Run tests**
4. **Install PostgreSQL** to get 100% pass rate

---

For detailed docs, see:

- `tests/TESTING.md` - Quick start guide
- `tests/INDEX.md` - Complete reference
- `SETUP.md` - PostgreSQL setup
