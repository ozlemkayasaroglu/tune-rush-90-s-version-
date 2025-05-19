export interface Player {
  id: string;
  name: string;
  profileImage: string;
  score: number;
  isReady: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  preview: string | null;
  thumbnail: string;
  album: string;
  release_date: string;
  album_cover: string;
}

export interface QuizQuestion {
  correctTrack: Track;
  options: Track[];
}

export interface GameRoom {
  id: string;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  status: GameStatus;
  prize: string;
}

export type GameStatus = 'setup' | 'waiting' | 'playing' | 'finished';

export interface GameHistoryItem {
  round: number;
  playerId: string;
  playerName: string;
  question: QuizQuestion;
  answer: string;
  isCorrect: boolean;
}

export type GameHistory = GameHistoryItem[];

export interface GameState {
  room: GameRoom;
  currentPlayer: Player;
  timeLeft: number;
} 