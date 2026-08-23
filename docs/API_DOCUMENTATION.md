# Enterprise E-Commerce Platform - REST API Reference

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "phone": "+15550192834",
    "role": "CUSTOMER"
  }
  ```
- **Response**: `201 Created` with JWT `token` and `user` object.

### `POST /api/auth/login`
Authenticates existing credentials.
- **Request Body**:
  ```json
  {
    "email": "admin@enterprise.com",
    "password": "Admin@123"
  }
  ```
- **Response**: `200 OK` with JWT `token` and `user` profile.

### `GET /api/auth/me`
Retrieves currently authenticated session user profile (Requires `Authorization: Bearer <token>`).

---

## 2. Product Catalog Endpoints (`/api/products`)

### `GET /api/products`
Retrieves paginated products with filter capabilities.
- **Query Parameters**: `search`, `category`, `minPrice`, `maxPrice`, `isFeatured`, `sortBy`, `page`, `limit`
- **Response**: `200 OK` with `products` array and `pagination` metadata.

### `GET /api/products/:slug`
Fetches a single product specification by URL slug.

### `POST /api/products` *(Admin / Manager)*
Creates a new product entry.
- **Request Body**: `name`, `description`, `price`, `stock`, `sku`, `categoryId`, `images`, `isFeatured`

### `PUT /api/products/:id` *(Admin / Manager)*
Updates an existing product catalog listing.

### `DELETE /api/products/:id` *(Admin)*
Deletes a product entry.

---

## 3. Order Management Endpoints (`/api/orders`)

### `POST /api/orders` *(Authenticated)*
Submits a new order and deducts stock.
- **Request Body**:
  ```json
  {
    "items": [
      { "productId": "prod_uuid_here", "quantity": 1 }
    ],
    "shippingAddress": { "street": "123 Main St", "city": "NYC", "state": "NY", "zip": "10001", "country": "USA" },
    "paymentMethod": "STRIPE"
  }
  ```

### `GET /api/orders/my-orders` *(Authenticated)*
Lists customer's personal order history.

### `GET /api/orders` *(Admin / Manager)*
Lists all enterprise orders with status filtering.

### `PATCH /api/orders/:id/status` *(Admin / Manager)*
Updates order state machine status (`PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`).

---

## 4. Payment Gateway Endpoints (`/api/payments`)

### `POST /api/payments/create-intent`
Generates Stripe Payment Intent.

### `POST /api/payments/confirm`
Verifies transaction completion and updates order payment status to `COMPLETED`.

---

## 5. Analytics & Telemetry (`/api/analytics`)

### `GET /api/analytics/dashboard` *(Admin / Manager)*
Returns overall financial revenue metrics, 6-month revenue trend curves, top selling products, low stock warnings, and recent system audit logs.

### `GET /api/analytics/export` *(Admin / Manager)*
Streams complete sales report as downloadable CSV file.

---

## 6. Cloud & Local Uploads (`/api/uploads`)

### `POST /api/uploads` *(Admin / Manager)*
Uploads file via `multipart/form-data` (`file` parameter) and returns CDN URL.
