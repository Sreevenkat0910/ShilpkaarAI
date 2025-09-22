#!/bin/bash

# =====================================================
# SHILPKAARAI BACKEND FUNCTIONALITY TEST SCRIPT
# =====================================================
# This script tests all backend functionality to ensure everything works

echo "🧪 Starting ShilpkaarAI Backend Functionality Tests..."
echo "=================================================="

# Configuration
BASE_URL="http://localhost:5001/api"
TEST_USER_MOBILE="9999999999"
TEST_USER_EMAIL="test@shilpkaarai.com"
TEST_USER_PASSWORD="testpass123"
TEST_ARTISAN_MOBILE="9999999998"
TEST_ARTISAN_EMAIL="artisan@shilpkaarai.com"
TEST_ARTISAN_PASSWORD="artisanpass123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing: $test_name... "
    
    # Run the test command and capture output
    response=$(eval "$test_command" 2>/dev/null)
    status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo "Response: $response"
    fi
}

# Function to extract JSON value
extract_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\":[^,}]*" | cut -d':' -f2 | tr -d '"' | tr -d ' '
}

# Function to extract token from response
extract_token() {
    local response="$1"
    echo "$response" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

echo "🔍 Testing Server Health..."
run_test "Health Check" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/health" "200"

echo ""
echo "🔐 Testing Authentication System..."

# Test user registration
echo "Testing user registration..."
customer_registration=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test Customer\",
        \"mobile\": \"$TEST_USER_MOBILE\",
        \"email\": \"$TEST_USER_EMAIL\",
        \"password\": \"$TEST_USER_PASSWORD\",
        \"role\": \"customer\"
    }" -w "%{http_code}")

run_test "Customer Registration" "echo '$customer_registration' | tail -c 3" "201"

# Test artisan registration
artisan_registration=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test Artisan\",
        \"mobile\": \"$TEST_ARTISAN_MOBILE\",
        \"email\": \"$TEST_ARTISAN_EMAIL\",
        \"password\": \"$TEST_ARTISAN_PASSWORD\",
        \"role\": \"artisan\",
        \"location\": \"Jaipur, Rajasthan\",
        \"craft\": \"Pottery\"
    }" -w "%{http_code}")

run_test "Artisan Registration" "echo '$artisan_registration' | tail -c 3" "201"

# Test customer login
customer_login=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"mobile\": \"$TEST_USER_MOBILE\",
        \"password\": \"$TEST_USER_PASSWORD\"
    }" -w "%{http_code}")

run_test "Customer Login" "echo '$customer_login' | tail -c 3" "200"

# Test artisan login
artisan_login=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"mobile\": \"$TEST_ARTISAN_MOBILE\",
        \"password\": \"$TEST_ARTISAN_PASSWORD\"
    }" -w "%{http_code}")

run_test "Artisan Login" "echo '$artisan_login' | tail -c 3" "200"

# Extract tokens
CUSTOMER_TOKEN=$(extract_token "$customer_login")
ARTISAN_TOKEN=$(extract_token "$artisan_login")

echo ""
echo "🛍️ Testing Product Management..."

# Test get all products
run_test "Get All Products" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/products/all" "200"

# Test product search
run_test "Product Search" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/products/search?q=pottery'" "200"

# Test get categories
run_test "Get Categories" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/products/categories/all" "200"

# Test create product (artisan only)
product_creation=$(curl -s -X POST "$BASE_URL/products" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ARTISAN_TOKEN" \
    -d "{
        \"name\": \"Test Pottery Vase\",
        \"description\": \"Beautiful handcrafted pottery vase made using traditional techniques\",
        \"price\": 2500,
        \"category\": \"Home Decor\",
        \"images\": [\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"],
        \"tags\": [\"Traditional\", \"Handmade\"],
        \"materials\": [\"Clay\", \"Natural Dyes\"],
        \"stock\": 5
    }" -w "%{http_code}")

run_test "Create Product" "echo '$product_creation' | tail -c 3" "201"

# Extract product ID from response
PRODUCT_ID=$(echo "$product_creation" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

# Test get single product
run_test "Get Single Product" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/products/one?id=$PRODUCT_ID'" "200"

echo ""
echo "🛒 Testing Order Management..."

# Test create order
order_creation=$(curl -s -X POST "$BASE_URL/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $CUSTOMER_TOKEN" \
    -d "{
        \"items\": [{
            \"productId\": \"$PRODUCT_ID\",
            \"quantity\": 1
        }],
        \"shippingAddress\": {
            \"name\": \"Test Customer\",
            \"mobile\": \"$TEST_USER_MOBILE\",
            \"address\": \"123 Test Street\",
            \"city\": \"Mumbai\",
            \"state\": \"Maharashtra\",
            \"pincode\": \"400001\"
        },
        \"paymentMethod\": \"cod\"
    }" -w "%{http_code}")

run_test "Create Order" "echo '$order_creation' | tail -c 3" "201"

# Extract order ID
ORDER_ID=$(echo "$order_creation" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

# Test get customer orders
run_test "Get Customer Orders" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $CUSTOMER_TOKEN' $BASE_URL/orders/myorders" "200"

# Test get artisan orders
run_test "Get Artisan Orders" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $ARTISAN_TOKEN' $BASE_URL/orders/artisan/allorders" "200"

echo ""
echo "⭐ Testing Reviews System..."

# Test create review
review_creation=$(curl -s -X POST "$BASE_URL/reviews" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $CUSTOMER_TOKEN" \
    -d "{
        \"productId\": \"$PRODUCT_ID\",
        \"rating\": 5,
        \"comment\": \"Excellent quality pottery! Very satisfied with the purchase.\"
    }" -w "%{http_code}")

run_test "Create Review" "echo '$review_creation' | tail -c 3" "201"

# Test get product reviews
run_test "Get Product Reviews" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/reviews/product/$PRODUCT_ID'" "200"

# Test get review summary
run_test "Get Review Summary" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/reviews/product/$PRODUCT_ID/summary'" "200"

echo ""
echo "❤️ Testing Favorites System..."

# Test add to favorites
run_test "Add to Favorites" "curl -s -w '%{http_code}' -o /dev/null -X POST -H 'Authorization: Bearer $CUSTOMER_TOKEN' '$BASE_URL/favorites/$PRODUCT_ID'" "201"

# Test get favorites
run_test "Get Favorites" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $CUSTOMER_TOKEN' $BASE_URL/favorites" "200"

# Test check favorite status
run_test "Check Favorite Status" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $CUSTOMER_TOKEN' '$BASE_URL/favorites/check/$PRODUCT_ID'" "200"

echo ""
echo "👨‍🎨 Testing Artisan Management..."

# Test get all artisans
run_test "Get All Artisans" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/artisans/all" "200"

# Test artisan search
run_test "Artisan Search" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/artisans/search?q=pottery'" "200"

# Test get crafts
run_test "Get Crafts" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/artisans/crafts/all" "200"

# Test get locations
run_test "Get Locations" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/artisans/locations/all" "200"

echo ""
echo "📊 Testing Analytics System..."

# Test analytics overview
run_test "Analytics Overview" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $ARTISAN_TOKEN' $BASE_URL/analytics/overview" "200"

# Test sales trend
run_test "Sales Trend" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $ARTISAN_TOKEN' $BASE_URL/analytics/sales-trend" "200"

# Test top products
run_test "Top Products" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $ARTISAN_TOKEN' $BASE_URL/analytics/top-products" "200"

# Test category performance
run_test "Category Performance" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $ARTISAN_TOKEN' $BASE_URL/analytics/category-performance" "200"

echo ""
echo "👤 Testing Profile Management..."

# Test get profile
run_test "Get Profile" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $CUSTOMER_TOKEN' $BASE_URL/profile" "200"

# Test update profile
run_test "Update Profile" "curl -s -w '%{http_code}' -o /dev/null -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer $CUSTOMER_TOKEN' -d '{\"name\":\"Updated Test Customer\"}' $BASE_URL/profile" "200"

echo ""
echo "🔒 Testing Security Features..."

# Test unauthorized access
run_test "Unauthorized Access" "curl -s -w '%{http_code}' -o /dev/null $BASE_URL/profile" "401"

# Test invalid token
run_test "Invalid Token" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer invalid_token' $BASE_URL/profile" "401"

# Test artisan-only endpoint with customer token
run_test "Role-based Access Control" "curl -s -w '%{http_code}' -o /dev/null -H 'Authorization: Bearer $CUSTOMER_TOKEN' $BASE_URL/analytics/overview" "403"

echo ""
echo "🧹 Cleaning up test data..."

# Remove test data
curl -s -X DELETE -H "Authorization: Bearer $ARTISAN_TOKEN" "$BASE_URL/products/$PRODUCT_ID" > /dev/null
curl -s -X DELETE -H "Authorization: Bearer $CUSTOMER_TOKEN" "$BASE_URL/favorites/$PRODUCT_ID" > /dev/null

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Backend is working perfectly.${NC}"
    echo ""
    echo "✅ Authentication System: Working"
    echo "✅ Product Management: Working"
    echo "✅ Order Management: Working"
    echo "✅ Reviews System: Working"
    echo "✅ Favorites System: Working"
    echo "✅ Artisan Management: Working"
    echo "✅ Analytics System: Working"
    echo "✅ Profile Management: Working"
    echo "✅ Security Features: Working"
    echo ""
    echo "🚀 Backend is ready for production!"
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please check the errors above.${NC}"
    echo ""
    echo "Common issues to check:"
    echo "1. MongoDB is running and accessible"
    echo "2. Database is properly set up with collections and indexes"
    echo "3. Environment variables are correctly configured"
    echo "4. Server is running on port 5001"
    echo "5. All dependencies are installed"
fi

echo ""
echo "🔗 Useful endpoints for manual testing:"
echo "  Health Check: $BASE_URL/health"
echo "  API Documentation: $BASE_URL"
echo "  Product Search: $BASE_URL/products/search?q=pottery"
echo "  Artisan Search: $BASE_URL/artisans/search?q=pottery"
echo ""
