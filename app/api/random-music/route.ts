import { NextResponse } from 'next/server';
import { getRandom90sPopQuiz } from '@/app/utils/music';

export async function GET() {
  try {
    const quiz = await getRandom90sPopQuiz();
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 