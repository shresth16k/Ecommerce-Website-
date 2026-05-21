# <div align="center">Shopora — Fast, Local-First E-Commerce</div>

<div align="center">
  <img src="docs/banner.png" alt="Shopora E-Commerce Banner" width="100%" style="border-radius: 12px; margin-bottom: 15px;" />
</div>

<div align="center">

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&style=for-the-badge)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=for-the-badge)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&style=for-the-badge)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?logo=sqlite&style=for-the-badge)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

**Shopora** is a stunning, high-performance, local-first e-commerce application designed to look premium out of the box while staying 100% self-hosted with zero paid subscription dependencies. 

Powered by a responsive **React (Vite) frontend** featuring micro-animations and elegant glassmorphism, **Node.js (Express) backend**, and a local **SQLite3 database**, Shopora achieves database query times of **under 1 millisecond** locally. It also features a fully-functional Admin Control Panel with a raw SQL console for real-time benchmarking.

---

## 📸 visual Tour & Design Specs

### Premium Homepage & Storefront
<img src="docs/screenshot.png" alt="Shopora Home Design Screenshot" width="100%" style="border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);" />

* **Glassmorphic Navigation Bar**: Transparent blurred header toggles seamlessly between Light & Dark modes.
* **Featured Category Circles**: Round categories with zoom transitions.
* **Modern Product Grid**: Smooth hover translations, wishlist indicators, real-time discount percentage badges, and product ratings.

---

## ⚡ Core Features

### 🛍️ Client Experience
* **Dynamic Search & Multi-Filters**: Filter products dynamically by category, price ranges, search keywords, and sort by rating/price.
* **Detail Spec Sheets**: Quantities selectors, instant stock checks, and user reviews.
* **Interactive Cart & Promo Code**: Handles quantities updates dynamically. Apply code `AURA10` for an instant checkout discount.
* **Confetti checkout Celebration**: A physics-based confetti rain (`canvas-confetti`) triggers upon a successful mock payment.
* **Orders Tracking**: View chronological histories of orders and items in the Profile tab.

### ⚙️ Local-First Architecture
* **SQLite3 Integration**: Promisified queries wrapper automatically logs query execution speeds in milliseconds.
* **Zero Native Dependency Auth**: Utilizes Node's native `crypto` module (SHA-256) for secure admin/user password hashing, preventing heavy C++ native compilation errors on Windows.
* **High Performance**: All primary catalog and index queries respond in **less than 1 ms** under local environments.

### 🛠️ Admin Command Center
* **Live Analytics Cards**: Tracks totals for items in stock, registered users, order sales, and gross revenue.
* **CRUD Catalog Management**: Add, update, or delete products with forms.
* **SQL Profiler & Console**: A secure admin console executing raw `SELECT` queries directly to SQLite, benchmarking and displaying execution times in real-time.

---

## 📂 Project Structure

```
d:\e commerce/
├── package.json            # Root orchestrator for concurrent dev servers
├── docs/                   # Markdown assets and screenshots
│   ├── banner.png          # Repository header banner
│   └── screenshot.png      # Homepage UI design screenshot
├── client/                 # Vite + React Frontend
│   ├── vite.config.js      # Proxies api requests from /api to port 5000
│   ├── src/
│   │   ├── main.jsx        # App entrypoint
│   │   ├── App.jsx         # Layout and routing logic
│   │   ├── index.css       # Core design tokens, light/dark themes, animations
│   │   ├── components/     # Reusable layout elements (Navbar, Footer)
│   │   ├── context/        # Context store (AppContext.jsx) managing React state
│   │   └── pages/          # Home, Catalog, Detail, Cart, Checkout, Profile, Admin
└── server/                 # Express Backend Server
    ├── server.js           # REST API endpoints & Auth verification
    ├── db.js               # SQLite connection setup & timing benchmarks
    └── db/
        ├── schema.sql      # Tables (users, products, reviews, orders, items)
        └── seed.sql        # Demo products, descriptions, reviews, and hashes
```

---

## 🚀 Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (v9 or higher)

### 1. Clone & Navigate
```bash
git clone https://github.com/yourusername/shopora-e-commerce.git
cd shopora-e-commerce
```

### 2. Install Dependencies
Install all modules for both client and server at once:
```bash
# In the root workspace directory
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Start Development Servers
Run both servers concurrently in watch mode:
```bash
npm run dev
```
* **Frontend** loads on: [http://localhost:5173](http://localhost:5173)
* **Backend** loads on: [http://localhost:5000](http://localhost:5000)

The server will automatically generate and seed the local SQLite database file `server/db/shopora.db` on its initial run.

---

## 🔐 Pre-seeded Accounts (Demo)

You can sign in with the following demo credentials in the **Profile** page:

* **Administrator Account**
  * **Email**: `admin@shopora.com`
  * **Password**: `admin123`
  * *Accesses the full analytical dashboard, CRUD forms, and SQL developer console.*

* **Customer Account**
  * **Email**: `jane@example.com`
  * **Password**: `user123`
  * *Accesses profile dashboards, order histories, checkout validations, and reviews.*

---

## 📜 Database Schema Summary

Shopora's database utilizes indexes for optimal retrieval speeds on catalog searches. Here are the core tables:

* `users`: `id`, `name`, `email`, `password_hash`, `role` (`user` / `admin`), `created_at`
* `products`: `id`, `name`, `description`, `price`, `image_url`, `category`, `stock`, `discount`, `rating`, `reviews_count`, `is_featured`, `is_new`, `created_at`
* `reviews`: `id`, `product_id`, `user_name`, `rating` (1-5 stars), `comment`, `created_at`
* `orders`: `id`, `user_id` (nullable), `total_amount`, `shipping_name`, `shipping_address`, `shipping_city`, `shipping_postal`, `payment_method`, `status` (`Pending` / `Delivered`), `created_at`
* `order_items`: `id`, `order_id`, `product_id`, `quantity`, `price`

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
