export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface GameRoom {
  id: string;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  status: 'waiting' | 'playing' | 'finished';
  currentQuestion?: QuizQuestion;
  scores: Record<string, number>;
}

export interface QuizQuestion {
  correctTrack: {
    id: string;
    title: string;
    thumbnail: string;
    preview: string;
    artist: string;
    album: string;
  };
  options: {
    title: string;
    artist: string;
  }[];
  correctIndex: number;
}

export interface GameState {
  room: GameRoom;
  currentPlayer: Player;
  timeLeft: number;
} 