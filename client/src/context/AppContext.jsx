import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Auth state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Catalog state
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dbQueryTimeMs, setDbQueryTimeMs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync theme
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sync user
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth actions
  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const logoutUser = () => {
    setUser(null);
  };

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product_id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prevCart, { product_id: product.id, quantity, product }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Product actions
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const { category, minPrice, maxPrice, sortBy, sortOrder } = filters;
      let url = `/api/products?q=${encodeURIComponent(searchQuery)}`;
      if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (sortOrder) url += `&sortOrder=${sortOrder}`;

      const response = await fetch(url);
      const data = await response.json();
      
      setProducts(data.products || []);
      setDbQueryTimeMs(data.dbQueryTimeMs || 0);

      // Prepopulate featured lists
      if (!category && !minPrice && !maxPrice && !searchQuery) {
        const featured = (data.products || []).filter((p) => p.is_featured === 1);
        setFeaturedProducts(featured.slice(0, 6)); // First 6 featured products
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const postReview = async (productId, reviewData) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit review');
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  // Order submission
  const checkoutOrder = async (shippingDetails) => {
    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          items,
          ...shippingDetails,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');
      clearCart();
      return { success: true, orderId: data.orderId, totalAmount: data.totalAmount };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  // Admin DB query
  const runAdminQuery = async (sql) => {
    try {
      const response = await fetch('/api/admin/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        registerUser,
        loginUser,
        logoutUser,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        products,
        featuredProducts,
        dbQueryTimeMs,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        fetchProducts,
        fetchSingleProduct,
        postReview,
        checkoutOrder,
        runAdminQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
