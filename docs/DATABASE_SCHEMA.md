# Database Schema & Entity Relationships

The relational database layer is powered by Prisma ORM with SQLite storage.

## Entity Relationship Diagram (Conceptual)

```
  +------------------+         +------------------+
  |       User       | 1     * |      Order       |
  +------------------+---------+------------------+
  | id (PK)          |         | id (PK)          |
  | email (Unique)   |         | orderNumber (UQ) |
  | role             |         | userId (FK)      |
  | name             |         | totalAmount      |
  +------------------+         | status           |
           |                   +------------------+
           | 1                          | 1
           |                            |
           | *                          | *
  +------------------+         +------------------+
  |     AuditLog     |         |    OrderItem     |
  +------------------+         +------------------+
                               | id (PK)          |
                               | orderId (FK)     |
                               | productId (FK)   |
                               +------------------+
                                        | *
                                        |
                                        | 1
  +------------------+         +------------------+
  |     Category     | 1     * |     Product      |
  +------------------+---------+------------------+
  | id (PK)          |         | id (PK)          |
  | slug (Unique)    |         | name             |
  +------------------+         | price            |
                               | stock            |
                               | categoryId (FK)  |
                               +------------------+
```

## Schema Definitions Summary

- **User**: User accounts with RBAC roles (`ADMIN`, `MANAGER`, `CUSTOMER`), email credentials, and profile metadata.
- **Category**: Product taxonomy classification with slug URLs.
- **Product**: Product entity containing price, stock count, SKU, multi-image JSON array, and rating averages.
- **Order**: Primary sales transaction entity tracking workflow status (`PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), tracking number, and customer address.
- **OrderItem**: Junction line item recording quantity and unit price at time of order creation.
- **Payment**: Payment intent record storing Stripe transaction IDs and verification status.
- **AuditLog**: Immutable audit trail logging admin actions and security telemetry.
- **FileStorage**: Cloud & local file metadata registry for product image uploads.
