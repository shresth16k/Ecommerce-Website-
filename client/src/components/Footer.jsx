import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Facebook = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Footer = ({ setActivePage }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#" className="logo" onClick={() => setActivePage('home')}>
              Shopora<span>.</span>
            </a>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Elevate your everyday style with our curated collections of premium fashion, accessories, and tech items.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Column 1: Shop Categories */}
          <div>
            <h4 className="footer-title">Shop Categories</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={() => setActivePage('shop')}>Bags & Backpacks</a></li>
              <li><a href="#" onClick={() => setActivePage('shop')}>Premium Shoes</a></li>
              <li><a href="#" onClick={() => setActivePage('shop')}>Luxury Watches</a></li>
              <li><a href="#" onClick={() => setActivePage('shop')}>Electronics & Tech</a></li>
              <li><a href="#" onClick={() => setActivePage('shop')}>Beauty & Care</a></li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Shipping & Deliveries</a></li>
              <li><a href="#">Easy Returns & Refunds</a></li>
              <li><a href="#">Order Tracking</a></li>
              <li><a href="#">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="footer-title">Get in Touch</h4>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} className="text-muted" />
                <span>Test Place</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} className="text-muted" />
                <span>+00 123 456 7890</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} className="text-muted" />
                <span>test@example.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Shopora Inc. All rights reserved. Designed & developed with ❤️ by <strong style={{ color: 'var(--text-primary)', borderBottom: '1px dotted var(--accent-color)' }}>Shresth Kesarwani</strong>.</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span style={{ fontSize: '1rem' }}>💳 💳 💳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
