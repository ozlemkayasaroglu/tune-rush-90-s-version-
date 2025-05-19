import React, { createContext, useContext, useState, ReactNode } from "react";
import { Player, QuizQuestion, GameHistory, GameHistoryItem, GameStatus, Track } from "../types/game";
import { getRandom90sPopQuiz } from "../utils/music";

interface GameContextType {
  gameStatus: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  currentQuestion: QuizQuestion | null;
  history: GameHistory;
  round: number;
  prize: string;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  startGame: (prize: string) => void;
  submitAnswer: (answer: Track) => void;
  resetGame: () => void;
  setCurrentQuestion: (question: QuizQuestion | null) => void;
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [history, setHistory] = useState<GameHistory>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [prize, setPrize] = useState("");

  const getNewQuestion = async () => {
    let question = await getRandom90sPopQuiz();
    let attempts = 0;
    const maxAttempts = 10; // Maksimum deneme sayısı

    // Soru daha önce sorulmuşsa yeni soru al
    while (usedQuestions.has(question.correctTrack.id) && attempts < maxAttempts) {
      question = await getRandom90sPopQuiz();
      attempts++;
    }

    // Yeni soruyu kullanılan sorular listesine ekle
    setUsedQuestions(prev => new Set([...prev, question.correctTrack.id]));
    return question;
  };

  const startGame = async (prize: string) => {
    setGameStatus("playing");
    setCurrentPlayerIndex(0);
    setRound(1);
    setHistory([]);
    setUsedQuestions(new Set()); // Soru havuzunu sıfırla
    setPrize(prize);
    const question = await getNewQuestion();
    setCurrentQuestion(question);
  };

  const submitAnswer = async (answer: Track) => {
    if (!currentQuestion) return;

    const isCorrect = answer.id === currentQuestion.correctTrack.id;
    const currentPlayer = players[currentPlayerIndex];

    const historyItem: GameHistoryItem = {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      question: currentQuestion,
      answer: answer.id,
      isCorrect,
      round,
    };

    setHistory((prev) => [historyItem, ...prev]);

    if (isCorrect) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === currentPlayer.id
            ? { ...player, score: player.score + 1 }
            : player
        )
      );
      setScore(prev => prev + 1);
    }

    // Sıradaki oyuncuya geç
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    // Eğer tüm oyuncular sorularını cevapladıysa
    if (nextPlayerIndex === 0) {
      setRound((prev) => prev + 1);
      
      // Oyun bitti mi kontrol et
      if (round >= 20) {
        setGameStatus('finished');
        return;
      }
    }

    // Yeni soru getir
    const question = await getNewQuestion();
    setCurrentQuestion(question);
  };

  const resetGame = () => {
    setGameStatus("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentQuestion(null);
    setHistory([]);
    setRound(1);
    setScore(0);
    setUsedQuestions(new Set());
    setPrize("");
  };

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        players,
        currentPlayerIndex,
        currentQuestion,
        history,
        round,
        prize,
        setPlayers,
        startGame,
        submitAnswer,
        resetGame,
        setCurrentQuestion,
        score,
        setScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 