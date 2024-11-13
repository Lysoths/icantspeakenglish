"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
type Word = {
  id: number;
  english: string;
  turkish: string[];
  imageUrl?: string; // Optional image URL
};

export default function WordForm() {
  const [englishWord, setEnglishWord] = useState("");
  const [turkishTranslations, setTurkishTranslations] = useState([""]);
  const [imgUrl, setImgUrl] = useState(""); // For image URL
  const [words, setWords] = useState<Word[]>([]);
  const [message, setMessage] = useState("");
  const [editingWordId, setEditingWordId] = useState<number | null>(null);

  // Fetch existing words
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/words");
      const data = await response.json();
      setWords(data.words);
    };

    fetchWords();
  }, []);

  // Add new Turkish translation input
  const handleAddTranslation = () => {
    setTurkishTranslations([...turkishTranslations, ""]);
  };

  // Update Turkish translation field
  const handleTranslationChange = (index: number, value: string) => {
    const updatedTranslations = [...turkishTranslations];
    updatedTranslations[index] = value;
    setTurkishTranslations(updatedTranslations);
  };

  // Submit new word or update existing one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingWordId ? "PUT" : "POST";
    const url = editingWordId ? `/api/words/${editingWordId}` : "/api/words";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english: englishWord,
          turkish: turkishTranslations,
          imageUrl: imgUrl, // Include image URL in request body
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage(
          editingWordId
            ? "Kelime başarıyla güncellendi!"
            : "Kelime başarıyla eklendi!"
        );

        if (editingWordId) {
          // Update word in list
          setWords(
            words.map((word) =>
              word.id === editingWordId ? result.word : word
            )
          );
        } else {
          setWords([...words, result.word]);
        }

        setEnglishWord("");
        setTurkishTranslations([""]);
        setImgUrl(""); // Clear image URL field
        setEditingWordId(null);
      } else {
        setMessage("Kelime eklenemedi: " + result.message);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setMessage("Beklenmedik bir hata oluştu.");
    }
  };

  // Edit word
  const handleEdit = (word: Word) => {
    setEnglishWord(word.english);
    setTurkishTranslations(word.turkish);
    setImgUrl(word.imageUrl || ""); // Set existing image URL or empty string
    setEditingWordId(word.id);
  };

  // Delete word
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Kelime başarıyla silindi!");
        setWords(words.filter((word) => word.id !== id));
      } else {
        setMessage("Kelime silinemedi: " + result.message);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setMessage("Beklenmedik bir hata oluştu.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingWordId ? "Kelimeyi Güncelle" : "Yeni Kelime Ekle"}
      </h2>
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

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Resim URL
          </label>
          <input
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Resim URL'si girin"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          {editingWordId ? "Güncelle" : "Kaydet"}
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
              className="bg-purple-100 p-4 rounded-lg shadow-md border border-purple-200 flex flex-col items-center justify-between"
            >
              <div className="flex items-center flex-col">
                <h3 className="text-lg font-semibold text-purple-700 mb-1">
                  {word.english}
                </h3>
                <p className="text-gray-800 mb-2">{word.turkish.join(", ")}</p>
              </div>
              {word.imageUrl ? (
                <Image
                  src={word.imageUrl}
                  alt={`${word.english} için görsel`}
                  width={150}
                  height={150}
                  className="object-cover  mb-2"
                />
              ) : (
                <div className="w-[100px] h-[100px] flex text-center items-center justify-center bg-gray-300  text-gray-600">
                  Resim Yok
                </div>
              )}
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(word)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(word.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
