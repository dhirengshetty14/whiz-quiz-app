
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const { participantId, questionId, selectedAnswer } = await request.json();

    if (!participantId || !questionId || selectedAnswer === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the question to check correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    const isCorrect = selectedAnswer >= 0 && selectedAnswer === question.correctAnswer;
    const points = isCorrect ? 10 : 0;

    // Record the answer
    const answer = await prisma.answer.create({
      data: {
        participantId,
        questionId,
        selectedAnswer: selectedAnswer >= 0 ? selectedAnswer : null,
        isCorrect,
      },
    });

    // Update participant score
    if (isCorrect) {
      await prisma.participant.update({
        where: { id: participantId },
        data: {
          score: {
            increment: points,
          },
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      isCorrect, 
      points,
      correctAnswer: question.correctAnswer 
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
