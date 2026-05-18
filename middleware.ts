import { getUser } from "@/lib/auth/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for protecting routes that require authentication
 * 
 * Protected routes:
 * - /checkout/* - Requires authentication
 * - /dashboard/* - Requires authentication (future)
 * 
 * Public routes:
 * - / - Browse products
 * - /products/* - View products
 * - /cart/* - Manage cart
 * - /sign-in - Sign in page
 * - /sign-up - Sign up page
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ["/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const user = await getUser();

    // Redirect unauthenticated users to sign-in
    if (!user) {
      const signInUrl = new URL("/sign-in", request.url);
      // Add returnUrl to redirect back after sign-in
      signInUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
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
