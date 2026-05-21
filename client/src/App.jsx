import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderConfirmationDetails, setOrderConfirmationDetails] = useState(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedProductId]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
      case 'shop':
        return (
          <Catalog 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
      case 'detail':
        return (
          <ProductDetail 
            productId={selectedProductId} 
            setActivePage={setActivePage} 
          />
        );
      case 'cart':
        return (
          <Cart 
            setActivePage={setActivePage} 
          />
        );
      case 'checkout':
        return (
          <Checkout 
            setActivePage={setActivePage} 
            setOrderConfirmationDetails={setOrderConfirmationDetails} 
          />
        );
      case 'orderConfirmation':
        return (
          <OrderConfirmation 
            orderDetails={orderConfirmationDetails} 
            setActivePage={setActivePage} 
          />
        );
      case 'profile':
        return (
          <Profile 
            setActivePage={setActivePage} 
          />
        );
      case 'admin':
        return (
          <Admin />
        );
      default:
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedProductId={setSelectedProductId} 
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
