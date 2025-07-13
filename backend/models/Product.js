const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  carbonFootprint: {
    type: Number,
    required: true,
    min: 0
  },
  recyclability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sourcing: {
    type: String,
    required: true
  },
  ethicalScore: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  impactMeter: {
    type: String,
    enum: ['green', 'yellow', 'red'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  store: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  buyUrl: {
    type: String,
    required: true
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema); 