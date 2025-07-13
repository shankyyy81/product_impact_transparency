# Mobile QR Code Testing Setup

## Quick Setup for Mobile Testing

### Step 1: Find Your Local IP Address
Run this command to find your computer's IP address:
```bash
node get-local-ip.js
```

### Step 2: Update Configuration
Edit `frontend/src/config/mobileConfig.ts` and replace the IP address:
```typescript
LOCAL_IP: '192.168.1.100', // <-- Replace with your actual IP
```

### Step 3: Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Step 4: Test on Your Phone
1. Make sure your phone is on the same WiFi network as your computer
2. Go to `http://localhost:3000` on your computer
3. Click on any product to see the QR code
4. Scan the QR code with your phone's camera
5. The QR code should now open the product page on your phone!

## Troubleshooting

### QR Code Not Working?
- Check that both servers are running
- Verify your IP address is correct in `mobileConfig.ts`
- Ensure your phone is on the same WiFi network
- Try accessing the URL directly on your phone: `http://[YOUR-IP]:3000/qr/[PRODUCT-ID]`

### Common IP Address Ranges:
- `192.168.1.x` (most common)
- `192.168.0.x`
- `10.0.0.x`
- `172.16.x.x`

### Alternative Solutions:
1. **Use ngrok** (for public access):
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
   Then use the ngrok URL in your QR codes.

2. **Use your computer's hostname**:
   Replace IP with your computer's hostname (e.g., `http://your-computer-name.local:3000`)

## Example URLs
- Computer: `http://localhost:3000/qr/sku123456`
- Phone: `http://192.168.1.100:3000/qr/sku123456` 