import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kelimeyi güncelle (PUT)
export async function PUT(request: Request) {
  const { english, turkish, imageUrl } = await request.json();
  const url = new URL(request.url);
  const wordId = url.pathname.split("/").pop(); // URL'den id'yi alır

  if (!wordId) {
    return NextResponse.json({
      success: false,
      message: "Geçersiz ID",
    });
  }

  try {
    const lowerCaseEnglish = english.toLowerCase();

    const existingWord = await prisma.word.findFirst({
      where: {
        english: lowerCaseEnglish,
        id: {
          not: wordId,
        },
      },
    });

    if (existingWord) {
      return NextResponse.json({
        success: false,
        message: "Bu kelime zaten ekli.",
      });
    }

    const updatedWord = await prisma.word.update({
      where: { id: wordId },
      data: {
        english: lowerCaseEnglish,
        turkish,
        imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kelime başarıyla güncellendi.",
      word: updatedWord,
    });
  } catch (error) {
    console.error("Kelime güncelleme hatası:", error);
    return NextResponse.json({
      success: false,
      message: "Kelime güncellenirken bir hata oluştu.",
    });
  }
}

// Kelimeyi sil (DELETE)
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const wordId = url.pathname.split("/").pop(); // URL'den id'yi alır

  if (!wordId) {
    return NextResponse.json({
      success: false,
      message: "Geçersiz ID",
    });
  }

  try {
    await prisma.word.delete({
      where: { id: wordId },
    });

    return NextResponse.json({
      success: true,
      message: "Kelime başarıyla silindi.",
    });
  } catch (error) {
    console.error("Kelime silme hatası:", error);
    return NextResponse.json({
      success: false,
      message: "Kelime silinirken bir hata oluştu.",
    });
  }
}
