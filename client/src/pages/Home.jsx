import React, { useContext, useEffect, useState } from 'react';
import { Heart, Star, ArrowRight, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Home = ({ setActivePage, setSelectedProductId }) => {
  const { 
    featuredProducts, 
    fetchProducts, 
    setSelectedCategory, 
    addToCart 
  } = useContext(AppContext);

  const [activeSlide, setActiveSlide] = useState(0);
  const [wishlist, setWishlist] = useState([1, 3, 5]); // Mock initial wishlist from image

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const slides = [
    {
      badge: 'Summer Collection',
      title: 'Elevate Your Everyday Style',
      desc: 'Discover curated collections that blend comfort, quality and elegance.',
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      category: 'Bags'
    },
    {
      badge: 'Exclusive Launch',
      title: 'Timeless Precision & Luxury',
      desc: 'Crafted with sapphire glass and mesh steel for those who appreciate design.',
      img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
      category: 'Watches'
    },
    {
      badge: 'Immersive Audio',
      title: 'Silence the World, Hear the Detail',
      desc: 'High-fidelity audio drivers with hybrid active noise cancellation.',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      category: 'Electronics'
    }
  ];

  // Auto-slide loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setActivePage('shop');
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

  // 9 categories with direct images
  const categoryCircles = [
    { name: 'Bags', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150' },
    { name: 'Sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=150' },
    { name: 'Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=150' },
    { name: 'Watches', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=150' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=150' },
    { name: 'Men', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=150' },
    { name: 'Women', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=150' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150' }
  ];

  return (
    <div className="fade-in container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles size={12} />
              {slides[activeSlide].badge}
            </span>
            <h1 className="hero-title">{slides[activeSlide].title}</h1>
            <p className="hero-desc">{slides[activeSlide].desc}</p>
            <button 
              className="hero-btn"
              onClick={() => handleCategoryClick(slides[activeSlide].category)}
            >
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-image-container">
            <img 
              src={slides[activeSlide].img} 
              alt={slides[activeSlide].title} 
              className="hero-image"
            />
          </div>

          <div className="slider-dots">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Category circular items row */}
      <section className="categories-section">
        <div className="categories-list">
          {categoryCircles.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-item"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-circle-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}

          {/* View All category */}
          <div className="category-item" onClick={() => handleCategoryClick('All')}>
            <div className="category-circle-wrapper" style={{ backgroundColor: 'var(--accent-light)' }}>
              <span className="category-icon-only" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>☷</span>
            </div>
            <span className="category-name">View All</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Products section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <a href="#" className="view-all-link" onClick={() => handleCategoryClick('All')}>
            View All <ArrowRight size={16} />
          </a>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => {
            const hasDiscount = product.discount > 0;
            // Calculate base price before discount
            const basePrice = hasDiscount 
              ? (product.price / (1 - product.discount / 100)).toFixed(2) 
              : null;

            return (
              <div 
                key={product.id} 
                className="product-card fade-in"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Badges */}
                {product.is_new === 1 && (
                  <span className="card-badge badge-new">New</span>
                )}
                {hasDiscount && (
                  <span className="card-badge badge-discount">-{product.discount}%</span>
                )}

                {/* Wishlist Button */}
                <button 
                  className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                  onClick={(e) => toggleWishlist(e, product.id)}
                  aria-label="Add to Wishlist"
                >
                  <Heart size={16} fill={wishlist.includes(product.id) ? 'var(--danger-color)' : 'none'} />
                </button>

                {/* Image Wrapper */}
                <div className="product-image-wrapper">
                  <img src={product.image_url} alt={product.name} loading="lazy" />
                </div>

                {/* Info */}
                <div className="product-info">
                  <h3 className="product-card-name">{product.name}</h3>
                  
                  <div className="product-card-price-row">
                    <span className="product-card-price">${product.price.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="product-card-old-price">${basePrice}</span>
                    )}
                  </div>

                  <div className="product-card-rating">
                    <Star size={12} className="star-icon" />
                    <span>{product.rating.toFixed(1)} ({product.reviews_count})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
