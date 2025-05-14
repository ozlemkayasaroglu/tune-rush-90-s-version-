import { NextResponse } from 'next/server';
import { getRandomTurkishMusic } from '@/app/utils/music';

export async function GET() {
  try {
    const track = await getRandomTurkishMusic();
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 