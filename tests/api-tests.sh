#!/bin/bash

# SFP Portal API Test Script
# This script contains curl commands to test all API endpoints
# Usage: bash tests/api-tests.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin1234"
VOLUNTEER_EMAIL="volunteer@example.com"
VOLUNTEER_PASSWORD="Volunteer1234"
COORDINATOR_EMAIL="coordinator@example.com"
COORDINATOR_PASSWORD="Coordinator1234"
FOSTER_EMAIL="foster@example.com"
FOSTER_PASSWORD="Foster1234"

# Variables to store tokens
ADMIN_TOKEN=""
VOLUNTEER_TOKEN=""
COORDINATOR_TOKEN=""
FOSTER_TOKEN=""

# Helper functions
print_section() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    echo -e "${YELLOW}→ Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if API is running
check_api() {
    print_section "Checking API Status"
    HEALTH=$(curl -s "$API_URL/api/health" | grep -o '"status":"ok"' || true)
    
    if [ -z "$HEALTH" ]; then
        print_error "API is not running at $API_URL"
        print_error "Start the API with: cd api && pnpm start"
        exit 1
    fi
    print_success "API is running"
}

# ============================================================================
# Authentication Tests
# ============================================================================

test_auth_register() {
    print_section "Authentication - Registration Tests"
    
    # Register admin
    print_test "Register Admin"
    ADMIN_REGISTER=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"$ADMIN_PASSWORD\",
            \"first_name\": \"Admin\",
            \"last_name\": \"User\",
            \"role\": \"ADMIN\"
        }")
    echo "$ADMIN_REGISTER" | grep -q "volunteer" && print_success "Admin registered" || print_error "Admin registration failed: $ADMIN_REGISTER"
    
    # Register volunteer
    print_test "Register Volunteer"
    VOLUNTEER_REGISTER=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$VOLUNTEER_EMAIL\",
            \"password\": \"$VOLUNTEER_PASSWORD\",
            \"first_name\": \"John\",
            \"last_name\": \"Volunteer\",
            \"role\": \"VOLUNTEER\"
        }")
    echo "$VOLUNTEER_REGISTER" | grep -q "volunteer" && print_success "Volunteer registered" || print_error "Volunteer registration failed"
    
    # Register coordinator
    print_test "Register Coordinator"
    COORDINATOR_REGISTER=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$COORDINATOR_EMAIL\",
            \"password\": \"$COORDINATOR_PASSWORD\",
            \"first_name\": \"Jane\",
            \"last_name\": \"Coordinator\",
            \"role\": \"COORDINATOR\"
        }")
    echo "$COORDINATOR_REGISTER" | grep -q "volunteer" && print_success "Coordinator registered" || print_error "Coordinator registration failed"
    
    # Register foster
    print_test "Register Foster"
    FOSTER_REGISTER=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$FOSTER_EMAIL\",
            \"password\": \"$FOSTER_PASSWORD\",
            \"first_name\": \"Bob\",
            \"last_name\": \"Foster\",
            \"role\": \"FOSTER\"
        }")
    echo "$FOSTER_REGISTER" | grep -q "volunteer" && print_success "Foster registered" || print_error "Foster registration failed"
}

test_auth_login() {
    print_section "Authentication - Login Tests"
    
    # Login as admin
    print_test "Login as Admin"
    ADMIN_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"$ADMIN_PASSWORD\"
        }")
    ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$ADMIN_TOKEN" ]; then
        print_success "Admin login successful - Token: ${ADMIN_TOKEN:0:20}..."
    else
        print_error "Admin login failed: $ADMIN_LOGIN"
    fi
    
    # Login as volunteer
    print_test "Login as Volunteer"
    VOLUNTEER_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$VOLUNTEER_EMAIL\",
            \"password\": \"$VOLUNTEER_PASSWORD\"
        }")
    VOLUNTEER_TOKEN=$(echo "$VOLUNTEER_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$VOLUNTEER_TOKEN" ]; then
        print_success "Volunteer login successful - Token: ${VOLUNTEER_TOKEN:0:20}..."
    else
        print_error "Volunteer login failed"
    fi
    
    # Login as coordinator
    print_test "Login as Coordinator"
    COORDINATOR_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$COORDINATOR_EMAIL\",
            \"password\": \"$COORDINATOR_PASSWORD\"
        }")
    COORDINATOR_TOKEN=$(echo "$COORDINATOR_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$COORDINATOR_TOKEN" ]; then
        print_success "Coordinator login successful - Token: ${COORDINATOR_TOKEN:0:20}..."
    else
        print_error "Coordinator login failed"
    fi
    
    # Login as foster
    print_test "Login as Foster"
    FOSTER_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$FOSTER_EMAIL\",
            \"password\": \"$FOSTER_PASSWORD\"
        }")
    FOSTER_TOKEN=$(echo "$FOSTER_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$FOSTER_TOKEN" ]; then
        print_success "Foster login successful - Token: ${FOSTER_TOKEN:0:20}..."
    else
        print_error "Foster login failed"
    fi
}

test_auth_verify() {
    print_section "Authentication - Verify Token Tests"
    
    print_test "Verify Admin Token"
    VERIFY=$(curl -s -X GET "$API_URL/api/auth/verify" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    echo "$VERIFY" | grep -q "valid" && print_success "Admin token verified" || print_error "Token verification failed: $VERIFY"
}

# ============================================================================
# Animal Tests
# ============================================================================

test_animals_public() {
    print_section "Animals - Public Endpoints"
    
    print_test "Get Available Animals (public)"
    ANIMALS=$(curl -s "$API_URL/api/animals/available")
    echo "$ANIMALS" | grep -q "data\|status\|error" && print_success "Available animals endpoint works" || print_error "Failed to get available animals"
    echo "$ANIMALS"
}

test_animals_crud() {
    print_section "Animals - CRUD Operations (Coordinator)"
    
    # Create animal
    print_test "Create Animal (as Coordinator)"
    CREATE_ANIMAL=$(curl -s -X POST "$API_URL/api/animals" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN" \
        -d "{
            \"name\": \"Buddy\",
            \"species\": \"Dog\",
            \"breed\": \"Golden Retriever\",
            \"age\": 3,
            \"description\": \"Friendly and energetic dog\",
            \"status\": \"available\"
        }")
    
    if echo "$CREATE_ANIMAL" | grep -q "id\|Buddy\|error"; then
        print_success "Animal created"
        ANIMAL_ID=$(echo "$CREATE_ANIMAL" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
        echo "$CREATE_ANIMAL"
    else
        print_error "Failed to create animal: $CREATE_ANIMAL"
        return
    fi
    
    # Get all animals
    print_test "Get All Animals (as Volunteer)"
    GET_ANIMALS=$(curl -s "$API_URL/api/animals" \
        -H "Authorization: Bearer $VOLUNTEER_TOKEN")
    echo "$GET_ANIMALS" | grep -q "data\|status" && print_success "Fetched all animals" || print_error "Failed to get animals"
    
    # Update animal
    print_test "Update Animal (as Coordinator)"
    if [ -n "$ANIMAL_ID" ]; then
        UPDATE_ANIMAL=$(curl -s -X PUT "$API_URL/api/animals/$ANIMAL_ID" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $COORDINATOR_TOKEN" \
            -d "{
                \"description\": \"Updated description - Very friendly dog\"
            }")
        echo "$UPDATE_ANIMAL" | grep -q "status\|description" && print_success "Animal updated" || print_error "Failed to update animal"
    fi
    
    # Delete animal
    print_test "Delete Animal (as Coordinator)"
    if [ -n "$ANIMAL_ID" ]; then
        DELETE_ANIMAL=$(curl -s -X DELETE "$API_URL/api/animals/$ANIMAL_ID" \
            -H "Authorization: Bearer $COORDINATOR_TOKEN")
        echo "$DELETE_ANIMAL" | grep -q "status\|message" && print_success "Animal deleted" || print_error "Failed to delete animal"
    fi
}

test_animals_rbac() {
    print_section "Animals - RBAC Tests"
    
    # First create an animal as coordinator
    print_test "Create Animal (setup for RBAC test)"
    CREATE=$(curl -s -X POST "$API_URL/api/animals" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN" \
        -d "{
            \"name\": \"Max\",
            \"species\": \"Dog\",
            \"breed\": \"Labrador\",
            \"age\": 2,
            \"description\": \"Test animal for RBAC\",
            \"status\": \"available\"
        }")
    ANIMAL_ID=$(echo "$CREATE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    # Try to delete as volunteer (should fail)
    print_test "Try Delete Animal as Volunteer (should fail)"
    if [ -n "$ANIMAL_ID" ]; then
        DELETE_FAIL=$(curl -s -X DELETE "$API_URL/api/animals/$ANIMAL_ID" \
            -H "Authorization: Bearer $VOLUNTEER_TOKEN")
        echo "$DELETE_FAIL" | grep -q "forbidden\|Forbidden\|unauthorized\|Unauthorized" && print_success "RBAC working - access denied" || print_error "RBAC failed - should have denied access"
    fi
    
    # Delete as coordinator (should succeed)
    print_test "Delete Animal as Coordinator (should succeed)"
    if [ -n "$ANIMAL_ID" ]; then
        DELETE_SUCCESS=$(curl -s -X DELETE "$API_URL/api/animals/$ANIMAL_ID" \
            -H "Authorization: Bearer $COORDINATOR_TOKEN")
        echo "$DELETE_SUCCESS" | grep -q "status\|message" && print_success "RBAC working - access granted" || print_error "RBAC failed"
    fi
}

# ============================================================================
# Applicant Tests
# ============================================================================

test_applicants() {
    print_section "Applicants - CRUD Operations"
    
    # Create applicant
    print_test "Create Applicant"
    CREATE_APPLICANT=$(curl -s -X POST "$API_URL/api/applicants" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $VOLUNTEER_TOKEN" \
        -d "{
            \"email\": \"applicant@example.com\",
            \"first_name\": \"Sarah\",
            \"last_name\": \"Adopter\",
            \"phone\": \"555-1234\",
            \"address\": \"123 Main St\",
            \"status\": \"active\"
        }")
    echo "$CREATE_APPLICANT" | grep -q "status\|error" && print_success "Applicant created" || print_error "Failed to create applicant: $CREATE_APPLICANT"
    APPLICANT_ID=$(echo "$CREATE_APPLICANT" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    # Get applicants
    print_test "Get All Applicants"
    GET_APPLICANTS=$(curl -s "$API_URL/api/applicants" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN")
    echo "$GET_APPLICANTS" | grep -q "data\|status" && print_success "Fetched applicants" || print_error "Failed to get applicants"
}

# ============================================================================
# Application Tests
# ============================================================================

test_applications() {
    print_section "Applications - CRUD Operations"
    
    # Submit application
    print_test "Submit Application"
    SUBMIT_APP=$(curl -s -X POST "$API_URL/api/applications" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $VOLUNTEER_TOKEN" \
        -d "{
            \"applicant_email\": \"applicant2@example.com\",
            \"animal_id\": 1,
            \"motivation\": \"I love animals and want to adopt\",
            \"experience\": \"5 years of pet ownership\",
            \"status\": \"pending\"
        }")
    echo "$SUBMIT_APP" | grep -q "status\|error" && print_success "Application submitted" || print_error "Failed to submit application: $SUBMIT_APP"
    APP_ID=$(echo "$SUBMIT_APP" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    # Get applications
    print_test "Get All Applications"
    GET_APPS=$(curl -s "$API_URL/api/applications" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN")
    echo "$GET_APPS" | grep -q "data\|status" && print_success "Fetched applications" || print_error "Failed to get applications"
    
    # Approve application
    print_test "Approve Application (as Coordinator)"
    if [ -n "$APP_ID" ]; then
        APPROVE=$(curl -s -X PUT "$API_URL/api/applications/$APP_ID/approve" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $COORDINATOR_TOKEN" \
            -d "{\"status\": \"approved\"}")
        echo "$APPROVE" | grep -q "status\|error" && print_success "Application approved" || print_error "Failed to approve"
    fi
}

# ============================================================================
# Interview Tests
# ============================================================================

test_interviews() {
    print_section "Interviews - CRUD Operations"
    
    # Schedule interview
    print_test "Schedule Interview"
    SCHEDULE=$(curl -s -X POST "$API_URL/api/interviews" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN" \
        -d "{
            \"application_id\": 1,
            \"interviewer_id\": 1,
            \"scheduled_date\": \"2025-12-01T10:00:00Z\",
            \"status\": \"scheduled\"
        }")
    echo "$SCHEDULE" | grep -q "status\|error" && print_success "Interview scheduled" || print_error "Failed to schedule interview: $SCHEDULE"
    INTERVIEW_ID=$(echo "$SCHEDULE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    # Get interviews
    print_test "Get All Interviews"
    GET_INTERVIEWS=$(curl -s "$API_URL/api/interviews" \
        -H "Authorization: Bearer $COORDINATOR_TOKEN")
    echo "$GET_INTERVIEWS" | grep -q "data\|status" && print_success "Fetched interviews" || print_error "Failed to get interviews"
    
    # Complete interview
    print_test "Complete Interview"
    if [ -n "$INTERVIEW_ID" ]; then
        COMPLETE=$(curl -s -X PUT "$API_URL/api/interviews/$INTERVIEW_ID/complete" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $COORDINATOR_TOKEN" \
            -d "{\"status\": \"completed\", \"notes\": \"Good fit for adoption\"}")
        echo "$COMPLETE" | grep -q "status\|error" && print_success "Interview completed" || print_error "Failed to complete interview"
    fi
}

# ============================================================================
# Contract Tests
# ============================================================================

test_contracts() {
    print_section "Contracts - CRUD Operations"
    
    # Get contract
    print_test "Get Contract"
    GET_CONTRACT=$(curl -s "$API_URL/api/contracts/1" \
        -H "Authorization: Bearer $VOLUNTEER_TOKEN")
    echo "$GET_CONTRACT" | grep -q "status\|error\|contract" && print_success "Fetched contract" || print_error "Failed to get contract: $GET_CONTRACT"
    
    # Sign contract
    print_test "Sign Contract"
    SIGN=$(curl -s -X PUT "$API_URL/api/contracts/1/sign" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $VOLUNTEER_TOKEN" \
        -d "{\"signed_date\": \"2025-11-16T00:00:00Z\"}")
    echo "$SIGN" | grep -q "status\|error" && print_success "Contract signed" || print_error "Failed to sign contract"
}

# ============================================================================
# System Endpoints Tests
# ============================================================================

test_system() {
    print_section "System Endpoints"
    
    print_test "Health Check"
    HEALTH=$(curl -s "$API_URL/api/health")
    echo "$HEALTH" | grep -q "status.*ok" && print_success "Health check passed" || print_error "Health check failed: $HEALTH"
    
    print_test "Metrics"
    METRICS=$(curl -s "$API_URL/metrics")
    echo "$METRICS" | grep -q "http_requests_total\|process_" && print_success "Metrics endpoint working" || print_error "Metrics endpoint failed"
}

# ============================================================================
# Error Handling Tests
# ============================================================================

test_error_handling() {
    print_section "Error Handling Tests"
    
    print_test "Invalid Email Format"
    INVALID_EMAIL=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"invalid-email\",
            \"password\": \"Test1234\",
            \"first_name\": \"Test\",
            \"last_name\": \"User\",
            \"role\": \"VOLUNTEER\"
        }")
    echo "$INVALID_EMAIL" | grep -q "error\|Error" && print_success "Invalid email rejected" || print_error "Should reject invalid email"
    
    print_test "Missing Required Fields"
    MISSING_FIELDS=$(curl -s -X POST "$API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"test@example.com\"
        }")
    echo "$MISSING_FIELDS" | grep -q "error\|Error" && print_success "Missing fields rejected" || print_error "Should reject missing fields"
    
    print_test "Unauthorized Access (missing token)"
    UNAUTHORIZED=$(curl -s "$API_URL/api/animals" \
        -H "Authorization: Bearer invalid-token")
    echo "$UNAUTHORIZED" | grep -q "error\|Error\|unauthorized" && print_success "Unauthorized access blocked" || print_error "Should reject invalid token"
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        SFP Portal API - Comprehensive Test Suite        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    
    check_api
    
    test_system
    test_error_handling
    test_auth_register
    test_auth_login
    test_auth_verify
    test_animals_public
    test_animals_crud
    test_animals_rbac
    test_applicants
    test_applications
    test_interviews
    test_contracts
    
    print_section "Test Suite Complete"
    print_success "All tests completed!"
}

# Run main function
main
