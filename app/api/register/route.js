// app/api/register/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Bu e-posta zaten kayıtlı.",
      });
    }

    // Şifreyi hashle ve yeni kullanıcıyı oluştur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla kaydedildi.",
      user,
    });
  } catch (error) {
    console.error("Kullanıcı eklenirken hata oluştu:", error);
    return NextResponse.json({
      success: false,
      message: "Kullanıcı kaydedilemedi.",
    });
  }
}
