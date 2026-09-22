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
<img width="317" height="193" alt="Screenshot 2026-09-22 213325" src="https://github.com/user-attachments/assets/007c038e-15c6-4061-a9a6-0e0369a79577" />






## Example: Field Selection (Over-fetching solution)

GET /api/v1/products/1?fields=title,price
<img width="383" height="208" alt="Screenshot 2026-09-22 213535" src="https://github.com/user-attachments/assets/7f7856e9-424c-4572-bab7-9f2ce6e60446" />




## Example: GraphQL Query

<img width="959" height="470" alt="Screenshot 2026-09-22 213914" src="https://github.com/user-attachments/assets/e9799825-5c93-4891-9353-bad0837c4b24" />




## Example: Idempotent Order Creation

POST /api/v1/orders
Headers: Idempotency-Key: abc123
Body: { "productId": "1", "quantity": 2 }


Sending this same request again (same key) returns the same order instead of creating a duplicate.
<img width="541" height="413" alt="Screenshot 2026-09-22 214147" src="https://github.com/user-attachments/assets/40ae4d17-211f-42d0-b6a2-e5a9491048e1" />


## Tech Stack

- Node.js
- Express.js
- GraphQL (express-graphql)
- UUID for unique ID generation

## Testing Screenshots (Postman)

### 1. POST - Create Product (201 Created)
<img width="959" height="539" alt="Screenshot 2026-09-22 204818" src="https://github.com/user-attachments/assets/a67a7915-66ab-459b-8b6f-2f8c750b97ec" />


### 2. POST - Validation Error (400 Bad Request)
<img width="536" height="422" alt="Screenshot 2026-09-22 210925" src="https://github.com/user-attachments/assets/10c8f7d3-94d2-4fa2-9782-342203c57aed" />


### 3. PUT - Idempotent Update (200 OK)
Sending the same PUT request twice returns the same result without corrupting state.
<img width="533" height="416" alt="Screenshot 2026-09-22 210953" src="https://github.com/user-attachments/assets/f8fa075d-2e6e-4ca7-921b-9e0810bffca7" />


### 4. DELETE Product (204 No Content)
Deleting the same product again returns 404 Not Found.
<img width="536" height="425" alt="Screenshot 2026-09-22 211011" src="https://github.com/user-attachments/assets/0319ffac-2423-49bf-ac4b-ac5e9a1aa0a7" />


### 5. Order Creation with Idempotency-Key
Sending the same order request twice (same Idempotency-Key) returns the same order ID instead of creating a duplicate — this solves the duplicate payment/order problem.
<img width="541" height="407" alt="Screenshot 2026-09-22 211238" src="https://github.com/user-attachments/assets/c32f0e75-d975-4d70-b88e-cf4ce81a45cb" />

