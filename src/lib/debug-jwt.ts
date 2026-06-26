import { jwtVerify } from 'jose';

export async function debugJWT(token: string) {
  try {
    // Try to decode without verification first
    const parts = token.split('.');
    if (parts.length !== 3) {
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Now try with verification
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload: verifiedPayload } = await jwtVerify(token, SECRET);
    
  } catch (error) {
    console.error('Error debugging JWT:', error);
  }
}
