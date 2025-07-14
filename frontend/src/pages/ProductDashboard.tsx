import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types/Product';
import { productApi } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { getQrCodeUrl } from '../utils/networkUtils';
import './ProductDashboard.css';

const ProductDashboard: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const productData = await productApi.getProductById(productId);
        setProduct(productData);
        const alternativesData = await productApi.getProductAlternatives(productId);
        setAlternatives(alternativesData.alternatives);
      } catch (err) {
        setError('Failed to load product data. Please try again.');
        console.error('Error fetching product:', err);
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
      <div className="dashboard-container">
        <div className="loading">Loading product information...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h2>Product Not Found</h2>
          <p>{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    );
  }

  // For QR code, use the QR summary page URL
  const qrCodeUrl = getQrCodeUrl(product.id);
  
  // Compose summary for modal
  const summaryText = `${product.name} (${product.brand}, ${product.store})\n\n` +
    `• Carbon Footprint: ${product.carbonFootprint} kg CO₂e\n` +
    `• Recyclability: ${product.recyclability}%\n` +
    `• Sourcing: ${product.sourcing}\n` +
    `• Ethical Score: ${product.ethicalScore}\n` +
    `• Impact: ${getImpactMeterText(product.impactMeter)}`;

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <Link to="/" className="back-button">
          ← Back to Products
        </Link>
      </nav>

      {/* Header */}
      <header className="dashboard-header">
        <h1>💚 Product Impact</h1>
        <p>Transparency Dashboard</p>
      </header>

      {/* Product Info */}
      <section className="product-info">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-details">
          <h2>{product.name}</h2>
          <div className="product-badges">
            <span className="badge store-badge">{product.store}</span>
            <span className="badge brand-badge">{product.brand}</span>
          </div>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-buttons">
          <a href={product.buyUrl} className="buy-button" target="_blank" rel="noopener noreferrer">
            🛒 Where to Buy
          </a>
          <button className="summary-button" onClick={() => setShowSummary(true)}>
            📊 Ecological Summary
          </button>
        </div>
        <div className="qr-section">
          <div className="qr-code-container">
            <QRCodeSVG value={qrCodeUrl} size={120} />
            <p className="qr-label">Scan for product details</p>
          </div>
        </div>
      </section>

      {/* Impact Meter */}
      <section className="impact-meter">
        <h3>Environmental Impact</h3>
        <div 
          className="meter-indicator"
          style={{ backgroundColor: getImpactMeterColor(product.impactMeter) }}
        >
          <span>{getImpactMeterText(product.impactMeter)}</span>
        </div>
      </section>

      {/* Sustainability Metrics */}
      <section className="sustainability-metrics">
        <h3>Sustainability Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🌱</div>
            <div className="metric-content">
              <h4>Carbon Footprint</h4>
              <p className="metric-value">{product.carbonFootprint} kg CO₂e</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">♻️</div>
            <div className="metric-content">
              <h4>Recyclability</h4>
              <p className="metric-value">{product.recyclability}%</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🌍</div>
            <div className="metric-content">
              <h4>Sourcing</h4>
              <p className="metric-value">{product.sourcing}</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🤝</div>
            <div className="metric-content">
              <h4>Ethical Score</h4>
              <p className="metric-value">{product.ethicalScore}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternatives */}
      <section className="alternatives">
        {product.impactMeter === 'green' ? (
          <>
            <h3>🌿 Best Choice</h3>
            <div className="best-choice-message">
              <div className="best-choice-icon">🏆</div>
              <div className="best-choice-content">
                <h4>This is the best option!</h4>
                <p>This product has the lowest environmental impact in its category. You're making a great sustainable choice!</p>
                <div className="impact-badge best-impact-badge">
                  Low Impact
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3>🌿 Better Alternatives</h3>
            {alternatives.length > 0 ? (
              <div className="alternatives-grid">
                {alternatives.map((alt) => (
                  <Link key={alt.id} to={`/product/${alt.id}`} className="alternative-card">
                    <img src={alt.imageUrl} alt={alt.name} />
                    <div className="alternative-info">
                      <h4>{alt.name}</h4>
                      <p className="carbon-footprint">
                        {alt.carbonFootprint} kg CO₂e
                      </p>
                      <p className="recyclability">
                        {alt.recyclability}% recyclable
                      </p>
                      <div 
                        className="impact-badge"
                        style={{ backgroundColor: getImpactMeterColor(alt.impactMeter) }}
                      >
                        {getImpactMeterText(alt.impactMeter)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-alternatives">
                <p>No better alternatives found for this category.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Summary Modal */}
      {showSummary && (
        <div className="summary-modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="summary-modal" onClick={e => e.stopPropagation()}>
            <h3>Ecological Impact Summary</h3>
            <pre>{summaryText}</pre>
            <button onClick={() => setShowSummary(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>💚 Making sustainable choices easier</p>
      </footer>
    </div>
  );
};

export default ProductDashboard; 