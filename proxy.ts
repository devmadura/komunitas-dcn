import { NextResponse, NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (!isMaintenance) return NextResponse.next();

  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (
    pathname === "/favicon.ico" ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|otf)$/)
  ) {
    return NextResponse.next();
  }

  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};
