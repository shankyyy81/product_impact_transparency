const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  console.log('🌐 Available network interfaces:');
  console.log('================================');
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        console.log(`📱 ${name}: ${interface.address}`);
        
        // Highlight common local network ranges
        if (interface.address.startsWith('192.168.') || 
            interface.address.startsWith('10.') || 
            interface.address.startsWith('172.')) {
          console.log(`   ✅ Use this for mobile testing: http://${interface.address}:3000`);
        }
      }
    }
  }
  
  console.log('\n📋 Instructions:');
  console.log('1. Choose an IP address from above (preferably 192.168.x.x, 10.x.x.x, or 172.x.x.x)');
  console.log('2. Update the ProductDashboard.tsx file with your IP address');
  console.log('3. Make sure your phone is on the same WiFi network as your computer');
  console.log('4. Test the QR code on your phone!');
}

getLocalIPAddress(); 