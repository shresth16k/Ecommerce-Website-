import React, { useContext, useEffect, useState } from 'react';
import { Terminal, Shield, PlusCircle, Trash, Edit2, Play } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Admin = () => {
  const { runAdminQuery, fetchProducts, products } = useContext(AppContext);
  
  // Dashboard Stats
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: '0.00' });
  const [lowStock, setLowStock] = useState([]);

  // Product CRUD Form States
  const [editingId, setEditingId] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Bags');
  const [prodStock, setProdStock] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodDiscount, setProdDiscount] = useState('0');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodNew, setProdNew] = useState(false);
  const [crudError, setCrudError] = useState('');
  const [crudSuccess, setCrudSuccess] = useState('');

  // SQL Console States
  const [sqlQuery, setSqlQuery] = useState('SELECT name, category, price, stock FROM products LIMIT 5;');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlTime, setSqlTime] = useState(null);
  const [sqlError, setSqlError] = useState('');
  const [sqlLoading, setSqlLoading] = useState(false);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setLowStock(data.lowStock);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchProducts(); // Refresh products catalog list
  }, []);

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    setCrudError('');
    setCrudSuccess('');

    const body = {
      name: prodName,
      description: prodDesc,
      price: parseFloat(prodPrice),
      category: prodCategory,
      stock: parseInt(prodStock),
      image_url: prodImg,
      discount: parseInt(prodDiscount),
      is_featured: prodFeatured,
      is_new: prodNew
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Operation failed');

      setCrudSuccess(editingId ? 'Product updated successfully!' : 'Product added successfully!');
      
      // Reset Form
      setEditingId(null);
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdStock('');
      setProdImg('');
      setProdDiscount('0');
      setProdFeatured(false);
      setProdNew(false);

      // Refresh listings
      fetchProducts();
      fetchAdminStats();
    } catch (err) {
      setCrudError(err.message);
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price.toString());
    setProdCategory(p.category);
    setProdStock(p.stock.toString());
    setProdImg(p.image_url);
    setProdDiscount(p.discount.toString());
    setProdFeatured(p.is_featured === 1);
    setProdNew(p.is_new === 1);
    setCrudError('');
    setCrudSuccess('');
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setCrudError('');
    setCrudSuccess('');

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      setCrudSuccess('Product deleted successfully!');
      fetchProducts();
      fetchAdminStats();
    } catch (err) {
      setCrudError(err.message);
    }
  };

  const handleRunSQL = async (e) => {
    e.preventDefault();
    setSqlError('');
    setSqlResult(null);
    setSqlTime(null);
    setSqlLoading(true);

    const res = await runAdminQuery(sqlQuery);
    setSqlLoading(false);

    if (res.error) {
      setSqlError(res.error);
    } else {
      setSqlResult(res.rows);
      setSqlTime(res.durationMs);
    }
  };

  return (
    <div className="fade-in container">
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '2rem 0' }}>
        <Shield size={28} style={{ color: 'var(--accent-color)' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Admin Operations Control</h1>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Registered Customers</div>
          <div className="stat-value">{stats.users}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--success-color)' }}>
          <div className="stat-label">Gross Revenue</div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>${stats.revenue}</div>
        </div>
      </div>

      {/* Split layout: CRUD Inventory on left, SQL terminal on right */}
      <div className="admin-layout-split">
        {/* Left: Inventory Manager */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} style={{ color: 'var(--accent-color)' }} /> 
            {editingId ? 'Modify Store Listing' : 'Add New Product'}
          </h3>

          {crudSuccess && <div style={{ color: 'var(--success-color)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>{crudSuccess}</div>}
          {crudError && <div style={{ color: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>{crudError}</div>}

          <form onSubmit={handleCreateOrUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-input" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                  <option value="Bags">Bags</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Watches">Watches</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sunglasses">Sunglasses</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" style={{ height: '70px', resize: 'vertical' }} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" className="form-input" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Units</label>
                <input type="number" className="form-input" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input type="number" className="form-input" value={prodDiscount} onChange={(e) => setProdDiscount(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-input" placeholder="https://unsplash.com/..." value={prodImg} onChange={(e) => setProdImg(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', margin: '0.25rem 0' }}>
              <label className="filter-checkbox-label">
                <input type="checkbox" checked={prodFeatured} onChange={(e) => setProdFeatured(e.target.checked)} className="filter-checkbox" />
                <span>Featured product</span>
              </label>
              <label className="filter-checkbox-label">
                <input type="checkbox" checked={prodNew} onChange={(e) => setProdNew(e.target.checked)} className="filter-checkbox" />
                <span>New Arrival</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="submit-btn" style={{ flex: 1 }}>
                {editingId ? 'Save Changes' : 'Insert Product'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="submit-btn" 
                  style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  onClick={() => {
                    setEditingId(null);
                    setProdName('');
                    setProdDesc('');
                    setProdPrice('');
                    setProdStock('');
                    setProdImg('');
                    setProdDiscount('0');
                    setProdFeatured(false);
                    setProdNew(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Low Stock Warning Section */}
          {lowStock.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--danger-color)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ⚠️ Low Stock Warning (&lt;5 units)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {lowStock.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', fontSize: '0.8rem', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                    <span>{p.name}</span>
                    <strong style={{ color: p.stock === 0 ? 'var(--danger-color)' : 'var(--warning-color)' }}>{p.stock} units</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Direct SQL Console */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} style={{ color: 'var(--accent-color)' }} /> SQLite Performance Console
          </h3>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Test SQL query performance locally. Run SELECT read commands directly on database tables: 
            <code style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', margin: '0 0.2rem' }}>users</code>, 
            <code style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', margin: '0 0.2rem' }}>products</code>, 
            <code style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', margin: '0 0.2rem' }}>orders</code>, or 
            <code style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', margin: '0 0.2rem' }}>reviews</code>.
          </p>

          <form onSubmit={handleRunSQL} className="sql-terminal-box">
            {sqlLoading ? (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Executing SQLite operation...</div>
            ) : (
              <>
                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {sqlError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      ❌ Error: {sqlError}
                    </div>
                  )}

                  {sqlResult && (
                    <div className="fade-in">
                      <div className="sql-meta-info">
                        <span>🔍 Rows Returned: {sqlResult.length}</span>
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>⏱️ Run Speed: {sqlTime} ms</span>
                      </div>
                      
                      {sqlResult.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                          <table className="sql-results-table">
                            <thead>
                              <tr>
                                {Object.keys(sqlResult[0]).map((key, i) => <th key={i}>{key}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {sqlResult.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {Object.values(row).map((val, cIdx) => (
                                    <td key={cIdx}>
                                      {val === null ? 'NULL' : typeof val === 'object' ? JSON.stringify(val) : val.toString()}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                          Query executed successfully. Result set is empty.
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!sqlResult && !sqlError && (
                    <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.75rem' }}>
                      Terminal active. Input a valid SELECT query and click run.
                    </div>
                  )}
                </div>

                <div className="sql-input-area">
                  <span className="sql-prompt">SQLite&gt;</span>
                  <input 
                    type="text" 
                    className="sql-text-input" 
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                  />
                  <button type="submit" className="sql-execute-btn" title="Run Query">
                    <Play size={12} fill="white" />
                  </button>
                </div>
              </>
            )}
          </form>
          
          {/* Preset Helper queries */}
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Presets:</span>
            <button 
              onClick={() => setSqlQuery('SELECT name, stock, rating FROM products WHERE stock < 15;')}
              style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Check Low Stock
            </button>
            <button 
              onClick={() => setSqlQuery('SELECT category, COUNT(*) as count, AVG(price) as avg_price FROM products GROUP BY category;')}
              style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Stats by Category
            </button>
            <button 
              onClick={() => setSqlQuery('SELECT o.id, u.name, o.total_amount, o.status FROM orders o JOIN users u ON o.user_id = u.id;')}
              style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Joined Orders Info
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Listings list for easy edit/delete testing */}
      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          Catalog Inventory Database List
        </h3>
        
        <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
          <table className="orders-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td style={{ color: p.stock < 5 ? 'var(--danger-color)' : 'inherit', fontWeight: p.stock < 5 ? 'bold' : 'normal' }}>
                    {p.stock}
                  </td>
                  <td>{p.discount}%</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEditClick(p)} 
                        style={{ color: 'var(--accent-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.1rem' }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(p.id)} 
                        style={{ color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.1rem' }}
                      >
                        <Trash size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Style fix for spin loader */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Admin;
