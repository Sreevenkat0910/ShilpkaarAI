-- =====================================================
-- SUPABASE DATABASE RECREATION COMMANDS
-- =====================================================
-- Run these commands in your Supabase SQL Editor
-- This will delete all existing data and recreate the database

-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES (CAREFUL!)
-- =====================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- STEP 2: CREATE TABLES WITH PROPER STRUCTURE
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (replaces MongoDB User model)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'artisan', 'admin')),
    email VARCHAR(255),
    location VARCHAR(255),
    region VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    craft VARCHAR(100),
    crafts TEXT[],
    experience INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    products_count INTEGER DEFAULT 0,
    techniques TEXT[],
    specializations TEXT[],
    certifications TEXT[],
    languages TEXT[],
    bio TEXT,
    workshop_offered BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (replaces MongoDB Product model)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    images TEXT[],
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    stock INTEGER DEFAULT 0,
    tags TEXT[],
    materials TEXT[],
    craft VARCHAR(100),
    color TEXT[],
    size VARCHAR(50),
    condition VARCHAR(20) DEFAULT 'new',
    availability VARCHAR(20) DEFAULT 'in_stock',
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    search_keywords TEXT[],
    dimensions JSONB,
    weight INTEGER,
    craft_story TEXT,
    care_instructions TEXT,
    artisan_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artisan_name VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (replaces MongoDB Order model)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cod', 'online', 'upi')),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (for order details)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (replaces MongoDB Review model)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Favorites table (replaces MongoDB Favorite model)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_craft ON users(craft);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_rating ON users(rating);
CREATE INDEX idx_users_verified ON users(is_verified);

-- Product indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_artisan_id ON products(artisan_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_trending ON products(trending);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Review indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Favorite indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- =====================================================
-- STEP 4: CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger for order number generation
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Function to update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product rating and review count
    UPDATE products 
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for review rating updates
CREATE TRIGGER trigger_update_product_rating_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER trigger_update_product_rating_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER trigger_update_product_rating_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- Function to update user products count
CREATE OR REPLACE FUNCTION update_user_products_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users 
        SET products_count = products_count + 1 
        WHERE id = NEW.artisan_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users 
        SET products_count = products_count - 1 
        WHERE id = OLD.artisan_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for product count updates
CREATE TRIGGER trigger_update_user_products_count_insert
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_user_products_count();

CREATE TRIGGER trigger_update_user_products_count_delete
    AFTER DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_user_products_count();

-- =====================================================
-- STEP 5: INSERT SAMPLE DATA
-- =====================================================

-- Insert sample users (artisans and customers)
INSERT INTO users (name, mobile, password, role, email, location, craft, experience, rating, is_verified, bio) VALUES
('Priya Sharma', '9876543210', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'priya@example.com', 'Varanasi, Uttar Pradesh', 'Textile Weaving', 15, 4.9, true, 'Master weaver specializing in Banarasi silk sarees'),
('Kavitha Reddy', '9876543215', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'kavitha@example.com', 'Hyderabad, Telangana', 'Textile Weaving', 12, 4.7, true, 'Expert in handwoven cotton textiles'),
('Rajesh Kumar', '9876543211', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'rajesh@example.com', 'Jaipur, Rajasthan', 'Blue Pottery', 12, 4.8, true, 'Traditional blue pottery artisan'),
('Rajeshwar Singh', '9876543212', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'rajeshwar@example.com', 'Udaipur, Rajasthan', 'Miniature Painting', 19, 4.8, true, 'Master miniature painter'),
('Sunita Devi', '9876543213', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'sunita@example.com', 'Madhubani, Bihar', 'Madhubani Painting', 25, 4.9, true, 'Traditional Madhubani painting artist'),
('Hari Prasad', '9876543214', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'artisan', 'hari@example.com', 'Moradabad, Uttar Pradesh', 'Metalwork', 16, 4.6, true, 'Expert in brass metalwork'),
('Test Customer', '9999999999', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'customer', 'customer@example.com', 'Mumbai, Maharashtra', NULL, 0, 0.0, false, 'Regular customer');

-- Insert sample products
INSERT INTO products (name, description, price, original_price, images, category, artisan_id, artisan_name, stock, tags, materials, rating, review_count) VALUES
('Handwoven Banarasi Silk Saree', 'Beautiful handwoven Banarasi silk saree with intricate zari work', 2500.00, 3000.00, ARRAY['https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=400'], 'Textiles', (SELECT id FROM users WHERE mobile = '9876543210'), 'Priya Sharma', 5, ARRAY['silk', 'banarasi', 'handwoven', 'zari'], ARRAY['Pure Silk', 'Zari Thread', 'Traditional Weaving'], 4.9, 12),
('Handwoven Cotton Dupatta', 'Beautiful handwoven cotton dupatta with traditional patterns', 600.00, 800.00, ARRAY['https://images.unsplash.com/photo-1632726733402-4a059a476028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0ZXh0aWxlcyUyMHdlYXZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMnww&ixlib=rb-4.1.0&q=80&w=400'], 'Textiles', (SELECT id FROM users WHERE mobile = '9876543215'), 'Kavitha Reddy', 15, ARRAY['cotton', 'dupatta', 'handwoven', 'traditional'], ARRAY['Pure Cotton', 'Traditional Patterns', 'Natural Dyes'], 4.7, 8),
('Terracotta Plant Pot Set', 'Set of three handcrafted terracotta plant pots with traditional designs', 800.00, NULL, ARRAY['https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIwMHww&ixlib=rb-4.1.0&q=80&w=400'], 'Pottery', (SELECT id FROM users WHERE mobile = '9876543211'), 'Rajesh Kumar', 12, ARRAY['terracotta', 'plant pots', 'traditional', 'handcrafted'], ARRAY['Clay', 'Natural Finish', 'Traditional Designs'], 4.8, 6),
('Silver Filigree Necklace', 'Delicate silver filigree necklace with intricate wirework', 1200.00, 1500.00, ARRAY['https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbWFraW5nJTIwY3JhZnRzfGVufDF8fHx8MTc1ODM2NjIwNXww&ixlib=rb-4.1.0&q=80&w=400'], 'Jewelry', (SELECT id FROM users WHERE mobile = '9876543212'), 'Rajeshwar Singh', 6, ARRAY['silver', 'filigree', 'necklace', 'handcrafted'], ARRAY['Sterling Silver', 'Traditional Wire'], 4.8, 4),
('Traditional Brass Lamp', 'Elegant brass decorative lamp with intricate engravings', 2200.00, NULL, ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGxhbXB8ZW58MXx8fHwxNzU4MzY2MjE0fDA&ixlib=rb-4.1.0&q=80&w=400'], 'Metalwork', (SELECT id FROM users WHERE mobile = '9876543213'), 'Sunita Devi', 4, ARRAY['brass', 'lamp', 'decorative', 'traditional'], ARRAY['Brass', 'Traditional Engravings', 'Natural Finish'], 4.9, 7),
('Wooden Spice Box Set', 'Traditional wooden spice box set with multiple compartments', 1500.00, NULL, ARRAY['https://images.unsplash.com/photo-1595126035905-21b5c2b67c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMGluZGlhbiUyMGFydGlzYW58ZW58MXx8fHx8MTc1ODM2NjIwN3ww&ixlib=rb-4.1.0&q=80&w=400'], 'Woodwork', (SELECT id FROM users WHERE mobile = '9876543214'), 'Hari Prasad', 7, ARRAY['wooden', 'spice box', 'hand carved', 'sustainable'], ARRAY['Teak Wood', 'Natural Finish', 'Traditional Carving'], 4.6, 3);

-- =====================================================
-- STEP 6: CREATE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Artisans can insert their own products" ON products FOR INSERT WITH CHECK (auth.uid() = artisan_id);
CREATE POLICY "Artisans can update their own products" ON products FOR UPDATE USING (auth.uid() = artisan_id);
CREATE POLICY "Artisans can delete their own products" ON products FOR DELETE USING (auth.uid() = artisan_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Artisans can view orders for their products" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = orders.id AND p.artisan_id = auth.uid()
    )
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This completes the database recreation
-- Your Supabase database is now ready with:
-- ✅ All tables created with proper relationships
-- ✅ Indexes for optimal performance
-- ✅ Triggers for automatic updates
-- ✅ Sample data for testing
-- ✅ Row Level Security policies
-- ✅ Functions for order numbering and rating updates

-- Next steps:
-- 1. Update your backend environment variables
-- 2. Deploy to Vercel
-- 3. Test all endpoints
