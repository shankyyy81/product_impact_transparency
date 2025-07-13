const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { seedProducts } = require('../data/seedData');

// In-memory data fallback
let inMemoryProducts = [...seedProducts];

// Helper function to get products (MongoDB or in-memory)
const getProducts = async () => {
  try {
    const products = await Product.find().limit(20);
    return products;
  } catch (error) {
    console.log('Using in-memory products...');
    return inMemoryProducts;
  }
};

// Helper function to find product by ID
const findProductById = async (id) => {
  try {
    const product = await Product.findOne({ id });
    return product;
  } catch (error) {
    console.log('Using in-memory product lookup...');
    return inMemoryProducts.find(p => p.id === id);
  }
};

// GET /api/products/:id - Get product sustainability metadata
router.get('/:id', async (req, res) => {
  try {
    const product = await findProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch product data'
    });
  }
});

// GET /api/products/:id/alternatives - Get alternative eco-friendly products
router.get('/:id/alternatives', async (req, res) => {
  try {
    const currentProduct = await findProductById(req.params.id);
    
    if (!currentProduct) {
      return res.status(404).json({ 
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }

    const allProducts = await getProducts();
    
    // Find alternative products in the same category with better sustainability scores
    const alternatives = allProducts
      .filter(product => 
        product.category === currentProduct.category &&
        product.id !== req.params.id &&
        ['green', 'yellow'].includes(product.impactMeter)
      )
      .sort((a, b) => {
        // Sort by carbon footprint (lower is better) then by recyclability (higher is better)
        if (a.carbonFootprint !== b.carbonFootprint) {
          return a.carbonFootprint - b.carbonFootprint;
        }
        return b.recyclability - a.recyclability;
      })
      .slice(0, 3);

    res.json({
      currentProduct: {
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category
      },
      alternatives
    });
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch alternative products'
    });
  }
});

// GET /api/products - Get all products (for development/testing)
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch products'
    });
  }
});

module.exports = router; 