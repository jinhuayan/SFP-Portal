# SFP Portal API Tests

This directory contains comprehensive test files for the SFP Portal API endpoints.

## Test Files

### 1. **api-tests.sh** - Automated Test Suite (Bash)

A complete automated test suite that runs all API tests sequentially.

**Features:**

- Color-coded output (green for success, red for errors)
- Tests all major endpoints (Auth, Animals, Applications, Interviews, Contracts)
- Tests RBAC (Role-Based Access Control)
- Tests error handling and validation
- Extracts and reuses JWT tokens

**Usage:**

```bash
# Make the script executable
chmod +x tests/api-tests.sh

# Run the tests
bash tests/api-tests.sh
```

**Requirements:**

- API running on `http://localhost:5000`
- curl installed
- bash shell

**Test Coverage:**

- ✅ Authentication (Register, Login, Verify)
- ✅ Animals (CRUD operations and RBAC)
- ✅ Applications (Submit, Approve, Reject)
- ✅ Interviews (Schedule, Complete)
- ✅ Contracts (Get, Sign)
- ✅ Error Handling (Invalid input, unauthorized access)
- ✅ System Endpoints (Health, Metrics)

### 2. **curl-commands.txt** - Manual cURL Commands Reference

A collection of ready-to-use cURL commands for manual testing.

**Usage:**

```bash
# Copy any command and run it directly in your terminal
curl -X GET http://localhost:5000/api/health

# Or for commands with data
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "first_name": "Test",
    "last_name": "User",
    "role": "VOLUNTEER"
  }'
```

**Features:**

- Organized by endpoint category
- Error case examples
- Tips for using cURL effectively
- Comments explaining each request

**Sections:**

1. Authentication Endpoints
2. Animal Endpoints
3. Applicant Endpoints
4. Application Endpoints
5. Interview Endpoints
6. Contract Endpoints
7. Volunteer Endpoints
8. System Endpoints
9. Error Cases
10. Useful Tips

### 3. **SFP-Portal-API.postman_collection.json** - Postman Collection

A complete Postman collection for testing all endpoints with a GUI.

**Usage:**

1. Open Postman
2. Click "Import" → Select this JSON file
3. Set variables:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: (will be filled after login)
4. Start making requests

**Features:**

- Organized folder structure
- Pre-configured endpoints
- Environment variables for base URL and token
- Request bodies ready to use
- No need for manual header configuration

**How to Use:**

1. Start with "Authentication" → "Login"
2. Copy the token from the response
3. Set `{{TOKEN}}` variable in Postman settings
4. Use other endpoints with automatic token injection

## Quick Start Guide

### Option 1: Automated Testing (Recommended)

```bash
# 1. Start the API
cd api && pnpm start

# 2. In another terminal, run the test suite
bash tests/api-tests.sh
```

### Option 2: Manual Testing with cURL

```bash
# 1. Start the API
cd api && pnpm start

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

# 3. Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 4. Use the token in requests
curl http://localhost:5000/api/animals \
  -H "Authorization: Bearer $TOKEN"
```

### Option 3: Using Postman

1. Import `SFP-Portal-API.postman_collection.json`
2. Set `BASE_URL` variable to `http://localhost:5000`
3. Use the GUI to make requests

## API Endpoint Summary

| Method | Endpoint                      | Auth | Role         | Description                    |
| ------ | ----------------------------- | ---- | ------------ | ------------------------------ |
| POST   | /api/auth/register            | No   | -            | Register new user              |
| POST   | /api/auth/login               | No   | -            | Login and get token            |
| GET    | /api/auth/verify              | Yes  | -            | Verify JWT token               |
| GET    | /api/animals/available        | No   | -            | Get available animals (public) |
| GET    | /api/animals                  | Yes  | VOLUNTEER+   | Get all animals                |
| POST   | /api/animals                  | Yes  | COORDINATOR+ | Create animal                  |
| PUT    | /api/animals/:id              | Yes  | COORDINATOR+ | Update animal                  |
| DELETE | /api/animals/:id              | Yes  | COORDINATOR+ | Delete animal                  |
| GET    | /api/applications             | Yes  | COORDINATOR+ | Get applications               |
| POST   | /api/applications             | Yes  | VOLUNTEER+   | Submit application             |
| PUT    | /api/applications/:id/approve | Yes  | COORDINATOR+ | Approve application            |
| GET    | /api/interviews               | Yes  | INTERVIEWER+ | Get interviews                 |
| POST   | /api/interviews               | Yes  | INTERVIEWER+ | Schedule interview             |
| PUT    | /api/interviews/:id/complete  | Yes  | INTERVIEWER+ | Complete interview             |
| GET    | /api/contracts/:id            | Yes  | -            | Get contract                   |
| PUT    | /api/contracts/:id/sign       | Yes  | -            | Sign contract                  |
| GET    | /api/health                   | No   | -            | Health check                   |
| GET    | /metrics                      | No   | -            | Prometheus metrics             |

## Testing Scenarios

### Scenario 1: Register and Login

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "VOLUNTEER"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123"
  }'

# 3. Use returned token in subsequent requests
```

### Scenario 2: Create and List Animals

```bash
# Register as COORDINATOR
# Login to get token
# Create animal
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...animal data...}'

# List animals
curl http://localhost:5000/api/animals \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 3: Test RBAC (Role-Based Access Control)

```bash
# Try to create animal as VOLUNTEER (should fail)
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer $VOLUNTEER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...animal data...}'

# Expected: Forbidden (403)

# Create animal as COORDINATOR (should succeed)
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer $COORDINATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...animal data...}'

# Expected: Created (201)
```

## Troubleshooting

### "Connection refused" error

- Check if API is running: `curl http://localhost:5000/api/health`
- Start API: `cd api && pnpm start`

### "Invalid token" error

- Make sure you logged in and got a fresh token
- Token might have expired (24 hours)
- Check token format: `Bearer <token>`

### "Forbidden" error

- User doesn't have required role
- Check role in your user registration
- Login as different user with correct role

### "Validation failed" error

- Check required fields in request body
- Validate email format
- Password must be at least 6 characters

## Best Practices

1. **Store tokens in environment variables**

   ```bash
   TOKEN=$(curl ... | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   ```

2. **Use base64 encoding for sensitive data in scripts**

   ```bash
   CREDENTIALS=$(echo -n "user:pass" | base64)
   ```

3. **Test error cases**

   - Invalid email formats
   - Missing required fields
   - Insufficient permissions
   - Invalid tokens

4. **Monitor API response times**

   ```bash
   curl -w "Time: %{time_total}s\n" http://localhost:5000/api/health
   ```

5. **Check response headers**
   ```bash
   curl -i http://localhost:5000/api/health
   ```

## Response Formats

### Success Response

```json
{
  "status": "success",
  "data": {
    /* ... */
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    /* ... */
  ]
}
```

### Authentication Token Response

```json
{
  "token": "eyJhbGc...",
  "volunteer": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VOLUNTEER"
  }
}
```

## Performance Testing

To test API performance with multiple concurrent requests:

```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:5000/api/health

# Using wrk
wrk -t 4 -c 100 -d 30s http://localhost:5000/api/health
```

## Additional Resources

- [cURL Documentation](https://curl.se/docs/manpage.html)
- [Postman Documentation](https://learning.postman.com/)
- [API Endpoints Documentation](../docs/Project%20Proposal.md)
- [Backend README](../api/README.md)

---

**Last Updated:** November 16, 2025
