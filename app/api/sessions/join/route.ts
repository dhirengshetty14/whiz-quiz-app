
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, sessionCode } = await request.json();

    if (!name || !sessionCode) {
      return NextResponse.json(
        { message: 'Name and session code are required' },
        { status: 400 }
      );
    }

    // Find the session
    const session = await prisma.quizSession.findUnique({
      where: { code: sessionCode.toUpperCase() },
      include: { participants: true },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Quiz session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Quiz has already started' },
        { status: 400 }
      );
    }

    // Check if name is already taken
    const existingParticipant = session.participants.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingParticipant) {
      return NextResponse.json(
        { message: 'Name already taken in this session' },
        { status: 400 }
      );
    }

    // Add participant to session
    const participant = await prisma.participant.create({
      data: {
        name,
        sessionId: session.id,
      },
    });

    return NextResponse.json({ 
      participantId: participant.id,
      sessionCode: session.code 
    });
  } catch (error) {
    console.error('Error joining session:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
