// Network utilities for mobile testing
import { getMobileUrl } from '../config/mobileConfig';

export const getLocalIPAddress = async (): Promise<string | null> => {
  try {
    // Try to get local IP through a WebRTC connection
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    return new Promise((resolve) => {
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = ipRegex.exec(event.candidate.candidate);
          if (match) {
            const ip = match[1];
            // Filter out localhost and public IPs
            if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
              pc.close();
              resolve(ip);
            }
          }
        }
      };
      
      // Timeout after 5 seconds
      setTimeout(() => {
        pc.close();
        resolve(null);
      }, 5000);
    });
  } catch (error) {
    console.warn('Could not detect local IP address:', error);
    return null;
  }
};

export const getQrCodeUrl = (productId: string): string => {
  return getMobileUrl(`/qr/${productId}`);
}; 