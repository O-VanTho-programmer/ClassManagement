import { jwtVerify } from 'jose';

export async function debugJWT(token: string) {
  try {
    // Try to decode without verification first
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Invalid JWT format');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('Raw JWT payload (base64 decoded):', payload);
    
    // Now try with verification
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload: verifiedPayload } = await jwtVerify(token, SECRET);
    console.log('Verified JWT payload:', verifiedPayload);
    
  } catch (error) {
    console.error('Error debugging JWT:', error);
  }
}
