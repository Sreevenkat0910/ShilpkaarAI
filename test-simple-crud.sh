#!/bin/bash

# Simple CRUD Operations Test Script
echo "🧪 Testing CRUD Operations"
echo "========================="

BASE_URL="http://localhost:5001/api"

# Test 1: Health Check
echo "1. Testing Health Check..."
health_response=$(curl -s http://localhost:5001/api/health)
if echo "$health_response" | grep -q "OK"; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi

# Test 2: Login
echo "2. Testing Login..."
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"mobile":"9876543210","password":"password123"}')

if echo "$login_response" | grep -q "Login successful"; then
    echo "   ✅ Login successful"
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo "   ❌ Login failed"
    exit 1
fi

# Test 3: Get User Profile
echo "3. Testing Get User Profile..."
profile_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/auth/me")
if echo "$profile_response" | grep -q "Priya Sharma"; then
    echo "   ✅ Get user profile successful"
else
    echo "   ❌ Get user profile failed"
fi

# Test 4: Get Products
echo "4. Testing Get Products..."
products_response=$(curl -s "$BASE_URL/products/all")
if echo "$products_response" | grep -q "Handwoven Banarasi Silk Saree"; then
    echo "   ✅ Get products successful"
else
    echo "   ❌ Get products failed"
fi

# Test 5: Add to Favorites
echo "5. Testing Add to Favorites..."
favorite_response=$(curl -s -X POST "$BASE_URL/favorites" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"product_id":"626fffb8-4e33-49ed-ace9-b749aadbd8cd"}')

if echo "$favorite_response" | grep -q "Added to favorites"; then
    echo "   ✅ Add to favorites successful"
else
    echo "   ❌ Add to favorites failed"
fi

# Test 6: Get Favorites
echo "6. Testing Get Favorites..."
favorites_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/favorites")
if echo "$favorites_response" | grep -q "626fffb8-4e33-49ed-ace9-b749aadbd8cd"; then
    echo "   ✅ Get favorites successful"
else
    echo "   ❌ Get favorites failed"
fi

# Test 7: Remove from Favorites
echo "7. Testing Remove from Favorites..."
remove_response=$(curl -s -X DELETE "$BASE_URL/favorites/626fffb8-4e33-49ed-ace9-b749aadbd8cd" \
    -H "Authorization: Bearer $TOKEN")

if echo "$remove_response" | grep -q "Removed from favorites"; then
    echo "   ✅ Remove from favorites successful"
else
    echo "   ❌ Remove from favorites failed"
fi

# Test 8: Create Order
echo "8. Testing Create Order..."
order_response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"items":[{"product_id":"626fffb8-4e33-49ed-ace9-b749aadbd8cd","quantity":1,"price":2500}],"total_amount":2500,"shipping_address":{"name":"Test User","address":"Test Address"}}')

if echo "$order_response" | grep -q "Order created successfully"; then
    echo "   ✅ Create order successful"
    ORDER_ID=$(echo "$order_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
else
    echo "   ❌ Create order failed"
    echo "   Response: $order_response"
fi

# Test 9: Get Orders
echo "9. Testing Get Orders..."
orders_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/orders/myorders")
if echo "$orders_response" | grep -q "orders"; then
    echo "   ✅ Get orders successful"
else
    echo "   ❌ Get orders failed"
fi

# Test 10: Create Review
echo "10. Testing Create Review..."
review_response=$(curl -s -X POST "$BASE_URL/reviews" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"product_id":"626fffb8-4e33-49ed-ace9-b749aadbd8cd","rating":5,"comment":"Excellent product!"}')

if echo "$review_response" | grep -q "Review created successfully"; then
    echo "   ✅ Create review successful"
else
    echo "   ❌ Create review failed"
fi

# Test 11: Get Analytics
echo "11. Testing Get Analytics..."
analytics_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/analytics/overview")
if echo "$analytics_response" | grep -q "totalProducts"; then
    echo "   ✅ Get analytics successful"
else
    echo "   ❌ Get analytics failed"
fi

# Test 12: Get Artisan Profile
echo "12. Testing Get Artisan Profile..."
artisan_response=$(curl -s "$BASE_URL/artisans/9caead92-24e3-457d-8d94-073c54e36cd2")
if echo "$artisan_response" | grep -q "Priya Sharma"; then
    echo "   ✅ Get artisan profile successful"
else
    echo "   ❌ Get artisan profile failed"
fi

echo ""
echo "🎉 CRUD Operations Test Complete!"
echo "All major operations have been tested."
