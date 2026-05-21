import React, { useContext, useEffect, useState } from 'react';
import { User, Mail, Shield, ShoppingBag, Eye, EyeOff, Lock } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Profile = ({ setActivePage }) => {
  const { user, loginUser, registerUser } = useContext(AppContext);
  
  // Auth Form State
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchUserOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const response = await fetch(`/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    let res;
    if (isLoginTab) {
      res = await loginUser(email, password);
    } else {
      res = await registerUser(name, email, password);
    }

    setAuthLoading(false);

    if (res.success) {
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setAuthError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  // If user is NOT logged in: Show Login / Register Panel
  if (!user) {
    return (
      <div className="fade-in container" style={{ maxWidth: '480px', padding: '3.5rem 1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2.5rem', boxShadow: 'var(--shadow-premium)' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <button 
              onClick={() => { setIsLoginTab(true); setAuthError(''); }}
              style={{ flex: 1, padding: '0.75rem 0', fontWeight: 600, color: isLoginTab ? 'var(--accent-color)' : 'var(--text-secondary)', borderBottom: isLoginTab ? '2px solid var(--accent-color)' : '2px solid transparent', cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLoginTab(false); setAuthError(''); }}
              style={{ flex: 1, padding: '0.75rem 0', fontWeight: 600, color: !isLoginTab ? 'var(--accent-color)' : 'var(--text-secondary)', borderBottom: !isLoginTab ? '2px solid var(--accent-color)' : '2px solid transparent', cursor: 'pointer' }}
            >
              Create Account
            </button>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
            {isLoginTab ? 'Welcome Back' : 'Create an Account'}
          </h2>

          {authError && (
            <div style={{ color: 'var(--danger-color)', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }} 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }} disabled={authLoading}>
              {authLoading ? 'Signing in...' : isLoginTab ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isLoginTab && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <p>Demo accounts (pre-seeded):</p>
              <p style={{ marginTop: '0.25rem' }}>👨‍💻 Admin: <strong>admin@shopora.com</strong> / <strong>admin123</strong></p>
              <p>🛍️ User: <strong>jane@example.com</strong> / <strong>user123</strong></p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If user is LOGGED IN: Show Profile Dashboard
  return (
    <div className="fade-in container">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '2rem 0' }}>My Account</h1>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user.name}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1.5rem' }}>
            {user.email}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Shield size={14} style={{ color: 'var(--accent-color)' }} />
            <span>Role: {user.role.toUpperCase()}</span>
          </div>

          {user.role === 'admin' && (
            <button 
              onClick={() => setActivePage('admin')} 
              className="submit-btn" 
              style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem' }}
            >
              🛠️ Open Admin Board
            </button>
          )}
        </aside>

        {/* Orders History List */}
        <main>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Order History</h3>
          </div>

          {ordersLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
              <ShoppingBag size={32} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No orders placed yet</p>
              <p style={{ fontSize: '0.85rem' }}>When you buy items, they will appear here.</p>
              <button onClick={() => setActivePage('shop')} className="submit-btn" style={{ marginTop: '1.25rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                Go to Shop
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="fade-in">
                      <td style={{ fontWeight: 600 }}>#SP-{order.id}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', maxWidth: '250px' }}>
                          {order.items?.map((item, index) => (
                            <div 
                              key={index} 
                              title={`${item.name} (x${item.quantity})`}
                              style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', flexShrink: 0 }}
                            >
                              <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-color)' }}>${order.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
