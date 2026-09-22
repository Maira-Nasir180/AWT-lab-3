const { buildSchema } = require('graphql');
const products = require('../data/products');

// GraphQL schema define karna - Product type aur Query type
const schema = buildSchema(`
  type Product {
    id: ID
    title: String
    price: Float
    category: String
    description: String
    stock: Int
    vendor: String
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`);

// Resolvers - actual logic jo query ka data fetch karta hai
const root = {
  products: () => products,
  product: ({ id }) => products.find(p => p.id === id)
};

module.exports = { schema, root };