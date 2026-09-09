import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const requestHeaders = new Headers(request.headers);

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Security checks
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Block sensitive paths
  const blockedPaths = [
    "/.env",
    "/.git",
    "/node_modules",
    "/package.json",
    "/tsconfig.json",
  ];

  if (blockedPaths.some((path) => pathname.startsWith(path))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // API rate limiting (simple)
  if (pathname.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent") || "";
    
    // Block suspicious user agents
    const blockedAgents = ["sqlmap", "nikto", "nmap", "masscan", "curl", "wget"];
    if (blockedAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Force HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(`https://${request.headers.get("host")}${request.url}`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};