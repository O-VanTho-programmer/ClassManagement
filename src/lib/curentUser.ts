import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { debugJWT } from "./debug-jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log('Token from cookie:', token ? 'Token exists' : 'No token found');

  if (!token) return null;

  // Debug the JWT token
  await debugJWT(token);

  try {
    const payload = await verifyToken(token);
    console.log('Final payload returned by getCurrentUser:', payload);
    return payload; // { userId, email, role }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

