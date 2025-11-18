#!/bin/bash
set -euo pipefail

# SFP Portal - Application Endpoint Test Script (no jq required)
# This script logs in as admin, lists applications, fetches details,
# updates an application's status, then re-fetches to confirm.
# Optional: delete an application (commented out by default).
#
# Usage:
#   bash tests/test-applications.sh
#   API_URL=http://localhost:5000 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 bash tests/test-applications.sh
#
# Environment overrides:
API_URL=${API_URL:-"http://localhost:5000"}
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@example.com"}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-"password123"}

header() { echo -e "\n=== $* ==="; }
fail() { echo "ERROR: $*" >&2; exit 1; }

header "1. Admin Login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'"$ADMIN_EMAIL"'","password":"'"$ADMIN_PASSWORD"'"}')
[[ -z "$LOGIN_RESPONSE" ]] && fail "Empty login response"
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || true)
[[ -z "$TOKEN" ]] && { echo "Raw login response:"; echo "$LOGIN_RESPONSE"; fail "Could not extract token"; }
echo "Token acquired (first 40 chars): ${TOKEN:0:40}..."

header "2. Verify Token"
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/api/auth/verify" -H "Authorization: Bearer $TOKEN")
echo "$VERIFY_RESPONSE"

header "3. List All Applications"
APPS_JSON=$(curl -s -X GET "$API_URL/api/applications" -H "Authorization: Bearer $TOKEN")
[[ -z "$APPS_JSON" ]] && fail "Empty applications response"
echo "Raw applications JSON (truncated to 600 chars):"
echo "$APPS_JSON" | head -c 600; echo

# Extract first application id (simple grep parse)
FIRST_ID=$(echo "$APPS_JSON" | grep -o '"id":[0-9]*' | head -n1 | cut -d: -f2 || true)
[[ -z "$FIRST_ID" ]] && fail "Could not extract any application id"
echo "First application id: $FIRST_ID"

header "4. Fetch Application By ID ($FIRST_ID)"
APP_DETAIL=$(curl -s -X GET "$API_URL/api/applications/$FIRST_ID" -H "Authorization: Bearer $TOKEN")
[[ -z "$APP_DETAIL" ]] && fail "Empty application detail response"
echo "$APP_DETAIL" | head -c 400; echo

# Determine current status
CURRENT_STATUS=$(echo "$APP_DETAIL" | grep -o '"status":"[^"]*' | cut -d'"' -f4 || true)
[[ -z "$CURRENT_STATUS" ]] && CURRENT_STATUS="unknown"
echo "Current status: $CURRENT_STATUS"

# Decide next status (cycle through a few)
NEXT_STATUS="under_review"
if [[ "$CURRENT_STATUS" == "under_review" ]]; then NEXT_STATUS="interview_scheduled"; fi
if [[ "$CURRENT_STATUS" == "interview_scheduled" ]]; then NEXT_STATUS="approved"; fi
if [[ "$CURRENT_STATUS" == "approved" ]]; then NEXT_STATUS="rejected"; fi

header "5. Update Application Status -> $NEXT_STATUS"
UPDATE_RESPONSE=$(curl -s -X PATCH "$API_URL/api/applications/$FIRST_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"'"$NEXT_STATUS"'"}')
[[ -z "$UPDATE_RESPONSE" ]] && fail "Empty update response"
echo "$UPDATE_RESPONSE" | head -c 300; echo

NEW_STATUS=$(echo "$UPDATE_RESPONSE" | grep -o '"status":"[^"]*' | cut -d'"' -f4 || true)
echo "Updated status parsed: $NEW_STATUS"

header "6. Re-Fetch to Confirm"
CONFIRM_DETAIL=$(curl -s -X GET "$API_URL/api/applications/$FIRST_ID" -H "Authorization: Bearer $TOKEN")
CONFIRM_STATUS=$(echo "$CONFIRM_DETAIL" | grep -o '"status":"[^"]*' | cut -d'"' -f4 || true)
echo "Confirmed status now: $CONFIRM_STATUS"

# Optional delete (disabled by default for safety)
# header "7. Delete Application (Disabled)"
# DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/api/applications/$FIRST_ID" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_CODE:%{http_code}")
# echo "$DELETE_RESPONSE"

header "Done"
exit 0
