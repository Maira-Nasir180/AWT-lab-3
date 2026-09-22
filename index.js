const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { v4: uuidv4 } = require('uuid');

const { schema, root } = require('./graphql/schema');
const productRoutes = require('./routes/products');
const { sendError } = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json());

// ---- REST routes ----
app.use('/api/v1/products', productRoutes);

// ---- Orders route with Idempotency-Key (solves duplicate order problem) ----
const processedKeys = new Map();

app.post('/api/v1/orders', (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return sendError(res, 400, "MISSING_IDEMPOTENCY_KEY", "Idempotency-Key header is required for order creation");
  }

  if (processedKeys.has(idempotencyKey)) {
    // Same request dobara aayi - purana result hi wapas bhej do, naya order nahi banega
    return res.status(200).json(processedKeys.get(idempotencyKey));
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return sendError(res, 400, "VALIDATION_ERROR", "productId and quantity are required");
  }

  const newOrder = {
    id: uuidv4(),
    productId,
    quantity,
    status: "created",
    createdAt: new Date().toISOString()
  };

  processedKeys.set(idempotencyKey, newOrder);
  res.status(201).json(newOrder);
});

// ---- GraphQL endpoint ----
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

// ---- Global error handler (raw 500 crashes ko rokta hai) ----
app.use((err, req, res, next) => {
  console.error(err);
  sendError(res, 500, "INTERNAL_SERVER_ERROR", "Something went wrong on our end");
});

// ---- 404 for unknown routes ----
app.use((req, res) => {
  sendError(res, 404, "ROUTE_NOT_FOUND", "This endpoint does not exist");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});