// Mobile testing configuration
// Update this file with your local IP address for mobile QR code testing

export const MOBILE_CONFIG = {
  // Replace this with your actual local IP address
  // Run 'node get-local-ip.js' to find your IP address
  LOCAL_IP: '192.168.1.100', // <-- UPDATE THIS WITH YOUR IP
  
  // Frontend port (usually 3000)
  FRONTEND_PORT: '3000',
  
  // Backend port (usually 4000)
  BACKEND_PORT: '4000',
  
  // Enable mobile testing mode
  ENABLE_MOBILE_TESTING: true,
};

// Helper function to get the mobile-friendly URL
export const getMobileUrl = (path: string): string => {
  if (!MOBILE_CONFIG.ENABLE_MOBILE_TESTING) {
    return `${window.location.origin}${path}`;
  }
  
  const hostname = window.location.hostname;
  
  // If running on localhost, use the configured local IP
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${MOBILE_CONFIG.LOCAL_IP}:${MOBILE_CONFIG.FRONTEND_PORT}${path}`;
  }
  
  return `${window.location.origin}${path}`;
};

// Helper function to get the backend API URL for mobile
export const getMobileApiUrl = (): string => {
  if (!MOBILE_CONFIG.ENABLE_MOBILE_TESTING) {
    return process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  }
  
  const hostname = window.location.hostname;
  
  // If running on localhost, use the configured local IP for backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${MOBILE_CONFIG.LOCAL_IP}:${MOBILE_CONFIG.BACKEND_PORT}/api`;
  }
  
  return process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
}; 