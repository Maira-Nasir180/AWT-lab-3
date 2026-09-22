const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const products = require('../data/products');
const { sendError } = require('../middleware/errorHandler');

// GET all products (with filtering, pagination, field selection)
router.get('/', (req, res) => {
  let result = [...products];

  // Filtering by category
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  // Pagination
  const limit = parseInt(req.query.limit) || result.length;
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * limit;
  result = result.slice(start, start + limit);

  // Field selection (solves over-fetching)
  if (req.query.fields) {
    const fieldsArr = req.query.fields.split(',');
    result = result.map(p => {
      let obj = {};
      fieldsArr.forEach(f => {
        if (p[f] !== undefined) obj[f] = p[f];
      });
      return obj;
    });
  }

  res.status(200).json(result);
});

// GET single product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return sendError(res, 404, "PRODUCT_NOT_FOUND", "Product with this ID does not exist");
  }

  let result = product;

  // Field selection on single product too
  if (req.query.fields) {
    const fieldsArr = req.query.fields.split(',');
    let obj = {};
    fieldsArr.forEach(f => {
      if (product[f] !== undefined) obj[f] = product[f];
    });
    result = obj;
  }

  res.status(200).json(result);
});

// POST create new product
router.post('/', (req, res) => {
  const { title, price, category, description, stock, vendor } = req.body;

  if (!title || typeof price !== 'number') {
    return sendError(res, 400, "VALIDATION_ERROR", "Title (string) and price (number) are required");
  }

  const newProduct = {
    id: uuidv4(),
    title,
    price,
    category: category || "general",
    description: description || "",
    stock: stock || 0,
    vendor: vendor || "unknown"
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product (idempotent - full replace)
router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return sendError(res, 404, "PRODUCT_NOT_FOUND", "Cannot update non-existent product");
  }

  const { title, price, category, description, stock, vendor } = req.body;

  if (!title || typeof price !== 'number') {
    return sendError(res, 400, "VALIDATION_ERROR", "Title and price are required for update");
  }

  products[index] = {
    id: req.params.id,
    title,
    price,
    category: category || "general",
    description: description || "",
    stock: stock || 0,
    vendor: vendor || "unknown"
  };

  res.status(200).json(products[index]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return sendError(res, 404, "PRODUCT_NOT_FOUND", "Cannot delete non-existent product");
  }

  products.splice(index, 1);
  res.status(204).send();
});

module.exports = router;