import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@/app/types/game';

// In-memory storage for game rooms (import from parent route)
declare const gameRooms: Map<string, any>;

export async function POST(request: Request) {
  try {
    const { roomId, playerName } = await request.json();

    const room = gameRooms.get(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Oda bulunamadı' },
        { status: 404 }
      );
    }

    if (room.players.length >= 3) {
      return NextResponse.json(
        { error: 'Oda dolu' },
        { status: 400 }
      );
    }

    const player: Player = {
      id: uuidv4(),
      name: playerName,
      score: 0,
      isReady: false
    };

    room.players.push(player);
    gameRooms.set(roomId, room);

    return NextResponse.json({ room, player });
  } catch (error) {
    return NextResponse.json(
      { error: 'Odaya katılınamadı' },
      { status: 500 }
    );
  }
} 