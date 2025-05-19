import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { GameRoom, Player } from '@/app/types/game';

// In-memory storage for game rooms
const gameRooms = new Map<string, GameRoom>();

export async function POST(request: Request) {
  try {
    const { playerName } = await request.json();
    
    // Create new player
    const player: Player = {
      id: uuidv4(),
      name: playerName,
      score: 0,
      isReady: false
    };

    // Create new game room
    const room: GameRoom = {
      id: uuidv4(),
      players: [player],
      currentRound: 0,
      maxRounds: 10,
      status: 'waiting',
      scores: {}
    };

    gameRooms.set(room.id, room);

    return NextResponse.json({ room, player });
  } catch (error) {
    return NextResponse.json(
      { error: 'Oda oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json(
      { error: 'Oda ID\'si gerekli' },
      { status: 400 }
    );
  }

  const room = gameRooms.get(roomId);
  if (!room) {
    return NextResponse.json(
      { error: 'Oda bulunamadı' },
      { status: 404 }
    );
  }

  return NextResponse.json({ room });
} 