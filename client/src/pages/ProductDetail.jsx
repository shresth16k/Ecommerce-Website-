import React, { useContext, useEffect, useState } from 'react';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const ProductDetail = ({ productId, setActivePage }) => {
  const { fetchSingleProduct, addToCart, postReview } = useContext(AppContext);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadProduct = async () => {
    setLoading(true);
    const data = await fetchSingleProduct(productId);
    setProductData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleQtyChange = (val) => {
    if (!productData) return;
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= productData.product.stock) {
      setQty(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!productData) return;
    addToCart(productData.product, qty);
    // Visual micro-feedback: Show an alert or trigger cart page redirect
    setActivePage('cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      setReviewError('Please enter your name and a comment.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    const res = await postReview(productId, {
      user_name: reviewerName,
      rating: parseInt(reviewRating),
      comment: reviewComment
    });

    setReviewSubmitting(false);

    if (res.success) {
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
      // Reload product details to show new review
      loadProduct();
    } else {
      setReviewError(res.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem' }} className="container">
        <div style={{ animation: 'spin 1s linear infinite', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', width: '36px', height: '36px', margin: '0 auto 1rem auto' }}></div>
        <p>Retrieving product specifications...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!productData || !productData.product) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem' }} className="container">
        <h3>Product not found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The product you are looking for might have been removed.</p>
        <button onClick={() => setActivePage('shop')} className="submit-btn">Back to Shop</button>
      </div>
    );
  }

  const { product, reviews, dbQueryTimeMs } = productData;
  const hasDiscount = product.discount > 0;
  const basePrice = hasDiscount ? (product.price / (1 - product.discount / 100)).toFixed(2) : null;

  return (
    <div className="fade-in container">
      {/* DB Speed indicator */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '1rem 0 2rem 0', textAlign: 'right' }}>
        ⚡ Database lookup: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{dbQueryTimeMs} ms</span>
      </div>

      <div className="detail-layout">
        {/* Left Side: Product Image */}
        <div className="detail-images">
          <div className="main-image-wrapper">
            <img src={product.image_url} alt={product.name} />
          </div>
        </div>

        {/* Right Side: Detail Info */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          
          <div className="detail-rating-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={16} className="star-icon" />
              <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontSize: '0.875rem' }}>{reviews.length} Customer Reviews</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontSize: '0.875rem', color: product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600 }}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {hasDiscount && <span className="detail-old-price">${basePrice}</span>}
          </div>

          <p className="detail-desc">{product.description}</p>

          {/* Quantity selector & Add to Cart */}
          {product.stock > 0 ? (
            <div className="detail-actions">
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => handleQtyChange(-1)}>-</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => handleQtyChange(1)}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '2rem' }}>
              <button className="add-to-cart-btn" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', cursor: 'not-allowed' }} disabled>
                Out of Stock
              </button>
            </div>
          )}

          {/* Guarantees list */}
          <div className="detail-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--success-color)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem' }}>Secure Payment</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% SSL protected checkout</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} style={{ color: 'var(--accent-color)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem' }}>Fast Delivery</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free shipping over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="reviews-section">
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Customer Feedback</h2>

        <div className="reviews-grid">
          {/* Left Review Summary & Write Form */}
          <div>
            <div className="review-stats-card">
              <span className="review-average">{product.rating.toFixed(1)}</span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={16} 
                    fill={s <= Math.round(product.rating) ? 'var(--warning-color)' : 'none'} 
                    className={s <= Math.round(product.rating) ? 'star-icon' : ''} 
                    style={{ color: s <= Math.round(product.rating) ? 'var(--warning-color)' : 'var(--border-color)' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on {reviews.length} reviews</span>
            </div>

            {/* Write a review form */}
            <form onSubmit={handleReviewSubmit} className="review-form">
              <h3 className="review-form-title">Write a Review</h3>

              {reviewError && (
                <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                  {reviewError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input 
                  type="text" 
                  value={reviewerName} 
                  onChange={(e) => setReviewerName(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(e.target.value)} 
                  className="form-select"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Poor)</option>
                  <option value={1}>⭐ (1 - Terrible)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)} 
                  className="form-textarea" 
                  placeholder="Share your thoughts on the quality, fit, or delivery..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                style={{ width: '100%' }}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Right Review List */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Latest Reviews</h3>
            
            {reviews.length === 0 ? (
              <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to share your thoughts on this product!
              </div>
            ) : (
              <div className="review-list">
                {reviews.map((r) => (
                  <div key={r.id} className="review-item fade-in">
                    <div className="review-header">
                      <span className="review-author">{r.user_name}</span>
                      <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          fill={s <= r.rating ? 'var(--warning-color)' : 'none'} 
                          style={{ color: s <= r.rating ? 'var(--warning-color)' : 'var(--border-color)' }}
                        />
                      ))}
                    </div>

                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
