# Product ID Management Guide

## Issue Resolved: Product Not Found (404 Errors)

### Root Cause
The "Product Not Found" 404 errors were caused by hardcoded product IDs in the frontend `explore-page.tsx` that became stale after database reseeding. When the database was reseeded, new MongoDB ObjectIds were generated, but the frontend still referenced the old IDs.

### Solution Applied
1. ✅ **Reseeded Database**: Ran `node seed.js` to populate database with updated Product schema
2. ✅ **Updated Product IDs**: Modified hardcoded IDs in `frontend/src/components/marketplace/explore-page.tsx`:
   - Handwoven Banarasi Silk Saree: `68cfdcc1fe3c34d61b7f85dc`
   - Blue Pottery Dinner Set: `68cfdcc1fe3c34d61b7f85e2`
   - Silver Filigree Earrings: `68cfdcc1fe3c34d61b7f85e4`
   - Madhubani Painting: `68cfdcc1fe3c34d61b7f85ea`
   - Brass Decorative Lamp: `68cfdcc1fe3c34d61b7f85ec`
3. ✅ **Verified API Endpoints**: Confirmed all product endpoints are working correctly

### Prevention Strategy

#### 1. Avoid Hardcoded Product IDs
- **Never hardcode MongoDB ObjectIds** in frontend components
- Use dynamic fetching from API endpoints instead
- If sample data is needed, fetch it from `/api/products/all` endpoint

#### 2. Better Frontend Architecture
```typescript
// ❌ Don't do this (hardcoded IDs)
const trendingProducts = [
  { id: '68cfdcc1fe3c34d61b7f85dc', name: 'Product Name' }
];

// ✅ Do this instead (dynamic fetching)
const [trendingProducts, setTrendingProducts] = useState([]);
useEffect(() => {
  fetch('/api/products/all?count=5&featured=true')
    .then(res => res.json())
    .then(data => setTrendingProducts(data.productsData));
}, []);
```

#### 3. Database Development Workflow
1. **Before reseeding**: Note that it will invalidate hardcoded IDs
2. **After reseeding**: Update any hardcoded references in frontend
3. **Consider using**: Stable product slugs instead of ObjectIds for URLs

#### 4. Development Best Practices
- Use API endpoints for all product data
- Implement proper error handling for missing products
- Add fallback mechanisms for demo/sample data
- Document any hardcoded IDs and their purpose

### Files That May Need Updates After Reseeding
- `frontend/src/components/marketplace/explore-page.tsx` (✅ Updated)
- Check for other files with hardcoded ObjectIds using: `grep -r "68c[a-f0-9]{21}" frontend/src/`

### Testing Checklist
- [ ] Navigate to Explore page
- [ ] Click on trending products
- [ ] Verify product detail pages load correctly
- [ ] Check AI picks section
- [ ] Test product catalog functionality

### Emergency Fix Command
If product IDs become stale again:
```bash
# Get current product IDs
curl "http://localhost:5001/api/products/all?count=10" | jq '.productsData[] | {_id, name}'

# Find hardcoded IDs in frontend
grep -r "68c[a-f0-9]{21}" frontend/src/

# Update the IDs in explore-page.tsx manually
```

---
**Last Updated**: September 21, 2025
**Issue Status**: ✅ RESOLVED
