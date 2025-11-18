# SFP Portal API Tests - Complete Index

## ��� Test Files Guide

### Core Test Files

#### 1. **api-tests.sh** - Comprehensive Automated Test Suite
- **Type**: Bash script
- **Size**: 20KB
- **Purpose**: Complete automation of all API tests
- **Run**: `bash tests/api-tests.sh`

**Features:**
- Registers users with different roles (Admin, Volunteer, Coordinator, Foster)
- Performs login and token extraction
- Tests CRUD operations on Animals
- Tests RBAC (Role-Based Access Control)
- Tests Applications, Interviews, Contracts workflows
- Tests error handling and validation
- Color-coded output (pass/fail/info)
- Extracts and reuses JWT tokens automatically

**Example Output:**
```
✓ Admin registered
✓ Admin login successful - Token: eyJhbGc...
✓ Animal created
✓ RBAC working - access denied
✓ All tests completed!
```

---

#### 2. **test-runner.js** - Node.js Test Runner
- **Type**: JavaScript/Node.js
- **Size**: 8.4KB
- **Purpose**: Programmatic testing with colorful output
- **Run**: `node tests/test-runner.js`

**Features:**
- Tests API health and readiness
- Performs authentication flow
- Tests endpoints with token management
- Validates response status codes
- Comprehensive error handling
- Shows test summary with pass/fail counts
- No external dependencies (uses native fetch API)

**Example Output:**
```
✓ Health Check
✓ Register User
✓ Login User
✓ Get All Animals

Test Summary
============
Total: 15 tests
Passed: 15
Failed: 0
Success Rate: 100%
```

---

#### 3. **curl-commands.txt** - cURL Reference
- **Type**: Plain text with commands
- **Size**: 9.8KB
- **Purpose**: Ready-to-use cURL commands for manual testing
- **Use**: Copy and paste any command

**Sections:**
1. Authentication (Register, Login, Verify)
2. Animals (CRUD operations)
3. Applicants (Management)
4. Applications (Submission, Approval)
5. Interviews (Scheduling, Completion)
6. Contracts (Signing)
7. Volunteers (Management)
8. System (Health, Metrics)
9. Error Cases (Validation, Unauthorized)
10. Useful Tips (Pretty print, verbose, etc.)

**Example Command:**
```bash
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

---

#### 4. **SFP-Portal-API.postman_collection.json** - Postman Collection
- **Type**: JSON (Postman format)
- **Size**: 14KB
- **Purpose**: GUI-based testing in Postman
- **Import**: Postman → File → Import

**Features:**
- Pre-configured endpoints
- Organized in folders (Auth, Animals, Applications, Interviews, Contracts)
- Environment variables for `BASE_URL` and `TOKEN`
- Ready-to-send request bodies
- Automatic header configuration

**How to Import:**
1. Open Postman
2. Click "Import"
3. Select `SFP-Portal-API.postman_collection.json`
4. Set `BASE_URL` to `http://localhost:5000`
5. After login, set `TOKEN` variable
6. Start making requests

---

### Documentation Files

#### 5. **README.md** - Complete Testing Guide
- **Type**: Markdown
- **Size**: 8.5KB
- **Purpose**: Comprehensive testing documentation
- **Includes**:
  - Test file descriptions
  - API endpoint summary table
  - RBAC testing scenarios
  - Error case examples
  - Performance testing tips
  - Troubleshooting guide

**Sections:**
- Test Files Overview
- Quick Start Guide
- API Endpoint Summary
- Testing Scenarios
- Troubleshooting
- Best Practices
- Response Formats
- Performance Testing

---

#### 6. **TESTING.md** - Quick Start Guide
- **Type**: Markdown
- **Size**: 9KB
- **Purpose**: Fast start for testing
- **Includes**:
  - Quick start instructions
  - Common test scenarios
  - Debugging tips
  - Example test outputs

**Sections:**
- Quick Start (4 options)
- Test Coverage
- Common Scenarios
- Debugging Tips
- Performance Testing
- Troubleshooting

---

#### 7. **token-examples.sh** - JWT Token Management
- **Type**: Bash script with examples
- **Size**: 7KB
- **Purpose**: Demonstrate token handling and usage
- **Run**: `bash tests/token-examples.sh`

**Covers:**
- User registration and token extraction
- Token usage in requests
- Token verification
- Error handling with tokens
- Multiple users with different roles
- Environment variable storage
- JWT token decoding
- Token reuse in complex operations

---

#### 8. **INDEX.md** - This File
- **Type**: Markdown
- **Purpose**: Master index of all test files
- **Use**: Reference guide for finding what you need

---

## ��� Quick Reference

### I want to...

#### Run all tests at once
```bash
bash tests/api-tests.sh
```
→ See automated test results in 2-3 minutes

#### Test individual endpoints manually
```bash
cat tests/curl-commands.txt
# Copy any command and run it
```
→ Full control, understand each request/response

#### Use a nice GUI for testing
Import `tests/SFP-Portal-API.postman_collection.json` in Postman
→ Visual, organized, save requests

#### Learn how tokens work
```bash
bash tests/token-examples.sh
```
→ See token extraction, validation, and usage

#### Understand the test setup
Open `tests/README.md` or `tests/TESTING.md`
→ Learn what's being tested and how

---

## ��� Test Coverage Matrix

| Feature | api-tests.sh | test-runner.js | curl-commands | Postman |
|---------|:------------:|:-------------:|:-------------:|:-------:|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| Animals CRUD | ✅ | ✅ | ✅ | ✅ |
| RBAC Testing | ✅ | ❌ | ✅ | ✅ |
| Applications | ✅ | ❌ | ✅ | ✅ |
| Interviews | ✅ | ❌ | ✅ | ✅ |
| Contracts | ✅ | ❌ | ✅ | ✅ |
| Error Cases | ✅ | ✅ | ✅ | ✅ |
| Visual GUI | ❌ | ❌ | ❌ | ✅ |
| Automated | ✅ | ✅ | ❌ | ❌ |
| Manual | ⚠️ | ⚠️ | ✅ | ✅ |
| CI/CD Ready | ✅ | ✅ | ❌ | ❌ |

---

## ��� Recommended Testing Workflow

### Day 1: Setup and Smoke Test
1. Start API: `cd api && pnpm start`
2. Check health: `curl http://localhost:5000/api/health`
3. Run quick tests: `node tests/test-runner.js`

### Day 2: Comprehensive Testing
1. Run full test suite: `bash tests/api-tests.sh`
2. Review results for failures
3. Fix any API bugs found

### Day 3: Manual Exploration
1. Import Postman collection
2. Test specific scenarios manually
3. Explore edge cases
4. Document findings

### Ongoing: Regression Testing
1. Before each commit: `bash tests/api-tests.sh`
2. Before deployment: `bash tests/api-tests.sh`
3. In CI/CD pipeline: `node tests/test-runner.js`

---

## ��� Test Execution Times

| Test Type | Time | Status |
|-----------|------|--------|
| Health Check | < 1s | ✅ |
| Single Registration | < 2s | ✅ |
| Full Test Suite (api-tests.sh) | 2-3 mins | ✅ |
| Node Test Runner | 1-2 mins | ✅ |
| Manual cURL Tests | Variable | ✅ |
| Postman Collection | Variable | ✅ |

---

## ��� Finding Specific Tests

### Authentication Tests
- **Bash**: Look for `test_auth_` functions in `api-tests.sh`
- **Node**: Search for "Register User", "Login Uer"
- **cURL**: See "1 AUTHENTICATION ENDPOI.sNTS" in `curl-commands.txt`
- **Postman**: Go to "Authentication" folder

### Animal Tests
- **Bash**: Look for `test_animals_` functions
- **cURL**: See "2. ANIMAL ENDPOINTS"
- **Postman**: Go to "Animals" folder

### RBAC Tests
- **Bash**: Look for `test_animals_rbac` function
- **cURL**: See "ERROR CASES" section for RBAC examples
- **Postman**: Try endpoints with different TOKEN variables

### Error Handling
- **Bash**: Look for `test_error_handling` function
- **Node**: Look for error test cases
- **cURL**: See "7. ERROR CASES" section
- **Postman**: Try invalid tokens and missing fields

---

## ���️ Debugging & Troubleshooting

### API won't start
```bash
# Check if port is in use
lsof -i :5000
# Kill existing process and restart
```

### Tests fail randomly
```bash
# Try resetting database
curl -X POST http://localhost:5000/api/migrate -d '{"force": true}'
# Then run tests again
```

### Token issues
```bash
# Extract fresh token
bash tests/token-examples.sh
# Use the extracted token
```

### See full error details
```bash
# Use curl with verbose flag
curl -v http://localhost:5000/api/animals \
  -H "Authorization: Bearer $TOKEN"

# Or check API logs in terminal
```

---

## ��� Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| API Setup | `SETUP.md` | Initial setup and configuration |
| API Docs | `api/README.md` | Backend implementation details |
| Frontend Docs | `web/README.md` | Frontend setup and features |
| Project Proposal | `docs/Project Proposal.md` | Project overview and requirements |

---

## ✅ Test Checklist

Use this checklist to verify all tests are working:

- [ ] API is running and responding to health check
- [ ] `api-tests.sh` runs without errors
- [ ] `test-runner.js` shows 100% pass rate
- [ ] cURL commands work when copied
- [ ] Postman collection imports successfully
- [ ] Token examples show proper token extraction
- [ ] All documentation files are readable
- [ ] Tests cver all major endoinopts
- [ ] RBAC enforcement is verified
- [ ] Error cases are handled properly

---

## ��� Learning Resources

### Understanding JWT Tokens
See: `token-examples.sh` - Examples 7-9

### Understanding RBAC
See: `tests/api-tests.sh` - `test_animals_rbac` function

### Understanding cURL
See: `curl-commands.txt` - "USEFUL TIPS" section

### Understanding Postman
See: `README.md` - "How to Import" section

---

## ��� Next Steps

1. **Review** all test files to understand coverage
2. **Run** one test method to verify API is working
3. **Identify** any failing tests
4. **Debug** failures using provided troubleshooting guides
5. **Document** any issues found
6. **Integrate** tests into CI/CD pipeline

---

**Last Updated**: November 16, 2025
**Test Suite Version**: 1.0
**API Version**: 1.0.0
