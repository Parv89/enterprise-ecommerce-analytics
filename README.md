# Enterprise E-Commerce & Analytics Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.10-2d3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38bdf8.svg)](https://tailwindcss.com/)

A production-grade, full-stack enterprise web platform featuring Role-Based Access Control (RBAC), product/order/customer management modules, Stripe payment processing integration, simulated email notifications, advanced admin analytics dashboard with interactive charts (Recharts), cloud/local image upload storage engine, and performance optimizations.

---

## 🚀 Key Features

1. **Authentication & RBAC**:
   - Secure JWT token authentication with bcrypt password hashing.
   - Role-Based Access Control enforcing `ADMIN`, `MANAGER`, and `CUSTOMER` permissions across API endpoints and UI routes.

2. **Product, Order, & Customer Modules**:
   - Product catalog with instant multi-attribute search, category filter, price filter, sorting, and pagination.
   - Order creation engine with stock validation, state machine status transitions, and tracking number assignment.
   - Customer directory with role management and spend statistics.

3. **Payment Gateway & Notifications**:
   - Stripe PaymentIntent integration with automatic fallback simulation for local testing.
   - Nodemailer notification service sending HTML order receipts and status updates.

4. **Advanced Admin Dashboard & Analytics**:
   - Financial KPIs: Total Gross Revenue, Conversion Rate, Average Order Value, Active Customers, Low Stock Alerts.
   - Interactive Recharts monthly revenue trend visualization and category sales breakdown.
   - Downloadable CSV sales ledger reports.
   - Telemetry audit log viewer recording admin activity.

5. **Cloud & Local Image Upload Storage**:
   - Multer file upload engine supporting JPEG/PNG/WEBP validation with automated static URL generation.

---

## 🔑 Demo Access Credentials

The database comes pre-seeded with ready-to-use demo accounts:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Admin** | `admin@enterprise.com` | `Admin@123` | Full system control, analytics, RBAC modifier, audit logs |
| **Manager** | `manager@enterprise.com` | `Manager@123` | Product catalog CRUD, order fulfillment, stock management |
| **Customer** | `customer@enterprise.com` | `Customer@123` | Storefront catalog, cart, checkout, personal order tracking |

---

## 📁 Repository Structure

```
enterprise-ecommerce-analytics/
├── client/                     # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── api/                # Axios API client wrapper
│   │   ├── components/         # Navbar, Footer, AdminSidebar, ProtectedRoute
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Home, Shop, ProductDetails, Cart, Checkout, Admin pages
│   │   └── types/              # TypeScript interfaces
│   └── package.json
├── server/                     # Node.js + Express + Prisma API Backend
│   ├── prisma/                 # Database schema & seeder script
│   ├── src/
│   │   ├── controllers/        # Auth, Product, Order, Customer, Payment, Analytics, Uploads
│   │   ├── middleware/         # Auth JWT verification & RBAC check
│   │   ├── routes/             # REST endpoint route handlers
│   │   ├── services/           # Stripe, Email, Storage services
│   │   └── index.ts            # Server entry point
│   └── package.json
└── docs/                       # Project Architecture, API Specs, & Database Schemas
    ├── ARCHITECTURE.md
    ├── API_DOCUMENTATION.md
    └── DATABASE_SCHEMA.md
```

---

## 🛠️ Quickstart Guide

### Prerequisites
- **Node.js**: v18+ or v20+ installed
- **npm** or **yarn**

### 1. Install Dependencies

#### Server:
```bash
cd server
npm install
```

#### Client:
```bash
cd ../client
npm install
```

### 2. Database Migration & Seeding

```bash
cd ../server
npx prisma db push
npx prisma db seed
```

### 3. Run Application

#### Start Backend API (Port 5000):
```bash
cd server
npm run dev
```

#### Start Frontend Web App (Port 5173):
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📚 Documentation Links
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specification](docs/API_DOCUMENTATION.md)
- [Database Schema & ER Diagrams](docs/DATABASE_SCHEMA.md)
