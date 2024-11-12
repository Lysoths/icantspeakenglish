"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Sunucudaki token cookie'sini temizlemek için logout API'sine istek gönder
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const result = await response.json();
      if (result.success) {
        // Giriş sayfasına yönlendir
        router.push("/login");
      } else {
        console.error("Çıkış yapılamadı: ", result.message);
      }
    } catch (error) {
      console.error("Çıkış işlemi sırasında hata oluştu:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
    >
      Çıkış Yap
    </button>
  );
}
