import { useGame } from '../context/GameContext';
import { useEffect, useRef, useState } from 'react';
import { Track } from '../types/game';

export default function GameRoom() {
  const {
    gameStatus,
    players,
    currentPlayerIndex,
    currentQuestion,
    round,
    submitAnswer,
    setCurrentQuestion,
    setScore,
    score,
  } = useGame();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Track | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentQuestion && gameStatus === 'playing') {
      // Yeni soru geldiğinde state'i sıfırla
      setShowResult(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setTimeLeft(15);
      
      // Müziği başlat
      if (audioRef.current && currentQuestion.correctTrack.preview) {
        audioRef.current.src = currentQuestion.correctTrack.preview;
        audioRef.current.load(); // Önce load() çağır
        
        // Ses yükleme hatası kontrolü
        audioRef.current.onerror = () => {
          console.error('Ses yüklenemedi:', currentQuestion.correctTrack.preview);
          setIsPlaying(false);
        };

        // Ses yüklendiğinde çal
        audioRef.current.oncanplaythrough = () => {
          audioRef.current?.play().catch(error => {
            console.error('Ses çalma hatası:', error);
            setIsPlaying(false);
          });
          setIsPlaying(true);
        };
      } else {
        console.warn('Preview URL bulunamadı');
        setIsPlaying(false);
      }
    }
  }, [currentQuestion, gameStatus]);

  useEffect(() => {
    // Component mount olduğunda audio elementi oluştur
    audioRef.current = new Audio();
    
    // Component unmount olduğunda audio elementini temizle
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Geri sayım için useEffect
  useEffect(() => {
    if (gameStatus === 'playing' && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Süre bittiğinde otomatik olarak yanlış cevap ver
            handleAnswer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus, showResult, timeLeft]);

  const handleAnswer = (selectedTrack: Track | null) => {
    if (selectedAnswer !== null) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setSelectedAnswer(selectedTrack);
    const isCorrect = selectedTrack?.id === currentQuestion?.correctTrack.id;
    setIsCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // 2 saniye sonra bir sonraki soruya geç
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      if (selectedTrack) {
        submitAnswer(selectedTrack);
      }
    }, 2000);
  };

  if (gameStatus === 'setup') return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 border border-white/40">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 to-slate-200/20 z-0"></div>
          <div className="relative z-10">
            {gameStatus === 'playing' && currentQuestion && (
              <>
                <header className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
                    Tur <span className="text-emerald-600">{round}</span>
                  </h1>
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center space-x-2 ${
                          index === currentPlayerIndex ? 'text-emerald-600' : 'text-slate-600'
                        }`}
                      >
                        <div className="text-2xl">{player.profileImage}</div>
                        <span className="text-sm font-medium">{player.name}</span>
                        {index === currentPlayerIndex && (
                          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                            Sıra Sizde
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </header>

                <div className="max-w-2xl mx-auto">
                  <div className="p-6 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 mb-8">
                    {/* Progress Bar */}
                    {!showResult && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-600">Tahmin Süresi</span>
                          <span className="text-sm font-medium text-slate-600">{timeLeft} saniye</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(timeLeft / 15) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isCorrect ? 'bg-transparent' : 'bg-black/20 backdrop-blur-xl'
                      }`}></div>
                      <img
                        src={currentQuestion.correctTrack.thumbnail}
                        alt="Şarkı kapağı"
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isCorrect ? 'blur-none scale-100' : 'blur-md scale-105'
                        }`}
                      />
                      {isPlaying && !showResult && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-600/80 flex items-center justify-center animate-pulse">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-white"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      )}
                      {showResult && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                          } animate-bounce`}>
                            <span className="text-4xl">
                              {isCorrect ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(option)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 mb-2 rounded-lg text-left transition-colors ${
                            selectedAnswer === option
                              ? option === currentQuestion.correctTrack
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-gray-500">
                            {option.title} - {option.artist}
                          </div>
                          <div className="text-sm font-medium text-gray-700 mt-1">
                            {option.album} • {option.release_date?.slice(0, 4) || 'Bilinmiyor'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {gameStatus === 'finished' && (
              <>
                <header className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
                    Oyun <span className="text-emerald-600">Bitti!</span>
                  </h1>
                  <p className="text-slate-600 text-sm md:text-base">
                    İşte sonuçlar
                  </p>
                </header>

                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {players
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className={`p-6 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 ${
                            index === 0 ? 'ring-2 ring-emerald-400' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{player.profileImage}</div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{player.name}</h3>
                              <p className="text-lg font-bold text-emerald-600">
                                {player.score} puan
                              </p>
                              {index === 0 && (
                                <p className="text-emerald-600 text-sm mt-1">
                                  Kazanan! 🎉
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 