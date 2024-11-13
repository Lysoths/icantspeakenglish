import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kelimeyi güncelle (PUT)
export async function PUT(
  request: Request,
  context: { params: { id: string } } // context içindeki params'ı kullanıyoruz
) {
  const { english, turkish, imageUrl } = await request.json();
  const wordId = context.params.id; // id'yi context'ten alıyoruz

  try {
    // İngilizce kelimeyi küçük harfe çevirerek kontrol et
    const lowerCaseEnglish = english.toLowerCase();

    // Aynı İngilizce kelime var mı kontrol et (güncellenen kelime dışında)
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
export async function DELETE(
  request: Request,
  context: { params: { id: string } } // context içindeki params'ı kullanıyoruz
) {
  const wordId = context.params.id;

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
