"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Beklenmeyen yanıt:", errorText);
        setMessage("Giriş başarısız: " + errorText);
        return;
      }

      const result = await response.json();
      console.log(result);
      if (result.success) {
        localStorage.setItem("token", result.token);

        setMessage("Giriş başarılı!");
        router.push("/dashboard");
      } else {
        setMessage("Giriş başarısız: " + result.message);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setMessage("Beklenmedik bir hata oluştu.");
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Kullanıcı Girişi
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="email"
          >
            E-posta
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="password"
          >
            Şifre
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Şifrenizi girin"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Giriş Yap
        </button>

        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-red-500">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
