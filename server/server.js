import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper: SHA-256 Hashing for passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

// Register
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  const hashedPassword = hashPassword(password);
  
  try {
    const result = await query.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: result.id, name, email, role: 'user' }
    });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const hashedPassword = hashPassword(password);

  try {
    const { row } = await query.get(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (!row || row.password_hash !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful!',
      user: { id: row.id, name: row.name, email: row.email, role: row.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------------------------------------------------
// PRODUCT ROUTES
// ----------------------------------------------------

// Get all products (with filtering, searching, sorting, and pricing)
app.get('/api/products', async (req, res) => {
  const { q, category, sortBy, sortOrder, minPrice, maxPrice } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    const searchParam = `%${q}%`;
    params.push(searchParam, searchParam);
  }

  if (category && category !== 'All' && category !== 'View All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (minPrice) {
    sql += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  // Sorting
  const allowedSortBy = ['price', 'rating', 'name', 'created_at'];
  const allowedSortOrder = ['ASC', 'DESC'];

  const finalSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'id';
  const finalSortOrder = allowedSortOrder.includes(sortOrder?.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

  sql += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

  try {
    const { rows, duration } = await query.all(sql, params);
    res.json({ products: rows, dbQueryTimeMs: duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product details with reviews
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await query.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!productResult.row) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const reviewsResult = await query.all(
      'SELECT id, user_name, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      product: productResult.row,
      reviews: reviewsResult.rows,
      dbQueryTimeMs: (parseFloat(productResult.duration) + parseFloat(reviewsResult.duration)).toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (Admin only)
app.post('/api/products', async (req, res) => {
  const { name, description, price, image_url, category, stock, discount, is_featured, is_new } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  try {
    const result = await query.run(
      `INSERT INTO products (name, description, price, image_url, category, stock, discount, is_featured, is_new)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        parseFloat(price),
        image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
        category,
        parseInt(stock) || 0,
        parseInt(discount) || 0,
        is_featured ? 1 : 0,
        is_new ? 1 : 0
      ]
    );
    res.status(201).json({ message: 'Product created successfully!', id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, stock, discount, is_featured, is_new } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  try {
    const result = await query.run(
      `UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, discount = ?, is_featured = ?, is_new = ?
       WHERE id = ?`,
      [
        name,
        description,
        parseFloat(price),
        image_url,
        category,
        parseInt(stock) || 0,
        parseInt(discount) || 0,
        is_featured ? 1 : 0,
        is_new ? 1 : 0,
        id
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query.run('DELETE FROM products WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------------------------------------------------
// REVIEW ROUTES
// ----------------------------------------------------

// Submit product review
app.post('/api/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { user_name, rating, comment } = req.body;

  if (!user_name || !rating) {
    return res.status(400).json({ error: 'User name and rating are required.' });
  }

  try {
    // 1. Insert review
    await query.run(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [id, user_name, parseInt(rating), comment || '']
    );

    // 2. Recalculate average rating & reviews_count for product
    const statsResult = await query.get(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?',
      [id]
    );

    const count = statsResult.row.count;
    const avgRating = parseFloat(statsResult.row.avg_rating).toFixed(1);

    await query.run(
      'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
      [avgRating, count, id]
    );

    res.status(201).json({ message: 'Review added successfully!', avgRating, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------------------------------------------------
// ORDER ROUTES
// ----------------------------------------------------

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
  const { user_id, items, shipping_name, shipping_address, shipping_city, shipping_postal, payment_method } = req.body;

  if (!items || items.length === 0 || !shipping_name || !shipping_address || !shipping_city || !shipping_postal) {
    return res.status(400).json({ error: 'Please provide checkout details and cart items.' });
  }

  try {
    // 1. Calculate total and verify stock
    let totalAmount = 0;
    const productUpdates = [];

    for (const item of items) {
      const productResult = await query.get('SELECT price, stock, discount FROM products WHERE id = ?', [item.product_id]);
      const product = productResult.row;
      if (!product) {
        return res.status(404).json({ error: `Product with id ${item.product_id} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product id ${item.product_id}.` });
      }

      const discountedPrice = product.price; // Discount applied in client or already base price? Base price is discounted price in seed DB
      totalAmount += discountedPrice * item.quantity;

      productUpdates.push({
        id: item.product_id,
        newStock: product.stock - item.quantity
      });
    }

    // 2. Insert Order
    const orderResult = await query.run(
      `INSERT INTO orders (user_id, total_amount, shipping_name, shipping_address, shipping_city, shipping_postal, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, totalAmount, shipping_name, shipping_address, shipping_city, shipping_postal, payment_method || 'Credit Card']
    );
    const orderId = orderResult.id;

    // 3. Insert Order Items & update stock
    for (const item of items) {
      // Get the price
      const { row: p } = await query.get('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await query.run(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, p.price]
      );
    }

    // Update stocks
    for (const update of productUpdates) {
      await query.run('UPDATE products SET stock = ? WHERE id = ?', [update.newStock, update.id]);
    }

    res.status(201).json({
      message: 'Order created successfully!',
      orderId,
      totalAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Orders
app.get('/api/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const ordersResult = await query.all(
      `SELECT o.*, 
       (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as total_items 
       FROM orders o WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Hydrate each order with its items
    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await query.all(
        `SELECT oi.*, p.name, p.image_url 
         FROM order_items oi 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      orders.push({
        ...order,
        items: itemsResult.rows
      });
    }

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------------------------------------------------
// ADMIN ROUTES
// ----------------------------------------------------

// Admin Dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const productsCount = await query.get('SELECT COUNT(*) as count FROM products');
    const usersCount = await query.get('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const ordersCount = await query.get('SELECT COUNT(*) as count FROM orders');
    const revenueSum = await query.get('SELECT SUM(total_amount) as total FROM orders');
    const lowStock = await query.all('SELECT name, stock, price FROM products WHERE stock < 5 ORDER BY stock ASC');

    res.json({
      stats: {
        products: productsCount.row.count,
        users: usersCount.row.count,
        orders: ordersCount.row.count,
        revenue: (revenueSum.row.total || 0).toFixed(2)
      },
      lowStock: lowStock.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Raw SQL shell (benchmarks query execution speed)
app.post('/api/admin/query', async (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'SQL query string required.' });
  }

  // Security: only allow read queries (SELECT) to avoid arbitrary DB corruption in this interface
  const cleanSql = sql.trim();
  if (!cleanSql.toLowerCase().startsWith('select')) {
    return res.status(400).json({ error: 'For safety, only SELECT queries are permitted in this console.' });
  }

  try {
    const { rows, duration } = await query.all(cleanSql);
    res.json({
      rows,
      durationMs: duration
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
