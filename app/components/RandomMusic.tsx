"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  title: string;
  thumbnail: string;
  preview: string;
  artist: string;
  album: string;
}

interface QuizQuestion {
  correctTrack: Track;
  options: {
    title: string;
    artist: string;
  }[];
  correctIndex: number;
}

const MAX_QUESTIONS = 30; // Maksimum soru sayısı

export default function RandomMusic() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isActive, setIsActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [skipCount, setSkipCount] = useState(3); // Pas hakkı sayısı
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null); // Yeni timer ref
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Ses çalma durumunu kontrol et
    const checkAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          audioRef.current.pause();
          setAudioEnabled(true);
          setShowAudioPrompt(false);
        } catch (error) {
          setAudioEnabled(false);
          setShowAudioPrompt(true);
        }
      }
    };
    checkAudio();
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(15);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [isActive, timeLeft]);

  const handleTimeUp = () => {
    if (selectedAnswer === null && question) {
      handleAnswer(-1);
    }
  };

  const resetGame = () => {
    if (loading) return;

    setScore(0);
    setTotalQuestions(0);
    setGameEnded(false);
    setSelectedAnswer(null);
    setQuestion(null);
    setSkipCount(3); // Pas hakkını sıfırla
    getRandomMusic();
  };

  const startGame = () => {
    setGameStarted(true);
    getRandomMusic();
  };

  const toggleSound = async () => {
    if (audioRef.current) {
      if (isMuted) {
        try {
          audioRef.current.muted = false;
          if (question) {
            audioRef.current.src = question.correctTrack.preview;
            await audioRef.current.play();
          }
          setIsMuted(false);
        } catch (error) {
          console.error("Ses açma hatası:", error);
        }
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const getRandomMusic = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setQuestion(null);
    setSelectedAnswer(null);
    stopTimer();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const response = await fetch("/api/random-music");
      if (!response.ok) throw new Error("Bir hata oluştu");
      const data = await response.json();

      setQuestion(data);

      if (audioRef.current) {
        audioRef.current.src = data.correctTrack.preview;
        if (!isMuted) {
          await audioRef.current.play().catch((error) => {
            console.error("Ses çalma hatası:", error);
            setError("Ses çalınamadı. Lütfen tekrar deneyin.");
          });
        }
        startTimer();
      } else {
        startTimer();
      }
    } catch (err) {
      setError("Müzik yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !question || loading) return;

    stopTimer();
    setSelectedAnswer(index);

    const newTotal = totalQuestions + 1;
    setTotalQuestions(newTotal);

    if (index === question.correctIndex) {
      setScore((prev) => prev + 1);
    }

    if (newTotal >= MAX_QUESTIONS) {
      setGameEnded(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Önceki timer'ı temizle
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
      }
      // Yeni timer'ı ayarla
      nextQuestionTimerRef.current = setTimeout(() => {
        getRandomMusic();
      }, 1500);
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSkip = () => {
    if (skipCount > 0 && !loading && selectedAnswer === null) {
      setSkipCount((prev) => prev - 1);
      const newTotal = totalQuestions + 1;
      setTotalQuestions(newTotal);

      if (newTotal >= MAX_QUESTIONS) {
        setGameEnded(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        getRandomMusic();
      }
    }
  };

  if (gameEnded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black text-white flex items-center justify-center p-4"
      >
        <div className="max-w-4xl w-full">
          <motion.div
            className="bg-gray-900 rounded-2xl p-8 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text text-center"
            >
              Oyun Bitti! 🎉
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-4xl font-bold text-center md:text-left">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                    {score}/{MAX_QUESTIONS}
                  </span>
                </div>

                <div className="text-xl text-gray-400">
                  {score === MAX_QUESTIONS ? (
                    <div className="space-y-2">
                      <p>🏆 Mükemmel!</p>
                      <p>Tüm şarkıları bildin!</p>
                    </div>
                  ) : score >= MAX_QUESTIONS * 0.8 ? (
                    <div className="space-y-2">
                      <p>🎯 Harika!</p>
                      <p>Neredeyse hepsini bildin!</p>
                    </div>
                  ) : score >= MAX_QUESTIONS * 0.6 ? (
                    <div className="space-y-2">
                      <p>👏 Güzel!</p>
                      <p>Biraz daha pratik yapmalısın.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>💪 Daha İyisini Yapabilirsin!</p>
                      <p>Türkçe rap dünyasını keşfetme zamanı!</p>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                >
                  Tekrar Oyna 🎮
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl">🎧</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!gameStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black text-white flex items-center justify-center p-4"
      >
        <div className="max-w-4xl w-full text-center">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            90's Türkçe Pop
          </motion.h1>

          <motion.p
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-gray-400 mb-8 text-lg"
          >
            {MAX_QUESTIONS} soruda kendini göster! 🎵
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameStarted(true);
              getRandomMusic();
            }}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
          >
            Başla 🎧
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-8"
    >
      <audio ref={audioRef} loop muted={isMuted} />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              {score}/{totalQuestions}
            </span>
            <span className="text-sm text-gray-400 ml-2">
              (Kalan: {MAX_QUESTIONS - totalQuestions})
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-200"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="text-xl font-mono"
            >
              {timeLeft}s
            </motion.div>
          </div>
        </div>

        <motion.div
          className="w-full bg-gray-800 h-2 rounded-full mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            animate={{
              width: `${(timeLeft / 15) * 100}%`,
              transition: { duration: 0.5 },
            }}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {question && (
            <motion.div
              key={question.correctTrack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Sağ Taraf - Kapak Resmi */}
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={question.correctTrack.thumbnail}
                    alt="Şarkı Kapağı"
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      selectedAnswer === null ? "blur-xl" : "blur-none"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Blur üzerinde gösterilecek içerik */}
                  {selectedAnswer === null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="text-center p-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-6xl mb-4"
                        >
                          🎵
                        </motion.div>
                        <p className="text-xl font-bold text-white">
                          Şarkıyı Tahmin Et!
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Doğru cevap animasyonu */}
                  {selectedAnswer === question.correctIndex && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-green-500/20"
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl"
                      >
                        🎯
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Yanlış cevap animasyonu */}
                  {selectedAnswer !== null &&
                    selectedAnswer !== question.correctIndex && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-red-500/20"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="text-6xl"
                        >
                          ❌
                        </motion.div>
                      </motion.div>
                    )}
                </div>
              </motion.div>

              {/* Sol Taraf - Şıklar */}
              <motion.div className="space-y-4">
                <motion.h2
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
                >
                  Bu parça hangi şarkı? 🎵
                </motion.h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        transition: { delay: index * 0.1 },
                      }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all duration-200
                        ${
                          selectedAnswer === null
                            ? "bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-purple-500"
                            : index === question.correctIndex
                            ? "bg-green-500/20 border-2 border-green-500"
                            : index === selectedAnswer
                            ? "bg-red-500/20 border-2 border-red-500"
                            : "bg-gray-800 opacity-50"
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div>
                          <div className="font-semibold">{option.title}</div>
                          <div className="text-sm text-gray-400">
                            {option.artist}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    {selectedAnswer === question.correctIndex ? (
                      <div className="text-green-500 font-bold text-xl">
                        Doğru! 🎯
                      </div>
                    ) : selectedAnswer === -1 ? (
                      <div className="text-red-500 font-bold">
                        Süre Doldu! Doğru cevap: {question.correctTrack.title} -{" "}
                        {question.correctTrack.artist}
                      </div>
                    ) : (
                      <div className="text-red-500 font-bold">
                        Yanlış! Doğru cevap: {question.correctTrack.title} -{" "}
                        {question.correctTrack.artist}
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSkip}
                    disabled={
                      skipCount === 0 || loading || selectedAnswer !== null
                    }
                    className="bg-gray-800 w-full hover:bg-gray-700 text-start border-2 border-transparent hover:border-purple-500 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div>
                        <div className="font-semibold">
                          Pas ({skipCount} / 3)
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
