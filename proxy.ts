import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

// Routes that now live in the Vite dashboard
const dashboardRoutes = [
  "/dashboard",
  "/keywords",
  "/competitors",
  "/recommendations",
  "/reports",
  "/settings",
  "/onboarding",
  "/domains",
];

// Routes that require authentication
const protectedRoutes = ["/invite"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup", "/forgot-password"];

// Decode JWT locally without verification - just check expiration
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp ? decoded.exp * 1000 < Date.now() : false;
  } catch {
    return true;
  }
}

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isDashboardRoute = dashboardRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  ) || pathname.startsWith("/dashboard");
  const isProtectedRoute = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const isAuth = authRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  // Clear expired tokens
  if (token && isTokenExpired(token)) {
    const response = isDashboardRoute || isProtectedRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
    response.cookies.delete("access_token");
    return response;
  }

  // Protected routes without token → login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect dashboard routes to the Vite SPA
  if (isDashboardRoute && token) {
    // If we're already on a path that starts with /dashboard, just let it go
    // (This shouldn't happen anyway if the infrastructure proxy is working)
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    
    // Prefix the route with /dashboard so Traefik/Caddy routes it to the Vite container
    const targetPath = "/dashboard" + (pathname.startsWith('/') ? pathname : '/' + pathname);
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  // Dashboard routes without token → login
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle ?logout=1 on auth routes
  if (isAuth && searchParams.get("logout") === "1") {
    const response = NextResponse.next();
    response.cookies.delete("access_token");
    return response;
  }

  // Redirect authenticated users away from auth pages → Vite dashboard
  if (isAuth && token) {
    return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
