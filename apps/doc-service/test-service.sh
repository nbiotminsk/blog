#!/bin/bash

set -e

BASE_URL="http://localhost:3001"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Testing Doc Service${NC}"
echo "================================"

echo -e "\n${BLUE}1. Testing Health Endpoint${NC}"
curl -s "${BASE_URL}/health" | jq .

echo -e "\n${BLUE}2. Testing Template Parse (by path)${NC}"
curl -s -X POST "${BASE_URL}/templates/parse" \
  -H "Content-Type: application/json" \
  -d '{"path": "carbone-template.html"}' | jq .

echo -e "\n${BLUE}3. Testing Template Parse (by file upload)${NC}"
curl -s -X POST "${BASE_URL}/templates/parse" \
  -F "template=@/tmp/templates/test-template.html" | jq .

echo -e "\n${BLUE}4. Testing Document Render (by path)${NC}"
curl -s -X POST "${BASE_URL}/documents/render" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "carbone-template.html",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2024-01-01",
      "message": "This is a test message"
    }
  }' | jq -r '.filename, .mimeType, .size'

echo -e "\n${BLUE}5. Testing Document Render (by file upload)${NC}"
curl -s -X POST "${BASE_URL}/documents/render" \
  -F "template=@/tmp/templates/carbone-template.html" \
  -F 'data={"name":"Jane Smith","email":"jane@example.com","date":"2024-12-10","message":"File upload test"}' \
  | jq -r '.filename, .mimeType, .size'

echo -e "\n${GREEN}All tests completed successfully!${NC}"
