# E-Commerce API (Product Catalog & Order Management)

A RESTful API with GraphQL support built for an E-Commerce platform, solving common backend problems: improper URI naming, non-idempotent operations causing duplicate orders, and REST over-fetching.

## Features

- RESTful CRUD endpoints for products (`/api/v1/products`)
- Idempotent PUT for safe repeated updates
- Standardized JSON error responses (error_code, message, timestamp)
- Filtering & pagination via query parameters
- Field selection (`?fields=title,price`) to solve over-fetching
- GraphQL endpoint (`/graphql`) as an alternative over-fetching solution
- Idempotency-Key header support for orders to prevent duplicate order/payment creation

## Setup

npm install


## Run

npm start


or

node index.js


Server runs on `http://localhost:3000`

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/products | List all products (supports ?category=, ?limit=, ?page=, ?fields=) |
| GET | /api/v1/products/:id | Get single product |
| POST | /api/v1/products | Create product (201 Created) |
| PUT | /api/v1/products/:id | Update product (idempotent, 200 OK) |
| DELETE | /api/v1/products/:id | Delete product (204 No Content) |
| POST | /api/v1/orders | Create order (requires Idempotency-Key header) |
| POST | /graphql | GraphQL endpoint (GraphiQL UI available in browser) |

## Error Response Format

{
"error_code": "PRODUCT_NOT_FOUND",
"message": "Product with this ID does not exist",
"timestamp": "2026-09-22T10:15:30.000Z"
}


## Example: Field Selection (Over-fetching solution)

GET /api/v1/products/1?fields=title,price


## Example: GraphQL Query

{
product(id: "1") {
title
price
}
}


## Example: Idempotent Order Creation

POST /api/v1/orders
Headers: Idempotency-Key: abc123
Body: { "productId": "1", "quantity": 2 }


Sending this same request again (same key) returns the same order instead of creating a duplicate.

## Tech Stack

- Node.js
- Express.js
- GraphQL (express-graphql)
- UUID for unique ID generation

## Testing Screenshots (Postman)

### 1. POST - Create Product (201 Created)
![POST Create](screenshots/1-post-create.png)

### 2. POST - Validation Error (400 Bad Request)
![Validation Error](screenshots/2-post-validation-error.png)

### 3. PUT - Idempotent Update (200 OK)
Sending the same PUT request twice returns the same result without corrupting state.
![PUT Idempotent](screenshots/3-put-idempotent.png)

### 4. DELETE Product (204 No Content)
Deleting the same product again returns 404 Not Found.
![DELETE](screenshots/4-delete.png)

### 5. Order Creation with Idempotency-Key
Sending the same order request twice (same Idempotency-Key) returns the same order ID instead of creating a duplicate — this solves the duplicate payment/order problem.
![Idempotency Key Test](screenshots/5-order-idempotency.png)
