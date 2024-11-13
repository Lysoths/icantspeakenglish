import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kelimeyi güncelle (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { english, turkish, imageUrl } = await request.json(); // imageUrl de alınıyor
  const wordId = params.id; // id'yi string olarak bırakıyoruz

  try {
    // İngilizce kelimeyi küçük harfe çevirerek kontrol et
    const lowerCaseEnglish = english.toLowerCase();

    // Aynı İngilizce kelime var mı kontrol et (güncellenen kelime dışında)
    const existingWord = await prisma.word.findFirst({
      where: {
        english: lowerCaseEnglish,
        id: {
          not: wordId, // wordId string tipinde
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
      where: { id: wordId }, // wordId string tipinde
      data: {
        english: lowerCaseEnglish,
        turkish,
        imageUrl, // Yeni alan imageUrl eklendi
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
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const wordId = params.id; // id'yi string olarak bırakıyoruz

  try {
    await prisma.word.delete({
      where: { id: wordId }, // wordId string tipinde
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
