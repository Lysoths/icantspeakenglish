import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Kullanıcıyı e-posta ile veritabanında ara
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    // Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Şifre yanlış.",
      });
    }

    // Token oluştur
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // HTTP-only cookie olarak token'ı ayarlayın
    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı.",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 saat
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Giriş işlemi sırasında hata oluştu:", error);
    return NextResponse.json({
      success: false,
      message: "Giriş işlemi başarısız.",
    });
  }
}
