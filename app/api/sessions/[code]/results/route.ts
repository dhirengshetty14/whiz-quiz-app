
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
          orderBy: { score: 'desc' },
          include: {
            answers: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Mark session as completed if not already
    if (session.status !== 'completed') {
      await prisma.quizSession.update({
        where: { id: session.id },
        data: { status: 'completed' },
      });
    }

    return NextResponse.json({
      session: {
        id: session.id,
        code: session.code,
        topic: session.topic,
        hostName: session.hostName,
      },
      participants: session.participants,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
