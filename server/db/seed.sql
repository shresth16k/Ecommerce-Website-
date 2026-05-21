-- Seed Data for Shopora

-- Insert Admin User (password: admin123, hashed using SHA-256: 240a10a68a3b895a92a2a09a5676747d9d0383b7f14b6ff9a1752dc49f7e53f1)
-- Insert Regular User (password: user123, hashed using SHA-256: 5be22d3a39e8a8670df5771db06a6bfa9e3be538df07d10c226a315e13511eb9)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Shopora Admin', 'admin@shopora.com', '240a10a68a3b895a92a2a09a5676747d9d0383b7f14b6ff9a1752dc49f7e53f1', 'admin'),
('Jane Doe', 'jane@example.com', '5be22d3a39e8a8670df5771db06a6bfa9e3be538df07d10c226a315e13511eb9', 'user');

-- Insert Products
INSERT INTO products (name, description, price, image_url, category, stock, rating, reviews_count, is_featured, is_new, discount) VALUES
-- 1. Minimalist Tote Bag
('Minimalist Tote Bag', 'Crafted from premium vegan leather, this structured tote bag offers a spacious interior, zip-top closure, and sleek design perfect for daily essentials and tablets.', 49.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', 'Bags', 25, 4.8, 126, 1, 0, 0),

-- 2. Classic White Sneakers
('Classic White Sneakers', 'Minimalist low-top sneakers constructed with durable full-grain leather, OrthoLite cushioning, and a flexible rubber cupsole. Perfect match for casual or smart style.', 69.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600', 'Shoes', 18, 4.6, 98, 1, 0, 0),

-- 3. Elegant Black Watch
('Elegant Black Watch', 'An exquisite time-keeper featuring an ultra-thin matte black dial, Swiss quartz movement, scratch-resistant sapphire glass, and a breathable mesh steel strap.', 129.99, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600', 'Watches', 12, 4.9, 78, 1, 1, 0),

-- 4. Pure Bloom Perfume
('Pure Bloom Perfume', 'An elegant fragrance blending notes of fresh jasmine, soft white rose, sweet vanilla, and rich sandalwood. Captures comfort and sophistication in a heavy glass bottle.', 59.99, 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600', 'Beauty', 30, 4.7, 55, 1, 0, 0),

-- 5. UV Protection Sunglasses
('UV Protection Sunglasses', 'Timeless geometric frames offering full UV400 protective lenses. Lightweight acetate construction ensures comfort while adding a premium accent to your summer wear.', 39.99, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600', 'Sunglasses', 15, 4.5, 63, 1, 0, 20),

-- 6. Wireless Headphones
('Wireless Headphones', 'Over-ear headphones featuring hybrid active noise cancellation, high-fidelity audio drivers, 40 hours of battery life, and plush memory foam earcups.', 89.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', 'Electronics', 40, 4.8, 111, 1, 0, 0),

-- Additional Bags
('Leather Backpack', 'High-end pebbled leather backpack with dedicated 15-inch laptop sleeve, padded shoulder straps, and gold-plated hardware closures.', 119.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600', 'Bags', 10, 4.7, 45, 0, 1, 0),
('Canvas Crossbody', 'Durable, lightweight canvas messenger bag with adjustable strap, dual front pockets, and water-resistant interior lining.', 34.99, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600', 'Bags', 50, 4.4, 28, 0, 0, 10),

-- Additional Shoes
('Premium Leather Loafers', 'Hand-stitched Italian leather loafers featuring a cushioned footbed and durable slip-resistant leather soles. Timeless business casual footwear.', 89.99, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600', 'Shoes', 14, 4.8, 37, 0, 0, 0),
('Athletic Running Shoes', 'High-performance running shoes engineered with breathable knit mesh, energy-returning foam midsoles, and traction rubber outsoles.', 79.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', 'Shoes', 22, 4.5, 84, 0, 0, 15),

-- Additional Watches
('Smart Active Watch', 'Fitness tracker and smartwatch with AMOLED display, optical heart rate monitor, sleep analysis, built-in GPS, and 7-day battery life.', 149.99, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600', 'Watches', 20, 4.7, 92, 0, 1, 0),
('Minimalist Silver Watch', 'Polished stainless steel watch with clean white dial and sub-seconds window, Japanese quartz movement, and matching link bracelet.', 99.99, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600', 'Watches', 15, 4.6, 51, 0, 0, 0),

-- Additional Beauty
('Hydrating Face Serum', 'Formulated with hyaluronic acid, vitamin B5, and botanical extracts to restore moisture barrier and provide a natural glowing finish.', 28.99, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600', 'Beauty', 60, 4.8, 142, 0, 0, 0),
('Matte Liquid Lipstick', 'Long-wear, transfer-proof matte liquid lipstick offering deep pigmentation and weightless wear all day long.', 18.99, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600', 'Beauty', 80, 4.3, 67, 0, 0, 0),

-- Additional Sunglasses
('Classic Aviator Sunglasses', 'Premium polarized sunglasses with slim golden metal frames, dark green lenses, and adjustable silicone nosepads.', 54.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600', 'Sunglasses', 35, 4.6, 73, 0, 0, 5),

-- Additional Electronics
('Ergonomic Mechanical Keyboard', 'Compact 75% mechanical keyboard with hot-swappable tactile switches, double-shot PBT keycaps, and multi-color RGB backlighting.', 109.99, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600', 'Electronics', 15, 4.9, 41, 0, 1, 0),
('Noise Cancelling Earbuds', 'True wireless earbuds with active noise cancellation, wireless charging case, touch controls, and IPX7 sweat resistance.', 74.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600', 'Electronics', 25, 4.4, 88, 0, 0, 0),

-- Clothing (Men / Women)
('Men''s Slim Fit Shirt', 'Premium oxford cotton button-down shirt with a clean tailored silhouette, adjustable button cuffs, and classic collar.', 44.99, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600', 'Men', 35, 4.5, 49, 0, 0, 0),
('Men''s Denim Jacket', 'Classic rugged denim jacket with button flap chest pockets, adjustable waist tabs, and durable metal hardware.', 64.99, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600', 'Men', 18, 4.7, 34, 0, 0, 10),
('Women''s Trench Coat', 'Timeless double-breasted trench coat with adjustable waist belt, storm flaps, notch collar, and water-repellent finish.', 129.99, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600', 'Women', 12, 4.8, 58, 0, 1, 0),
('Floral Summer Dress', 'Flowing lightweight wrap dress featuring a colorful floral print, V-neckline, and feminine ruffled hem.', 54.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', 'Women', 24, 4.6, 72, 0, 0, 0);


-- Seed some reviews for the first product (Minimalist Tote Bag)
INSERT INTO reviews (product_id, user_name, rating, comment) VALUES
(1, 'Emily Johnson', 5, 'Absolutely love this bag! The leather is incredibly soft and looks very high end. Fits my iPad and water bottle perfectly.'),
(1, 'Michael Smith', 4, 'Very nice design. The strap is durable, but I wish there were a few more zipper compartments inside.'),
(1, 'Sophia Brown', 5, 'Perfect everyday tote! I get compliments on it all the time. Will buy in other colors too!');

-- Seed some reviews for the third product (Elegant Black Watch)
INSERT INTO reviews (product_id, user_name, rating, comment) VALUES
(3, 'David Wilson', 5, 'Sleek, lightweight, and keeps perfect time. The mesh strap is extremely comfortable. Worth every penny.'),
(3, 'Emma Davis', 5, 'Beautiful minimalist design. The black finish has not scratched at all. Highly recommend!');
