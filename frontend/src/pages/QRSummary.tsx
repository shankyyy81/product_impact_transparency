import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product';
import { productApi } from '../services/api';
import './QRSummary.css';

const QRSummary: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError('No product ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product with ID:', productId);
        const productData = await productApi.getProductById(productId);
        console.log('Product data received:', productData);
        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        if (err.response?.status === 404) {
          setError(`Product with ID "${productId}" not found.`);
        } else if (err.code === 'ECONNREFUSED') {
          setError('Unable to connect to server. Please ensure the backend is running.');
        } else {
          setError(`Failed to load product data: ${err.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const getImpactMeterColor = (impactMeter: string) => {
    switch (impactMeter) {
      case 'green': return '#4CAF50';
      case 'yellow': return '#FFC107';
      case 'red': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getImpactMeterText = (impactMeter: string) => {
    switch (impactMeter) {
      case 'green': return 'Low Impact';
      case 'yellow': return 'Medium Impact';
      case 'red': return 'High Impact';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="qr-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="qr-container">
        <div className="error">
          <h2>Product Not Found</h2>
          <p>{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-container">
      <div className="qr-card">
        {/* Product Image and Basic Info */}
        <div className="product-header">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <div className="product-basic-info">
            <h1>{product.name}</h1>
            <div className="store-brand">
              <span className="store">{product.store}</span>
              <span className="brand">{product.brand}</span>
            </div>
          </div>
        </div>

        {/* Impact Badge */}
        <div 
          className="impact-badge"
          style={{ backgroundColor: getImpactMeterColor(product.impactMeter) }}
        >
          {getImpactMeterText(product.impactMeter)}
        </div>

        {/* Ecological Summary */}
        <div className="ecological-summary">
          <h2>Ecological Impact Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">🌱 Carbon Footprint</span>
              <span className="value">{product.carbonFootprint} kg CO₂e</span>
            </div>
            <div className="summary-item">
              <span className="label">♻️ Recyclability</span>
              <span className="value">{product.recyclability}%</span>
            </div>
            <div className="summary-item">
              <span className="label">🌍 Sourcing</span>
              <span className="value">{product.sourcing}</span>
            </div>
            <div className="summary-item">
              <span className="label">🤝 Ethical Score</span>
              <span className="value">{product.ethicalScore}</span>
            </div>
          </div>
        </div>

        {/* Buy Link */}
        <div className="buy-section">
          <a 
            href={product.buyUrl} 
            className="buy-button" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            🛒 Buy on {product.store}
          </a>
        </div>

        {/* Footer */}
        <div className="qr-footer">
          <p>💚 Product Impact Transparency</p>
        </div>
      </div>
    </div>
  );
};

export default QRSummary; 