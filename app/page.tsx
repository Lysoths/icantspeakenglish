"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Word = {
  id: number;
  english: string;
  turkish: string[];
  imageUrl?: string;
};

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTurkish, setSelectedTurkish] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMatchDisabled, setIsMatchDisabled] = useState<boolean>(false);
  const [correctWords, setCorrectWords] = useState<Word[]>([]);
  const [hintCount, setHintCount] = useState<number>(5);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsedForCurrentWord, setHintUsedForCurrentWord] =
    useState<boolean>(false);
  const [incorrectWords, setIncorrectWords] = useState<Word[]>([]);

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
          setMaxScore(100);
          setResultMessage("");
          generateOptions(shuffledWords[0], shuffledWords);
        }
      } catch (error) {
        console.error("Kelimeler yüklenirken bir hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  const generateOptions = (currentWord: Word, wordsList: Word[]) => {
    const validTurkishMeanings = currentWord.turkish.filter(
      (meaning) => meaning.trim() !== ""
    );

    const correctAnswer =
      validTurkishMeanings.length > 0
        ? validTurkishMeanings[
            Math.floor(Math.random() * validTurkishMeanings.length)
          ]
        : null;

    const allWrongAnswers = wordsList
      .flatMap((word) => word.turkish)
      .filter((meaning) => meaning.trim() !== "" && meaning !== correctAnswer);

    const wrongAnswers = allWrongAnswers
      .sort(() => 0.5 - Math.random())
      .slice(0, correctAnswer ? 3 : 4);

    const newOptions = correctAnswer
      ? [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random())
      : wrongAnswers.sort(() => 0.5 - Math.random());

    setOptions(newOptions);
  };

  const checkMatch = () => {
    if (
      selectedTurkish &&
      words[currentIndex].turkish.includes(selectedTurkish)
    ) {
      setScore(score + 1);
      setResultMessage("Doğru eşleştirme yaptınız!");
      setCorrectWords([...correctWords, words[currentIndex]]);

      setTimeout(() => {
        setResultMessage("");
        setSelectedTurkish(null);
        setIsMatchDisabled(false);
        setShowHint(false);
        setHintUsedForCurrentWord(false);
        if (currentIndex < words.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          generateOptions(words[nextIndex], words);
        } else {
          setResultMessage(`Oyun bitti! Skorunuz: ${score}`);
        }
      }, 1000);
    } else {
      handleMistake();
    }
  };

  const handleMistake = () => {
    setResultMessage("Yanlış eşleştirme!");
    if (maxScore > 20) {
      setMaxScore((prevMaxScore) => prevMaxScore - 20); // Maksimum puanı 20 azalt
      setIncorrectWords([...incorrectWords, words[currentIndex]]);
      setIsMatchDisabled(true);
    } else {
      setMaxScore(0); // Puan 0 ise dur
    }
  };

  const continueGame = () => {
    setSelectedTurkish(null);
    setResultMessage("");
    setIsMatchDisabled(false);
    setShowHint(false);
    setHintUsedForCurrentWord(false);
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateOptions(words[nextIndex], words);
    } else {
      setResultMessage(`Oyun bitti! Skorunuz: ${score}`);
    }
  };

  const resetGame = () => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    setWords(shuffledWords);
    setCurrentIndex(0);
    setScore(0);
    setMaxScore(100);
    setSelectedTurkish(null);
    setResultMessage("");
    setIsMatchDisabled(false);
    setCorrectWords([]);
    setIncorrectWords([]);
    setHintCount(5);
    setShowHint(false);
    setHintUsedForCurrentWord(false);
    generateOptions(shuffledWords[0], shuffledWords);
  };

  const handleShowHint = () => {
    if (hintCount > 0 && !hintUsedForCurrentWord) {
      setShowHint(true);
      setHintCount(hintCount - 1);
      setHintUsedForCurrentWord(true);
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
      className="flex flex-col items-center justify-center p-6 mt-7 max-w-full"
      style={{ backgroundColor: "var(--arkaPlan)", color: "var(--yaziRengi)" }}
    >
      <div className="w-full flex  flex-col max-w-2xl shadow-lg rounded-lg p-6 mb-6 bg-[--arkaPlan] text-[--yaziRengi]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          İngilizce - Türkçe Kelime Eşleştirme
        </h1>

        {/* Oyun Kuralları */}
        <div className="text-sm mb-4 p-4 bg-blue-50 text-blue-900 rounded-lg">
          <h2 className="font-semibold mb-2">Oyun Kuralları:</h2>
          <ul className="list-disc ml-4">
            <li>Her doğru eşleştirme 1 puan kazandırır.</li>
            <li>Yanlış cevap verirseniz, maksimum puanınız 20 puan azalır.</li>
            <li>
              5 kez yanlış cevap verme hakkınız var, maksimum puan
              sıfırlandığında oyun sonlanır.
            </li>
            <li>
              İpucu butonunu kullanarak kelimeye ait resmi görebilirsiniz.
            </li>
            <li>
              Tüm kelimelere ait ipucu resmi eklenmedi, vaktim olduğunda
              ekleyeceğim.
            </li>
          </ul>
        </div>

        <div className="text-lg font-semibold text-center mb-4 border border-red-400 rounded-sm w-[400px] self-center">
          Maksimum Puan: <b className="text-red-500">{maxScore}</b> - Şu Anki
          Puan: <b className="text-red-500">{score}</b>
          <div>
            Kalan Kelimeler: {words.length - currentIndex} - İpucu Hakkı:{" "}
            {hintCount}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">İngilizce Kelime</h2>
            <div className="p-4 border rounded-lg text-center font-medium bg-blue-100 text-blue-800">
              {words[currentIndex]?.english}
            </div>
            {showHint && (
              <div className="mt-4 text-center">
                {words[currentIndex]?.imageUrl ? (
                  <Image
                    src={words[currentIndex].imageUrl}
                    alt="Kelime İpucu"
                    width={200}
                    height={200}
                    className="rounded-lg mx-auto"
                  />
                ) : (
                  <p className="text-red-500 font-semibold">Resim Yok</p>
                )}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Türkçe Anlamı</h2>
            <ul className="grid gap-2">
              {options.map((turkishWord, index) => (
                <li
                  key={index}
                  onClick={() =>
                    !isMatchDisabled && setSelectedTurkish(turkishWord)
                  }
                  className={`cursor-pointer p-3 border rounded-lg text-center font-medium ${
                    selectedTurkish === turkishWord
                      ? "bg-gray-200"
                      : !isMatchDisabled
                      ? "bg-yellow-100 text-yellow-800"
                      : words[currentIndex].turkish.includes(turkishWord)
                      ? "bg-green-200 text-green-800"
                      : ""
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
          disabled={isMatchDisabled}
          className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
            isMatchDisabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          Eşleştir
        </button>

        {isMatchDisabled && (
          <div className="flex space-x-4">
            <button
              onClick={resetGame}
              className="w-1/2 py-3 rounded-lg font-semibold transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              Sıfırla ve Yeniden Başla
            </button>
            <button
              onClick={continueGame}
              className="w-1/2 py-3 rounded-lg font-semibold transition-colors bg-orange-500 text-white hover:bg-orange-600"
            >
              Devam Et
            </button>
          </div>
        )}

        <button
          onClick={handleShowHint}
          disabled={hintCount === 0 || hintUsedForCurrentWord}
          className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
            hintCount === 0 || hintUsedForCurrentWord
              ? "bg-gray-400 text-white cursor-not-allowed mt-3"
              : "bg-orange-500 text-white hover:bg-orange-600 mt-3"
          }`}
        >
          İpucu Göster
        </button>

        {resultMessage && (
          <p
            className="text-lg font-semibold text-center"
            style={{
              color: resultMessage.includes("Doğru")
                ? "var(--successColor)"
                : "var(--errorColor)",
            }}
          >
            {resultMessage}
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl mt-8 p-4 border rounded-lg bg-[--arkaPlan] overflow-y-auto h-48">
        <h2 className="text-xl font-bold mb-4 text-[yaziRengi]">
          Doğru Bilinen Kelimeler
        </h2>
        <div className="flex flex-wrap gap-2">
          {correctWords.map((word, index) => (
            <div
              key={index}
              className="p-2 bg-green-200 text-green-800 rounded-lg shadow"
            >
              <span className="font-semibold">{word.english}</span>:{" "}
              {word.turkish.join(", ")}
            </div>
          ))}
        </div>
      </div>

      {incorrectWords.length > 0 && (
        <div className="w-full max-w-2xl mt-8 p-4 border rounded-lg bg-[--arkaPlan] overflow-y-auto h-48">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Yanlış Eşleştirilen Kelimeler
          </h2>
          <div className="flex flex-wrap gap-2">
            {incorrectWords.map((word, index) => (
              <div
                key={index}
                className="p-2 bg-red-200 text-red-800 rounded-lg shadow"
              >
                <span className="font-semibold">{word.english}</span>:{" "}
                {word.turkish.join(", ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
