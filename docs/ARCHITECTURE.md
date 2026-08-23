# Enterprise E-Commerce & Analytics Platform - System Architecture

## Architecture Overview

The Enterprise E-Commerce & Analytics Platform is designed using a decoupled full-stack architecture optimized for high scalability, performance, and security.

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (React 18 + Vite)                     |
|  - E-Commerce Storefront (Catalog, Shopping Cart, Checkout, Order Tracking)    |
|  - Admin Analytics Suite (Recharts Dashboard, RBAC Management, Cloud Uploads)  |
+-------------------------------------------------------------------------------+
                                      |
                                 REST APIs
                                      |
+-------------------------------------------------------------------------------+
|                            SERVER TIER (Node.js + Express)                    |
|  - Auth & RBAC Middleware (JWT Token Verification & Scope Validation)         |
|  - Controllers: Auth, Product, Order, Customer, Payment, Analytics, Uploads    |
|  - Integrations: Stripe Gateway Service, Nodemailer Notification Service      |
+-------------------------------------------------------------------------------+
                                      |
                               Prisma ORM API
                                      |
+-------------------------------------------------------------------------------+
|                           DATABASE TIER (SQLite / Prisma)                     |
|  - Models: User, Product, Category, Order, OrderItem, Payment, Review, Audit  |
+-------------------------------------------------------------------------------+
```

## Security & Access Control (RBAC)

1. **Authentication**:
   - JSON Web Tokens (JWT) signed with HMAC-SHA256 algorithm and 7-day expiration.
   - Passwords hashed using `bcryptjs` with salt factor 10.
2. **Role-Based Access Control (RBAC)**:
   - **`ADMIN`**: Unrestricted access to all modules, financial reporting, system telemetry logs, and role elevation.
   - **`MANAGER`**: Full catalog CRUD, stock management, and order fulfillment capabilities.
   - **`CUSTOMER`**: Catalog browsing, shopping cart management, checkout execution, personal order history access.
3. **Audit Logging**:
   - Critical system actions (User Registration, Order Creation, Status Transitions, Role Changes) are recorded in the `AuditLog` table with user references and detail payloads.

## Payment & Notification Infrastructure

- **Stripe Gateway Integration**: Interfaced via `Stripe` SDK with full fallback simulation mode for seamless local evaluation without requiring live API keys.
- **Email Service**: Multi-transport HTML email engine for purchase receipts, status changes, and inventory alerts.
- **Storage Engine**: Multer-backed local & cloud storage CDN endpoint with mime-validation and file size caps.
