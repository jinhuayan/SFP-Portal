#!/bin/bash
set -euo pipefail

# SFP Portal API - Minimal Token Usage Examples
# Usage:
#   bash tests/token-examples.sh
#   API_URL=http://localhost:5000 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 bash tests/token-examples.sh

API_URL=${API_URL:-"http://localhost:5000"}
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@example.com"}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-"password123"}

echo "[1/4] Logging in as admin ($ADMIN_EMAIL)" >&2
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'"$ADMIN_EMAIL"'","password":"'"$ADMIN_PASSWORD"'"}')

if [[ -z "$LOGIN_RESPONSE" ]]; then
  echo "Login failed: empty response" >&2
  exit 1
fi

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || true)

if [[ -z "${TOKEN}" ]]; then
  echo "Failed to extract token. Raw response:" >&2
  echo "$LOGIN_RESPONSE" >&2
  exit 1
fi

echo "[2/4] Token acquired (first 50 chars): ${TOKEN:0:50}..." >&2

echo "[3/4] Verifying token" >&2
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/api/auth/verify" -H "Authorization: Bearer $TOKEN")
echo "Verify Response: $VERIFY_RESPONSE" >&2

echo "[4/4] Fetching applications (admin sees all)" >&2
APPS_RESPONSE=$(curl -s -X GET "$API_URL/api/applications" -H "Authorization: Bearer $TOKEN")

echo "Applications JSON:" >&2
echo "$APPS_RESPONSE"

# Optionally output just IDs (basic parse without jq)
echo "\nApplication IDs:" >&2
echo "$APPS_RESPONSE" | grep -o '"id":[0-9]*' | cut -d: -f2 | tr '\n' ' ' | sed 's/ $/\n/' >&2

echo "\nDone." >&2
