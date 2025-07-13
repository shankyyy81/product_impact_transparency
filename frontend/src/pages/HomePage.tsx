import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';
import { productApi } from '../services/api';
import './HomePage.css';

// Import background image
import bgImage from '../bg.jpeg';

const impactTabs = [
  { label: 'All', value: 'all' },
  { label: 'Low Impact', value: 'green' },
  { label: 'Medium Impact', value: 'yellow' },
  { label: 'High Impact', value: 'red' },
];

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [impactFilter, setImpactFilter] = useState('all');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await productApi.getAllProducts();
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    const matchesImpact = impactFilter === 'all' || product.impactMeter === impactFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.store.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower);
    return matchesImpact && matchesSearch;
  });

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section with Background Image */}
      <section 
        className="hero-section"
        style={{
          '--bg-image': `url(${bgImage})`
        } as React.CSSProperties}
      >
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>💚 Product Impact Transparency</h1>
          <p>Discover sustainable products and their environmental impact</p>
          <button className="help-btn" onClick={() => setShowHelp(true)}>
            What do these metrics mean?
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Tabs and Search */}
        <div className="top-bar">
          <div className="impact-tabs">
            {impactTabs.map(tab => (
              <button
                key={tab.value}
                className={`impact-tab${impactFilter === tab.value ? ' active' : ''}`}
                onClick={() => setImpactFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <input
            className="search-bar"
            type="text"
            placeholder="Search by product, store, or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        <section className="products-section">
          <h2>Available Products</h2>
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-results">No products found.</div>
            ) : (
              filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`} 
                  className="product-card"
                >
                  <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <div>
                      <h3>{product.name}</h3>
                      <div className="badges-row">
                        <span className="badge store-badge">{product.store}</span>
                      </div>
                    </div>
                    <div className="impact-badge"
                      style={{ backgroundColor: getImpactMeterColor(product.impactMeter) }}
                    >
                      {getImpactMeterText(product.impactMeter)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <h3>What do these metrics mean?</h3>
            <ul>
              <li><b>Carbon Footprint</b>: Estimated greenhouse gas emissions (kg CO₂e) for the product's lifecycle.</li>
              <li><b>Recyclability</b>: Percentage of the product and packaging that can be recycled.</li>
              <li><b>Sourcing</b>: Where and how the product was sourced (country, region, etc.).</li>
              <li><b>Ethical Score</b>: Information about fair labor, organic certification, or other ethical factors.</li>
              <li><b>Impact Meter</b>: Green = Low Impact, Yellow = Medium, Red = High Impact.</li>
              <li><b>Store/Brand</b>: Where you can buy the product and the brand name.</li>
            </ul>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <p>💚 Making sustainable choices easier</p>
        <p>Powered by Walmart Sparkathon 2025</p>
      </footer>
    </div>
  );
};

export default HomePage; 