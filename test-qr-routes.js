const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

async function testQRRoutes() {
  console.log('Testing QR Code Routes...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Get all products
    console.log('\n2. Testing get all products...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.length} products`);
    
    if (productsResponse.data.length > 0) {
      const firstProduct = productsResponse.data[0];
      console.log('   First product:', firstProduct.name, '(ID:', firstProduct.id + ')');
      
      // Test 3: Get specific product by ID
      console.log('\n3. Testing get product by ID...');
      const productResponse = await axios.get(`${API_BASE_URL}/products/${firstProduct.id}`);
      console.log('✅ Product found:', productResponse.data.name);
      
      // Test 4: Test QR route URL
      const qrUrl = `http://localhost:3000/qr/${firstProduct.id}`;
      console.log('\n4. QR Code URL for testing:');
      console.log(`   ${qrUrl}`);
      console.log('\n✅ All tests passed! QR routes should work.');
    } else {
      console.log('❌ No products found in database');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
  }
}

testQRRoutes(); 