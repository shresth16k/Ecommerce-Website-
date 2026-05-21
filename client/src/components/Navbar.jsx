import React, { useContext, useState } from 'react';
import { Search, User, Heart, ShoppingBag, Sun, Moon, Menu, LogOut, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Navbar = ({ activePage, setActivePage }) => {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logoutUser, 
    cart, 
    searchQuery, 
    setSearchQuery, 
    fetchProducts 
  } = useContext(AppContext);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    fetchProducts();
    setActivePage('shop'); // Redirect to shop catalog on search
  };

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    if (pageName === 'home') {
      setSearchQuery('');
      setLocalSearch('');
      fetchProducts(); // reset filters
    }
  };

  // Calculate cart items count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* 1. Top Bar */}
      <div className="promo-banner">
        <div className="container promo-content">
          <div className="promo-left">
            <span>✨ Free Shipping on orders over $50</span>
            <span>|</span>
            <span>Easy 30-day returns</span>
          </div>
          <div className="promo-right">
            <a href="#" className="promo-link">Help & Support</a>
            <a href="#" className="promo-link" onClick={() => handleNavClick('profile')}>Track Order</a>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="main-header">
        <div className="container header-container">
          {/* Logo */}
          <a href="#" className="logo" onClick={() => handleNavClick('home')}>
            Shopora<span>.</span>
          </a>

          {/* Search bar */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="search-input"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Header Action icons */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button 
              className="action-item" 
              onClick={toggleTheme} 
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              style={{ marginRight: '0.5rem' }}
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>

            {/* Account Profile */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button className="action-item" onClick={() => handleNavClick('profile')}>
                  <User size={22} />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <button className="action-item" onClick={logoutUser} title="Log Out" style={{ color: 'var(--danger-color)' }}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button className="action-item" onClick={() => handleNavClick('profile')}>
                <User size={22} />
                <span>Account</span>
              </button>
            )}

            {/* Wishlist */}
            <button className="action-item" onClick={() => handleNavClick('shop')} title="View Wishlist">
              <Heart size={22} />
              <span className="badge">3</span>
              <span style={{ display: 'none' }}>Wishlist</span>
            </button>

            {/* Shopping Cart */}
            <button className="action-item" onClick={() => handleNavClick('cart')} title="View Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
              <span>Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Category navigation */}
      <nav className="nav-bar">
        <div className="container nav-container">
          <div className="all-categories-btn" onClick={() => handleNavClick('shop')}>
            <Menu size={18} />
            <span>All Categories</span>
            <ChevronDown size={14} />
          </div>

          <ul className="nav-menu">
            <li>
              <a 
                href="#" 
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`nav-link ${activePage === 'shop' ? 'active' : ''}`}
                onClick={() => handleNavClick('shop')}
              >
                Shop
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="nav-link"
                onClick={() => {
                  handleNavClick('shop');
                }}
              >
                Categories
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="nav-link"
                onClick={() => {
                  handleNavClick('shop');
                  // We can trigger featured/discount filtering
                }}
              >
                Deals
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="nav-link"
                onClick={() => {
                  handleNavClick('shop');
                }}
              >
                New Arrivals
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="nav-link"
                onClick={() => handleNavClick('shop')}
              >
                Brands
              </a>
            </li>
          </ul>

          {user?.role === 'admin' && (
            <button 
              className="submit-btn" 
              style={{ marginLeft: 'auto', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              onClick={() => handleNavClick('admin')}
            >
              🛠️ Admin Board
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
