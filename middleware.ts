// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const base64Payload = token.split(".")[1];
      const padded = base64Payload + "=".repeat((4 - base64Payload.length % 4) % 4);
      const payload = JSON.parse(
        Buffer.from(padded, "base64").toString("utf-8")
      );

      if (payload.role !== "admin") {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};