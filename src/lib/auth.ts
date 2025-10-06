import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
console.log('JWT_SECRET environment variable:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('Using secret:', process.env.JWT_SECRET || 'dev-secret');

export type JWTPayload = { 
  userId: string; 
  email: string; 
  role: string; 
  name: string 
};

export async function signToken(payload: JWTPayload, expiresIn = '1d') {
  console.log('Creating JWT with payload:', payload);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
  console.log('JWT token created:', token);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    throw error;
  }
}
