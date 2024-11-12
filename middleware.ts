import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  if (token) {
    // Kullanıcı giriş yapmışsa, login veya register sayfalarına erişimi engelle
    if (url.pathname === "/login" || url.pathname === "/register") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } else {
    // Kullanıcı giriş yapmamışsa, korumalı sayfalara erişimi engelle
    if (url.pathname.startsWith("/dashboard")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Diğer sayfalarda yönlendirme yapmadan devam et
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
