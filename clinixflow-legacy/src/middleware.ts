import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Adicionar o pathname aos headers para uso em server components
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-url", request.nextUrl.toString());

  // Debug: log para entender o que está acontecendo
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware]", {
      pathname,
      url: request.nextUrl.toString(),
      method: request.method,
    });
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Adicionar headers para prevenir cache e streaming que podem causar loops
  // Especialmente importante para /license-expired
  if (pathname === "/license-expired") {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
