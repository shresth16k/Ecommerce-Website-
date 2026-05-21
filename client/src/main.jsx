import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// DevTools Signature Credit
console.log(
  '%c✨ SHOPORA E-COMMERCE ✨%c\n\nDesigned & Developed with ❤️ by %cShresth Kesarwani%c\n\n🚀 Powered by React, Node.js & SQLite3 (Local file-based DB)\n\n',
  'background: linear-gradient(90deg, #6366f1, #818cf8); color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; font-family: sans-serif;',
  'color: inherit; font-size: 12px; font-family: sans-serif;',
  'color: #6366f1; font-weight: bold; font-size: 13px; text-decoration: underline; font-family: sans-serif;',
  'color: inherit; font-size: 12px; font-family: sans-serif;'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
