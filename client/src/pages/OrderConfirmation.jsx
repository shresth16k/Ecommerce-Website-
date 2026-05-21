import React, { useEffect } from 'react';
import { CheckCircle2, Package, Calendar, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderConfirmation = ({ orderDetails, setActivePage }) => {
  useEffect(() => {
    // Trigger confetti explosion on load
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#818cf8', '#34d399']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#818cf8', '#34d399']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const estimatedDelivery = () => {
    const today = new Date();
    today.setDate(today.getDate() + 4); // 4 days delivery time
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fade-in container" style={{ maxWidth: '650px', padding: '4rem 1.5rem', textAlign: 'center' }}>
      {/* Thank you graphic */}
      <div style={{ color: 'var(--success-color)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <CheckCircle2 size={64} fill="rgba(16, 185, 129, 0.1)" />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Thank You for Your Order!</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '3rem' }}>
        Your order has been received and is currently being processed. An email invoice has been sent to you.
      </p>

      {/* Receipt Card */}
      <div 
        style={{ 
          backgroundColor: 'var(--bg-tertiary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '2rem', 
          textAlign: 'left',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2.5rem'
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={18} style={{ color: 'var(--accent-color)' }} /> Order Receipt
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Order ID</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#SP-{orderDetails?.orderId || '10294'}</span>
          </div>

          <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Amount Paid</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>${orderDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>

          <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.5rem 0' }}></div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Calendar size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>Estimated Delivery</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{estimatedDelivery()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <MapPin size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>Delivery Address</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{orderDetails?.shippingAddress || '123 Main St, New York'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation options */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setActivePage('home')} 
          className="submit-btn"
          style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
        >
          Return Home
        </button>
        <button 
          onClick={() => setActivePage('profile')} 
          className="submit-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Track Order <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
