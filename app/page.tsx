"use client";

import LogoutButton from "@/components/LogoutButton";
import { useState, useEffect } from "react";

type Word = {
  id: number;
  english: string;
  turkish: string[];
};

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTurkish, setSelectedTurkish] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Yüklenme durumunu tutacak state

  // Veritabanından kelimeleri al ve oyun başlangıç ayarlarını yap
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words");
        const data = await response.json();
        if (data.success) {
          const shuffledWords = [...data.words].sort(() => 0.5 - Math.random());
          setWords(shuffledWords);
          setCurrentIndex(0);
          setScore(0);
          setResultMessage("");
          generateOptions(shuffledWords[0], shuffledWords); // İlk kelime için seçenekleri oluştur
        }
      } catch (error) {
        console.error("Kelimeler yüklenirken bir hata oluştu:", error);
      } finally {
        setIsLoading(false); // Kelimeler yüklendiğinde loading durumunu kapat
      }
    };

    fetchWords();
  }, []);

  // Yanıt seçeneklerini oluşturma
  const generateOptions = (currentWord: Word, wordsList: Word[]) => {
    const correctAnswers = currentWord.turkish;
    const allWrongAnswers = wordsList
      .flatMap((word) => word.turkish)
      .filter((meaning) => !correctAnswers.includes(meaning));

    const wrongAnswers = allWrongAnswers
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const newOptions = [...correctAnswers, ...wrongAnswers].sort(
      () => 0.5 - Math.random()
    );

    setOptions(newOptions);
  };

  const checkMatch = () => {
    if (
      selectedTurkish &&
      words[currentIndex].turkish.includes(selectedTurkish)
    ) {
      setScore(score + 1);
      setResultMessage("Doğru eşleştirme yaptınız!");
      setTimeout(() => {
        setResultMessage("");
        setSelectedTurkish(null);
        if (currentIndex < words.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          generateOptions(words[nextIndex], words);
        } else {
          setResultMessage(`Oyun bitti! Skorunuz: ${score + 1}`);
        }
      }, 1000);
    } else {
      setResultMessage("Yanlış eşleştirme, baştan başlıyor.");
      setTimeout(() => {
        setSelectedTurkish(null);
        setCurrentIndex(0);
        setScore(0);
        generateOptions(words[0], words);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-6 mt-7"
      style={{ backgroundColor: "var(--arkaPlan)", color: "var(--yaziRengi)" }}
    >
      <div
        className="w-full max-w-2xl shadow-lg rounded-lg p-6"
        style={{
          backgroundColor: "var(--arkaPlan)",
          color: "var(--yaziRengi)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          İngilizce - Türkçe Kelime Eşleştirme
        </h1>

        <div className="text-lg font-semibold text-center mb-4">
          Skor: {score} / {words.length} - Kalan Kelimeler:{" "}
          {words.length - currentIndex}
        </div>

        <div className="flex justify-between space-x-4 mb-6">
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-2">İngilizce Kelime</h2>
            <div className="p-4 border rounded-lg text-center font-medium bg-blue-100 text-blue-800">
              {words[currentIndex]?.english}
            </div>
          </div>

          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-2">Türkçe Anlamı</h2>
            <ul className="grid gap-2">
              {options.map((turkishWord, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedTurkish(turkishWord)}
                  className={`cursor-pointer p-3 border rounded-lg text-center font-medium ${
                    selectedTurkish === turkishWord
                      ? "bg-gray-200"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                  style={{
                    borderColor:
                      selectedTurkish === turkishWord
                        ? "rgba(0, 0, 0, 0.3)"
                        : "var(--yaziRengi)",
                  }}
                >
                  {turkishWord}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={checkMatch}
          className="w-full py-3 rounded-lg font-semibold mb-6 transition-colors bg-green-500 text-white hover:bg-green-600"
        >
          Eşleştir
        </button>

        {resultMessage && (
          <p
            className="text-lg font-semibold text-center"
            style={{
              color:
                resultMessage === "Doğru eşleştirme yaptınız!"
                  ? "var(--successColor)"
                  : "var(--errorColor)",
            }}
          >
            {resultMessage}
          </p>
        )}
      </div>
    </div>
  );
}
