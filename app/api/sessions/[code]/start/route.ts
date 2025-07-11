
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const session = await prisma.quizSession.findUnique({
      where: { code: code.toUpperCase() },
      include: { participants: true },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Quiz has already started' },
        { status: 400 }
      );
    }

    // Update session status to active
    const updatedSession = await prisma.quizSession.update({
      where: { id: session.id },
      data: { status: 'active' },
      include: {
        participants: true,
        questions: true,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error starting quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
