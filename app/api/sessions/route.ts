
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateSessionCode } from '@/lib/utils';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { hostName, topic } = await request.json();

    if (!hostName || !topic) {
      return NextResponse.json(
        { message: 'Host name and topic are required' },
        { status: 400 }
      );
    }

    // Generate unique session code
    let sessionCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      sessionCode = generateSessionCode();
      const existing = await prisma.quizSession.findUnique({
        where: { code: sessionCode },
      });
      
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { message: 'Failed to generate unique session code' },
        { status: 500 }
      );
    }

    // Create quiz session
    const session = await prisma.quizSession.create({
      data: {
        code: sessionCode!,
        topic,
        hostName,
        status: 'waiting',
      },
      include: {
        participants: true,
        questions: true,
      },
    });

    // Generate questions using LLM
    try {
      const questionsResponse = await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/generate-questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, sessionId: session.id }),
        }
      );

      if (!questionsResponse.ok) {
        console.error('Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
