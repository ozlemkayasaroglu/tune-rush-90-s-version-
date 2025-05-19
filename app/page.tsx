'use client';

import { GameProvider } from './context/GameContext';
import GameSetup from './components/GameSetup';
import GameRoom from './components/GameRoom';

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 py-12">
        <div className="container mx-auto px-4">
          <GameSetup />
          <GameRoom />
        </div>
      </main>
    </GameProvider>
  );
}
