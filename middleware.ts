import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for a portal route
  if (pathname.startsWith("/portals/")) {
    // Check for authentication token (you can modify this based on your auth implementation)
    const token = request.cookies.get("auth-token")

    if (!token) {
      // Redirect to signin page if not authenticated
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/portals/:path*"],
}
