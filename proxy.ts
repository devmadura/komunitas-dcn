import { NextResponse, NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Skip static files and internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|otf)$/)
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  if (isMaintenance && !pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  // Auth protection for dashboard
  const authToken = req.cookies.get("auth-token")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!authToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
