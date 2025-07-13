const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const { seedDatabase, seedProducts } = require('./data/seedData');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// In-memory data fallback when MongoDB is not available
let inMemoryProducts = [];

// Routes
app.use('/api/products', productRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Product Impact Transparency API is running.' });
});

// Seed database on startup (for development)
if (process.env.NODE_ENV !== 'production') {
  // Try to seed database, if it fails, use in-memory data
  seedDatabase().catch(() => {
    console.log('Using in-memory data as fallback...');
    inMemoryProducts = [...seedProducts];
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 