import React, { useContext, useState } from 'react';
import { CreditCard, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Checkout = ({ setActivePage, setOrderConfirmationDetails }) => {
  const { cart, checkoutOrder, user } = useContext(AppContext);
  const [shippingName, setShippingName] = useState(user ? user.name : '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostal, setShippingPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingName.trim() || !shippingAddress.trim() || !shippingCity.trim() || !shippingPostal.trim()) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (paymentMethod === 'Credit Card') {
      if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCvv.length < 3) {
        setError('Please enter valid credit card details.');
        return;
      }
    }

    setLoading(true);
    setError('');

    const res = await checkoutOrder({
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_postal: shippingPostal,
      payment_method: paymentMethod
    });

    setLoading(false);

    if (res.success) {
      // Set values to render in Order Confirmation
      setOrderConfirmationDetails({
        orderId: res.orderId,
        totalAmount: res.totalAmount,
        shippingName,
        shippingAddress: `${shippingAddress}, ${shippingCity}, ${shippingPostal}`
      });
      setActivePage('orderConfirmation');
    } else {
      setError(res.error || 'An error occurred during checkout.');
    }
  };

  return (
    <div className="fade-in container">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '2rem 0' }}>Checkout</h1>

      <div className="checkout-layout">
        {/* Left Side: Checkout Forms */}
        <form onSubmit={handleCheckoutSubmit} className="checkout-form-panel">
          {error && (
            <div style={{ backgroundColor: 'var(--danger-color)', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Shipping Address */}
          <div>
            <h3 className="checkout-section-title">Shipping Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={shippingName} 
                onChange={(e) => setShippingName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Apartment, suite, unit, building, floor" 
                value={shippingAddress} 
                onChange={(e) => setShippingAddress(e.target.value)} 
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={shippingCity} 
                  onChange={(e) => setShippingCity(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={shippingPostal} 
                  onChange={(e) => setShippingPostal(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginTop: '2.5rem' }}>
            <h3 className="checkout-section-title">Payment Method</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <label className="filter-checkbox-label" style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: paymentMethod === 'Credit Card' ? '2px solid var(--accent-color)' : '2px solid transparent', flex: 1, justifyContent: 'center' }}>
                <input 
                  type="radio" 
                  checked={paymentMethod === 'Credit Card'} 
                  onChange={() => setPaymentMethod('Credit Card')} 
                  style={{ display: 'none' }} 
                />
                <CreditCard size={16} />
                <span style={{ fontWeight: 600 }}>Credit Card</span>
              </label>

              <label className="filter-checkbox-label" style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: paymentMethod === 'Cash on Delivery' ? '2px solid var(--accent-color)' : '2px solid transparent', flex: 1, justifyContent: 'center' }}>
                <input 
                  type="radio" 
                  checked={paymentMethod === 'Cash on Delivery'} 
                  onChange={() => setPaymentMethod('Cash on Delivery')} 
                  style={{ display: 'none' }} 
                />
                <span>💵 Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="16-digit Card Number" 
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="MM/YY" 
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="3 Digits" 
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="checkout-btn" 
            style={{ marginTop: '2rem' }}
            disabled={loading}
          >
            {loading ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Right Side: Order Summary List */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="cart-summary">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Recap</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
              {cart.map((item) => (
                <div key={item.product_id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', flexShrink: 0 }}>
                    <img src={item.product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 600 }}>{item.product.name}</h4>
                    <span style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider" />
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setActivePage('cart')} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, alignSelf: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} /> Back to Cart
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
