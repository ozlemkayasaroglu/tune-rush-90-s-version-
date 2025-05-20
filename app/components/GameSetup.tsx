import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';

const AVATARS = [
  '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍💻', '👩‍💻',
  '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧛‍♂️', '🧛‍♀️',
  '🧜‍♂️', '🧜‍♀️', '🧚‍♂️', '🧚‍♀️', '🤴', '👸',
  '👨‍🚀', '👩‍🚀', '👨‍✈️', '👩‍✈️', '👨‍🔬', '👩‍🔬'
];

export default function GameSetup() {
  const { gameStatus, setPlayers, startGame } = useGame();
  const [players, setLocalPlayers] = useState([
    { name: 'Player 1', avatar: AVATARS[0] }
  ]);
  const [error, setError] = useState('');
  const [prize, setPrize] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (players.some(player => !player.name)) {
      setError('Lütfen tüm oyuncuların isimlerini girin');
      return;
    }

    if (!prize.trim()) {
      setError('Lütfen kazanan için bir ödül belirleyin');
      return;
    }

    setPlayers(
      players.map(player => ({
        id: uuidv4(),
        name: player.name,
        profileImage: player.avatar,
        score: 0,
        isReady: true
      }))
    );

    startGame(prize.trim());
  };

  const addNewPlayer = () => {
    if (players.length >= 4) {
      setError('En fazla 4 oyuncu ekleyebilirsiniz');
      return;
    }
    setLocalPlayers([...players, { name: `Player ${players.length + 1}`, avatar: AVATARS[players.length] }]);
    setError('');
  };

  const removePlayer = (index: number) => {
    if (players.length <= 1) {
      setError('En az 1 oyuncu olmalıdır');
      return;
    }
    setLocalPlayers(players.filter((_, i) => i !== index));
    setError('');
  };

  const updatePlayer = (index: number, field: 'name' | 'avatar', value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setLocalPlayers(newPlayers);
  };

  if (gameStatus !== 'setup') return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 border border-white/40">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 to-slate-200/20 z-0"></div>
          <div className="relative z-10">
            <header className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
                90'lar <span className="text-emerald-600">Türkçe Pop</span> Quiz
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Nostaljik şarkıları hatırla, puanları topla
              </p>
            </header>

            <div className="max-w-md mx-auto">
              <div className="p-6 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Oyuncu Ayarları</h2>
                <div className="space-y-4">
                  {players.map((player, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="text-2xl" style={{ fontSize: '40px' }}>{player.avatar}</div>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removePlayer(index)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {players.length < 4 && (
                  <button
                    onClick={addNewPlayer}
                    className="w-full mt-4 px-4 py-2 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Yeni Oyuncu Ekle</span>
                  </button>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kazananın Ödülü
                  </label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="Örn: Akşam yemeği, Sinema bileti, vb."
                    className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center mt-4">{error}</div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Oyuna Başla
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Developed with ❤️ by mommytsx using Cursor</p>
          <p className="mt-1">Special thanks to <a href="https://x.com/i/communities/1921199300429705621" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">#zenCoders</a> & <a href="https://github.com/AtaKNY/tune-rush" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">@AtaKNY</a> for the inspiration</p>
        </div>
      </div>
    </div>
  );
} 