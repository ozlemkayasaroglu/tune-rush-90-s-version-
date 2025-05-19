import { NextResponse } from 'next/server';
import { getRandom90sPopQuiz } from '@/app/utils/music';

// In-memory storage for game rooms (import from parent route)
declare const gameRooms: Map<string, any>;

export async function POST(request: Request) {
  try {
    const { roomId, playerId } = await request.json();

    const room = gameRooms.get(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Oda bulunamadı' },
        { status: 404 }
      );
    }

    const player = room.players.find((p: any) => p.id === playerId);
    if (!player) {
      return NextResponse.json(
        { error: 'Oyuncu bulunamadı' },
        { status: 404 }
      );
    }

    player.isReady = true;

    // Check if all players are ready
    const allReady = room.players.every((p: any) => p.isReady);
    if (allReady && room.players.length === 3) {
      room.status = 'playing';
      room.currentRound = 1;
      room.currentQuestion = await getRandom90sPopQuiz();
    }

    gameRooms.set(roomId, room);

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: 'Hazır durumu güncellenemedi' },
      { status: 500 }
    );
  }
} 