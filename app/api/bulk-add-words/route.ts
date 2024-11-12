import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  // Eklenecek kelime listesi
  const words = [
    { english: "pollution", turkish: ["kirlilik"] },
    { english: "eager to", turkish: ["istekli"] },
    { english: "commercial", turkish: ["kârlı"] },
    { english: "feasible", turkish: ["uygulanabilir"] },
    { english: "belonging", turkish: ["eşya", "mal", "mülk"] },
    { english: "behaviour", turkish: ["davranış"] },
    { english: "in terms of", turkish: ["açısından", "bakımından"] },
    { english: "diverse", turkish: ["çeşitli"] },
    { english: "broke", turkish: ["beş parasız"] },
    { english: "competent", turkish: ["yetkin", "bilgili"] },
    { english: "mighty", turkish: ["çok güçlü", "kuvvetli"] },
    { english: "prohibited", turkish: ["yasaklanmış", "yasak"] },
    { english: "attitude", turkish: ["tutum"] },
    { english: "meticulous", turkish: ["titiz"] },
    { english: "eminent", turkish: ["ünlü"] },
    { english: "surround", turkish: ["çevrelemek"] },
    { english: "recognize", turkish: ["tanımak", "hatırlamak"] },
    { english: "consume", turkish: ["tüketmek"] },
    { english: "consumer", turkish: ["tüketen kişi"] },
    { english: "infants", turkish: ["yeni doğan bebek", "0-2 yaş arası"] },
    { english: "susceptible", turkish: ["savunmasız"] },
    { english: "severe", turkish: ["ciddi", "ağır", "aşırı"] },
    { english: "among", turkish: ["arasında"] },
    { english: "proper", turkish: ["düzgün", "uygun"] },
    { english: "worn", turkish: ["eskimiş", "yıpranmış"] },
    { english: "appoint", turkish: ["atamak", "görevlendirmek"] },
    { english: "nutritious", turkish: ["besleyici"] },
    { english: "invincible", turkish: ["yenilmez"] },
    { english: "belligerent", turkish: ["kötü huylu"] },
    { english: "cautious", turkish: ["dikkatli", "titiz"] },
    { english: "distinctive", turkish: ["ünlü", "iyi bilinen"] },
    { english: "spectical", turkish: ["şüpheci", "kuşkucu"] },
    { english: "dubious", turkish: ["şüpheli"] },
    { english: "determine", turkish: ["belirlemek", "saptamak"] },
    { english: "determined", turkish: ["kararlı"] },
    { english: "decisive", turkish: ["kararlı"] },
    { english: "indecisive", turkish: ["kararsız", "şüpheci"] },
    { english: "decide", turkish: ["karar vermek"] },
    { english: "lead to", turkish: ["katkıda bulunmak", "sebep olmak"] },
    { english: "diagnose", turkish: ["tanı koymak", "hastalığı teşhis etmek"] },
    { english: "treat", turkish: ["tedavi etmek"] },
    { english: "excessive", turkish: ["olması gerekenden fazla", "aşırı"] },
    { english: "well-being", turkish: ["sağlık", "zindelik durumu"] },
    { english: "individual", turkish: ["birey"] },
    { english: "restricted", turkish: ["kısıtlamak", "kısıtlayıcı"] },
    { english: "insufficient", turkish: ["yetersiz"] },
    { english: "considerable", turkish: ["kayda değer", "bol", "çok"] },
    { english: "infrastructure", turkish: ["altyapı"] },
    { english: "provide", turkish: ["sağlamak"] },
    { english: "scarce", turkish: ["kıt", "yetersiz"] },
    { english: "particularly", turkish: ["özellikle", "bilhassa"] },
    { english: "on the other hand", turkish: ["öte yandan", "diğer yandan"] },
    { english: "prevalent", turkish: ["yaygın"] },
    { english: "such as", turkish: ["gibi"] },
  ];

  try {
    for (const word of words) {
      // Aynı kelime zaten varsa ekleme işlemi yapma
      const existingWord = await prisma.word.findUnique({
        where: { english: word.english.toLowerCase() },
      });

      if (!existingWord) {
        await prisma.word.create({
          data: {
            english: word.english.toLowerCase(), // Büyük/küçük harf duyarlılığını kaldırmak için küçük harfe çevir
            turkish: word.turkish,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Kelimeler başarıyla eklendi.",
    });
  } catch (error) {
    console.error("Kelimeler eklenirken hata oluştu:", error);
    return NextResponse.json({
      success: false,
      message: "Kelimeler eklenirken bir hata oluştu.",
    });
  }
}
