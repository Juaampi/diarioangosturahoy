import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const isFacebookCrawler =
    userAgent.includes("facebookexternalhit") || userAgent.includes("facebot");

  if (isFacebookCrawler && pathname.startsWith("/noticia/")) {
    const slug = pathname.slice("/noticia/".length);

    if (slug) {
      const shareUrl = new URL(`/share/${slug}`, request.url);
      return NextResponse.rewrite(shareUrl);
    }
  }

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("dah_admin_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
