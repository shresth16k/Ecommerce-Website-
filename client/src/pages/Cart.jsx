import React, { useContext, useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Cart = ({ setActivePage }) => {
  const { cart, updateCartQty, removeFromCart } = useContext(AppContext);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "AURA10"');
      setDiscountPercent(0);
      setPromoApplied(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * (discountPercent / 100));
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount > 50 || afterDiscount === 0 ? 0 : 9.99;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }} className="fade-in container">
        <div style={{ backgroundColor: 'var(--bg-secondary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--text-muted)' }}>
          <ShoppingBag size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't added any products to your cart yet.</p>
        <button onClick={() => setActivePage('shop')} className="submit-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in container">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '2rem 0' }}>Shopping Cart</h1>

      <div className="cart-layout">
        {/* Left Side: Cart Items List */}
        <div className="cart-items">
          {cart.map((item) => {
            const hasDiscount = item.product.discount > 0;
            const originalPrice = hasDiscount 
              ? (item.product.price / (1 - item.product.discount / 100)).toFixed(2) 
              : null;

            return (
              <div key={item.product_id} className="cart-item fade-in">
                {/* Image */}
                <div className="cart-item-image">
                  <img src={item.product.image_url} alt={item.product.name} />
                </div>

                {/* Details */}
                <div className="cart-item-info">
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 700 }}>
                    {item.product.category}
                  </span>
                  <h3 className="cart-item-title">{item.product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                    {hasDiscount && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ${originalPrice}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product_id)} 
                    className="cart-remove-btn"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                {/* Quantity adjusters */}
                <div className="qty-selector">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateCartQty(item.product_id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateCartQty(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    style={{ opacity: item.quantity >= item.product.stock ? 0.4 : 1, cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer' }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal of item */}
                <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: 700, fontSize: '1.05rem' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

          {/* Back button */}
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={() => setActivePage('shop')} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary Panel */}
        <aside className="cart-summary">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
          </div>

          {/* Promo code display */}
          {promoApplied && (
            <div className="summary-row" style={{ color: 'var(--success-color)' }}>
              <span>Promo Discount (10%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
            <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%)</span>
            <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
          </div>

          {/* Promo Form */}
          <form onSubmit={handleApplyPromo} style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Tag size={12} /> Promo Code
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Try AURA10" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ padding: '0.5rem' }}
                />
                <button type="submit" className="submit-btn" style={{ padding: '0.5rem 1rem' }}>Apply</button>
              </div>
            </div>
            {promoApplied && <p style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>Discount applied successfully!</p>}
            {promoError && <p style={{ fontSize: '0.75rem', color: 'var(--danger-color)', fontWeight: 600 }}>{promoError}</p>}
          </form>

          <div className="summary-divider" />

          <div className="summary-row summary-total" style={{ marginBottom: '1.5rem' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => setActivePage('checkout')} 
            className="checkout-btn"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
