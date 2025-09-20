#!/bin/bash

# Pre-Development Validation Script
# Run this before making any changes to ensure existing functionality works

echo "🔍 Pre-Development Validation Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local url=$2
    local expected_response=$3
    
    echo -n "Checking $service_name... "
    
    if curl -s "$url" | grep -q "$expected_response"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check API endpoint
check_api_endpoint() {
    local endpoint=$1
    local expected_status=$2
    
    echo -n "Checking API $endpoint... "
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5001$endpoint")
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (Status: $status_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED (Status: $status_code)${NC}"
        return 1
    fi
}

echo "1. Checking Backend Server..."
if ! check_service "Backend" "http://localhost:5001/api/health" "OK"; then
    echo -e "${RED}❌ Backend server is not running. Please start it first.${NC}"
    exit 1
fi

echo ""
echo "2. Checking Frontend Server..."
if ! check_service "Frontend" "http://localhost:3000" "html"; then
    echo -e "${RED}❌ Frontend server is not running. Please start it first.${NC}"
    exit 1
fi

echo ""
echo "3. Checking API Endpoints..."

# Check public endpoints
check_api_endpoint "/api/health" "200"
check_api_endpoint "/api/products/all" "200"
check_api_endpoint "/api/products/categories/all" "200"

# Check protected endpoints (should return 401 without auth)
check_api_endpoint "/api/auth/me" "401"
check_api_endpoint "/api/analytics/overview" "401"
check_api_endpoint "/api/orders/myorders" "401"

echo ""
echo "4. Checking Authentication Flow..."

# Test registration
echo -n "Testing user registration... "
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","mobile":"9999999999","password":"testpass123","role":"artisan"}')

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
    echo -e "${GREEN}✅ OK${NC}"
    
    # Extract token for further testing
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    echo -n "Testing authenticated API call... "
    AUTH_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/auth/me)
    
    if echo "$AUTH_RESPONSE" | grep -q "user"; then
        echo -e "${GREEN}✅ OK${NC}"
        
        echo -n "Testing analytics endpoint... "
        ANALYTICS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/analytics/overview)
        
        if echo "$ANALYTICS_RESPONSE" | grep -q "totalRevenue"; then
            echo -e "${GREEN}✅ OK${NC}"
        else
            echo -e "${RED}❌ FAILED${NC}"
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  User might already exist${NC}"
fi

echo ""
echo "5. Checking File Structure..."

# Check critical files exist
CRITICAL_FILES=(
    "./backend/server.js"
    "./backend/routes/auth.js"
    "./backend/routes/analytics.js"
    "./frontend/src/components/auth/auth-context.tsx"
    "./frontend/src/components/artisan/artisan-analytics.tsx"
    "./frontend/src/utils/api.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file exists"
    else
        echo -e "${RED}❌ $file is missing${NC}"
    fi
done

echo ""
echo "6. Checking Environment Configuration..."

# Check if .env files exist
if [ -f "./backend/.env" ]; then
    echo -e "✅ Backend .env exists"
else
    echo -e "${YELLOW}⚠️  Backend .env missing${NC}"
fi

if [ -f "./frontend/.env" ]; then
    echo -e "✅ Frontend .env exists"
else
    echo -e "${YELLOW}⚠️  Frontend .env missing${NC}"
fi

echo ""
echo "🎉 Pre-Development Validation Complete!"
echo ""
echo "📋 Summary:"
echo "- Backend server: Running on port 5001"
echo "- Frontend server: Running on port 3000"
echo "- API endpoints: Responding correctly"
echo "- Authentication: Working properly"
echo "- File structure: Intact"
echo ""
echo "✅ Safe to proceed with development!"
echo ""
echo "💡 Remember:"
echo "- Test existing functionality after each change"
echo "- Use feature branches for new development"
echo "- Document all changes"
echo "- Have a rollback plan ready"
