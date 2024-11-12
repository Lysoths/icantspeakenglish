import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Çıkış yapıldı.",
  });

  // Token'i kaldırmak için cookie'yi temizliyoruz
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Cookie'yi silmek için süresini sıfırlıyoruz
    path: "/",
  });

  return response;
}
