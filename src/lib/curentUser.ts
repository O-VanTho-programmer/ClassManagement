import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { debugJWT } from "./debug-jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  // Debug the JWT token
  await debugJWT(token);

  try {
    const payload = await verifyToken(token);
    return payload; // { userId, email, role }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

