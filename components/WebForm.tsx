"use client";

import { useState, useEffect } from "react";

type Word = {
  id: number;
  english: string;
  turkish: string[];
};

export default function WordForm() {
  const [englishWord, setEnglishWord] = useState("");
  const [turkishTranslations, setTurkishTranslations] = useState([""]);
  const [words, setWords] = useState<Word[]>([]);
  const [message, setMessage] = useState("");

  // Mevcut kelimeleri al
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/words");
      const data = await response.json();
      setWords(data.words);
    };

    fetchWords();
  }, []);

  // Türkçe çeviri alanına yenisini ekle
  const handleAddTranslation = () => {
    setTurkishTranslations([...turkishTranslations, ""]);
  };

  // Türkçe çeviri alanını güncelle
  const handleTranslationChange = (index: number, value: string) => {
    const updatedTranslations = [...turkishTranslations];
    updatedTranslations[index] = value;
    setTurkishTranslations(updatedTranslations);
  };

  // Kelimeyi veritabanına gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english: englishWord,
          turkish: turkishTranslations,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Kelime başarıyla eklendi!");
        setWords([...words, result.word]);
        setEnglishWord("");
        setTurkishTranslations([""]);
      } else {
        setMessage("Kelime eklenemedi: " + result.message);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setMessage("Beklenmedik bir hata oluştu.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Yeni Kelime Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            İngilizce Kelime
          </label>
          <input
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="İngilizce kelime girin"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Türkçe Anlamlar
          </label>
          {turkishTranslations.map((translation, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={translation}
                onChange={(e) => handleTranslationChange(index, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Türkçe anlam ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTranslation}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Yeni Anlam Ekle
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Kelimeyi Kaydet
        </button>

        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-green-600">
            {message}
          </p>
        )}
      </form>

      <div>
        <h2 className="text-xl font-bold mt-8 mb-4">
          Kelime Sayısı : {words.length}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {words.map((word) => (
            <div
              key={word.id}
              className="bg-purple-100 p-4 rounded-lg shadow-md border border-purple-200"
            >
              <h3 className="text-lg font-semibold text-purple-700 mb-1">
                {word.english}
              </h3>
              <p className="text-gray-800">{word.turkish.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
