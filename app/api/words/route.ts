import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const words = await prisma.word.findMany();
    return NextResponse.json({ success: true, words });
  } catch (error) {
    console.error("Kelimeler alınırken hata oluştu:", error);
    return NextResponse.json({
      success: false,
      message: "Kelimeler alınamadı.",
    });
  }
}

export async function POST(request: Request) {
  const { english, turkish } = await request.json();

  try {
    // İngilizce kelimeyi küçük harfe çevirerek kontrol et
    const lowerCaseEnglish = english.toLowerCase();

    // Aynı İngilizce kelime küçük harfe çevrilmiş olarak veritabanında var mı kontrol et
    const existingWord = await prisma.word.findFirst({
      where: { english: lowerCaseEnglish },
    });

    if (existingWord) {
      return NextResponse.json({
        success: false,
        message: "Bu kelime zaten ekli.",
      });
    }

    const newWord = await prisma.word.create({
      data: {
        english: lowerCaseEnglish,
        turkish,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kelime başarıyla eklendi.",
      word: newWord,
    });
  } catch (error) {
    console.error("Kelime ekleme hatası:", error);
    return NextResponse.json({
      success: false,
      message: "Kelime eklenirken bir hata oluştu.",
    });
  }
}
