
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const session = await prisma.quizSession.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        participants: {
          orderBy: { joinedAt: 'asc' },
        },
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
