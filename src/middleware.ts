import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth", req.url));

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/[hub_id]/:path*"], 
};
