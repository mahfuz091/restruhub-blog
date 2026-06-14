import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({
    req,
     secret: process.env.AUTH_SECRET,
  });

 
  

  const { pathname } = req.nextUrl;

  // Protect /dashboard/users
  if (pathname.startsWith("/dashboard/users")) {
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Logged in but not ADMIN
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/users/:path*"],
};