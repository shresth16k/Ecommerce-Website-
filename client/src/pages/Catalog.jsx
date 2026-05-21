import React, { useContext, useEffect, useState } from 'react';
import { Heart, Star, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Catalog = ({ setActivePage, setSelectedProductId }) => {
  const {
    products,
    dbQueryTimeMs,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    fetchProducts
  } = useContext(AppContext);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [wishlist, setWishlist] = useState([1, 3, 5]);

  // Fetch products when state changes
  useEffect(() => {
    fetchProducts({
      category: selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder
    });
  }, [selectedCategory, sortBy, sortOrder, searchQuery]); // Re-fetch on filter changes

  const handleApplyPrice = () => {
    fetchProducts({
      category: selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('id');
    setSortOrder('ASC');
    setSearchQuery('');
  };

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setActivePage('detail');
  };

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((item) => item !== id));
    } else {
      setWishlist((prev) => [...prev, id]);
    }
  };

  const categoriesList = ['All', 'Bags', 'Shoes', 'Watches', 'Beauty', 'Sunglasses', 'Electronics', 'Men', 'Women'];

  return (
    <div className="fade-in container">
      {/* DB Query Performance Metric Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, var(--accent-light) 0%, rgba(255,255,255,0) 100%)',
          borderLeft: '4px solid var(--accent-color)',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          margin: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          ⚡ **SQLite DB Performance**: Query handled in <span style={{ color: 'var(--accent-dark)', fontWeight: 'bold' }}>{dbQueryTimeMs} ms</span>. Zero external API lags.
        </div>
        <button 
          onClick={() => fetchProducts({ category: selectedCategory, minPrice, maxPrice, sortBy, sortOrder })}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
        >
          <RefreshCw size={12} /> Reload
        </button>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <SlidersHorizontal size={18} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filters</h3>
          </div>

          {/* Categories Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options">
              {categoriesList.map((cat, idx) => (
                <label key={idx} className="filter-checkbox-label">
                  <input
                    type="radio"
                    name="category-radio"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="filter-checkbox"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className="submit-btn"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}
            >
              Apply Price
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="checkout-btn"
            style={{ 
              backgroundColor: 'transparent', 
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.6rem',
              fontSize: '0.8rem',
              marginTop: '1rem'
            }}
          >
            Clear All Filters
          </button>
        </aside>

        {/* Right Product Grid */}
        <main>
          <div className="catalog-header-row">
            <div className="catalog-stats">
              Showing {products.length} products 
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            <div className="catalog-sorting">
              <span>Sort By:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="sort-select"
              >
                <option value="id-ASC">Recommended</option>
                <option value="price-ASC">Price: Low to High</option>
                <option value="price-DESC">Price: High to Low</option>
                <option value="rating-DESC">Top Customer Rating</option>
                <option value="name-ASC">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ animation: 'spin 1s linear infinite', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', width: '32px', height: '32px', margin: '0 auto 1rem auto' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Loading catalog items...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No products found</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your filters or search terms.</p>
              <button 
                onClick={handleResetFilters}
                className="submit-btn"
                style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {products.map((product) => {
                const hasDiscount = product.discount > 0;
                const basePrice = hasDiscount 
                  ? (product.price / (1 - product.discount / 100)).toFixed(2) 
                  : null;

                return (
                  <div
                    key={product.id}
                    className="product-card fade-in"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.is_new === 1 && <span className="card-badge badge-new">New</span>}
                    {hasDiscount && <span className="card-badge badge-discount">-{product.discount}%</span>}

                    <button
                      className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, product.id)}
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? 'var(--danger-color)' : 'none'} />
                    </button>

                    <div className="product-image-wrapper" style={{ height: '180px' }}>
                      <img src={product.image_url} alt={product.name} />
                    </div>

                    <div className="product-info">
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {product.category}
                      </span>
                      <h3 className="product-card-name" style={{ fontSize: '0.95rem' }}>{product.name}</h3>

                      <div className="product-card-price-row">
                        <span className="product-card-price" style={{ fontSize: '1.05rem' }}>${product.price.toFixed(2)}</span>
                        {hasDiscount && <span className="product-card-old-price">${basePrice}</span>}
                      </div>

                      <div className="product-card-rating">
                        <Star size={12} className="star-icon" />
                        <span>{product.rating.toFixed(1)} ({product.reviews_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      
      {/* Spin Animation Keyframe inline */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
