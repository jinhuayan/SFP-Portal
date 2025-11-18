# API Testing Quick Start

## 📋 Test Files Overview

You now have **4 ways** to test the API:

| File                                       | Type           | Usage                       | Best For                            |
| ------------------------------------------ | -------------- | --------------------------- | ----------------------------------- |
| **api-tests.sh**                           | Bash Script    | `bash tests/api-tests.sh`   | Automated CI/CD, regression testing |
| **curl-commands.txt**                      | Reference      | Copy-paste commands         | Quick manual testing                |
| **test-runner.js**                         | Node.js Script | `node tests/test-runner.js` | Programmatic testing                |
| **SFP-Portal-API.postman_collection.json** | Postman        | Import in Postman           | Visual GUI testing                  |

---

## 🚀 Quick Start

### Prerequisites

Make sure the API is running:

```bash
cd api
pnpm start
```

### Option 1: Bash Automated Tests ⚡ (Fastest)

```bash
bash tests/api-tests.sh
```

**Output:**

```
✓ API is running
✓ Admin registered
✓ Admin login successful - Token: eyJhbGc...
✓ Admin token verified
✓ Available animals endpoint works
... (continues with all tests)
✓ All tests completed!
```

### Option 2: Node.js Tests 🟢

```bash
node tests/test-runner.js
```

**Output:**

```
==================================================
SFP Portal API Test Suite
==================================================

✓ Health Check
✓ Metrics Endpoint
✓ Register User
✓ Login User
✓ Verify Token
... (continues)

==================================================
Test Summary
==================================================
Total: 15 tests
Passed: 15
Failed: 0
Success Rate: 100%
```

### Option 3: Manual cURL Tests 🔧

```bash
# 1. Check API health
curl http://localhost:5000/api/health

# 2. Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "first_name": "Test",
    "last_name": "User",
    "role": "VOLUNTEER"
  }'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Option 4: Postman GUI 🎯

1. Install [Postman](https://www.postman.com/downloads/)
2. File → Import → `tests/SFP-Portal-API.postman_collection.json`
3. Set variables:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: (copy from login response)
4. Start testing with visual interface

---

## 📊 What Gets Tested

### ✅ Core Endpoints

- **Authentication**: Register, Login, Verify Token
- **Animals**: Create, Read, Update, Delete
- **Applications**: Submit, Approve, Reject
- **Interviews**: Schedule, Complete
- **Contracts**: Get, Sign
- **System**: Health Check, Metrics

### ✅ RBAC (Role-Based Access Control)

- Admin only endpoints
- Coordinator permissions
- Foster self-only editing
- Volunteer read-only access

### ✅ Error Handling

- Invalid email formats
- Missing required fields
- Unauthorized access (no token)
- Insufficient permissions (wrong role)
- Password validation

### ✅ Response Validation

- Correct HTTP status codes
- Proper JSON response format
- Token generation and validation
- Error message consistency

---

## 🎮 Test Results Examples

### Running All Tests (api-tests.sh)

```
========================================
Authentication - Registration Tests
========================================

→ Testing: Register Admin
✓ Admin registered

→ Testing: Register Volunteer
✓ Volunteer registered

========================================
Animals - CRUD Operations (Coordinator)
========================================

→ Testing: Create Animal (as Coordinator)
✓ Animal created

→ Testing: Get All Animals (as Volunteer)
✓ Fetched all animals

========================================
Test Suite Complete
========================================

✓ All tests completed!
```

---

## 💡 Common Test Scenarios

### Scenario 1: Full User Journey

```bash
# 1. Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "Pass123", ...}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "Pass123"}'

# 3. View available animals
curl http://localhost:5000/api/animals/available

# 4. Submit application
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...application data...}'
```

### Scenario 2: RBAC Testing

```bash
# Test: Volunteer can't create animals (should fail)
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer $VOLUNTEER_TOKEN" \
  -d '{...animal data...}'
# Expected: 403 Forbidden

# Test: Coordinator can create animals (should succeed)
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer $COORDINATOR_TOKEN" \
  -d '{...animal data...}'
# Expected: 201 Created
```

### Scenario 3: Error Cases

```bash
# Invalid email
curl -X POST http://localhost:5000/api/auth/register \
  -d '{"email": "not-an-email", ...}'
# Expected: 400 Bad Request

# Missing password
curl -X POST http://localhost:5000/api/auth/register \
  -d '{"email": "test@example.com", "first_name": "Test", ...}'
# Expected: 400 Bad Request

# Expired token
curl http://localhost:5000/api/animals \
  -H "Authorization: Bearer expired_token"
# Expected: 401 Unauthorized
```

---

## 🔍 Debugging Tips

### Check API Health

```bash
curl http://localhost:5000/api/health
```

### View Response with Headers

```bash
curl -i http://localhost:5000/api/health
```

### Pretty Print JSON (requires jq)

```bash
curl http://localhost:5000/api/health | jq .
```

### Save Response to File

```bash
curl http://localhost:5000/api/health -o response.json
```

### Verbose Output (show all details)

```bash
curl -v http://localhost:5000/api/health
```

### Extract Token from Response

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{...}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

---

## 📈 Performance Testing

### Test API Response Time

```bash
curl -w "Response time: %{time_total}s\n" http://localhost:5000/api/health
```

### Load Testing (requires Apache Bench)

```bash
# Install: brew install httpd (macOS) or apt install apache2-utils (Linux)
ab -n 100 -c 10 http://localhost:5000/api/health
# Performs 100 requests with 10 concurrent
```

### Load Testing with wrk (if installed)

```bash
wrk -t 4 -c 100 -d 30s http://localhost:5000/api/health
# 4 threads, 100 connections, 30 seconds
```

---

## ❌ Troubleshooting

### "Connection refused"

```bash
# Check if API is running
curl http://localhost:5000/api/health

# If not, start it
cd api && pnpm start
```

### "Port already in use"

```bash
# Kill process using port 5000
lsof -i :5000 | grep node | awk '{print $2}' | xargs kill -9
# Or on Windows:
netstat -ano | grep :5000
```

### "Invalid token"

- Make sure you're using a fresh token from login
- Tokens expire after 24 hours
- Check token format: `Bearer <token>`

### "Forbidden (403)"

- User doesn't have required role
- Check your role: `curl http://localhost:5000/api/auth/verify -H "Authorization: Bearer $TOKEN"`

### Tests fail randomly

- Could be database state issues
- Try clearing database: `curl -X POST http://localhost:5000/api/migrate -d '{"force": true}'`
- Run tests again

---

## 📚 Related Documentation

- **Test Details**: `tests/README.md`
- **API Reference**: `api/README.md`
- **Project Proposal**: `docs/Project Proposal.md`
- **cURL Commands**: `tests/curl-commands.txt`
- **Postman Collection**: `tests/SFP-Portal-API.postman_collection.json`

---

## ✨ Next Steps

1. **Run all tests**: `bash tests/api-tests.sh`
2. **Review results** and fix any failures
3. **Test manually** with Postman for deeper exploration
4. **Document** any bugs or unexpected behavior
5. **Set up CI/CD** to run tests automatically on commits

---

**Good luck testing! 🚀**
