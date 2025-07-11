
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export async function POST(request: NextRequest) {
  try {
    const { topic, sessionId } = await request.json();

    if (!topic || !sessionId) {
      return NextResponse.json(
        { message: 'Topic and session ID are required' },
        { status: 400 }
      );
    }

    // Generate questions using LLM API
    const questions = await generateQuestionsWithLLM(topic);

    // Save questions to database
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      await prisma.question.create({
        data: {
          sessionId,
          questionText: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          questionNumber: i + 1,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      questionsGenerated: questions.length 
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { message: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

async function generateQuestionsWithLLM(topic: string): Promise<QuizQuestion[]> {
  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are a quiz question generator. Generate exactly 8 multiple-choice questions about ${topic}. Each question should have exactly 4 options (A, B, C, D) with only one correct answer. Make the questions engaging and appropriately challenging. Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`
          },
          {
            role: 'user',
            content: `Generate 8 quiz questions about ${topic}. Format the response as a JSON array where each question object has:
- "question": the question text
- "options": array of 4 answer choices
- "correctAnswer": index (0-3) of the correct option

Example format:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": 2
  }
]`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from LLM API');
    }

    // Clean up the response - remove code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Remove trailing commas in objects and arrays
    content = content.replace(/,(\s*[}\]])/g, '$1');

    let questions;
    try {
      const parsed = JSON.parse(content);
      // Handle both array format and object with questions array
      questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
    } catch (parseError) {
      console.error('Failed to parse LLM response:', content);
      throw new Error('Invalid JSON response from LLM');
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions generated');
    }

    // Ensure we have exactly 8 questions and validate format
    const validQuestions = questions.slice(0, 8).filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 && 
      q.correctAnswer < 4
    );

    if (validQuestions.length < 8) {
      // Fill with fallback questions if needed
      const fallbackQuestions = getFallbackQuestions(topic);
      while (validQuestions.length < 8 && fallbackQuestions.length > 0) {
        validQuestions.push(fallbackQuestions.pop()!);
      }
    }

    return validQuestions.slice(0, 8);
  } catch (error) {
    console.error('Error generating questions with LLM:', error);
    // Return fallback questions
    return getFallbackQuestions(topic);
  }
}

function getFallbackQuestions(topic: string): QuizQuestion[] {
  const fallbackQuestions: Record<string, QuizQuestion[]> = {
    'Sports': [
      {
        question: "Which sport is known as 'the beautiful game'?",
        options: ["Basketball", "Soccer", "Tennis", "Baseball"],
        correctAnswer: 1
      },
      {
        question: "How many players are on a basketball team during play?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1
      },
      {
        question: "In which sport would you perform a slam dunk?",
        options: ["Tennis", "Soccer", "Basketball", "Golf"],
        correctAnswer: 2
      },
      {
        question: "What is the maximum score possible in ten-pin bowling?",
        options: ["200", "250", "300", "350"],
        correctAnswer: 2
      },
      {
        question: "Which sport uses a shuttlecock?",
        options: ["Tennis", "Badminton", "Squash", "Table Tennis"],
        correctAnswer: 1
      },
      {
        question: "How many holes are there in a standard round of golf?",
        options: ["16", "18", "20", "22"],
        correctAnswer: 1
      },
      {
        question: "In which sport might you hear the term 'love'?",
        options: ["Basketball", "Soccer", "Tennis", "Golf"],
        correctAnswer: 2
      },
      {
        question: "What is the length of an Olympic swimming pool?",
        options: ["25 meters", "50 meters", "75 meters", "100 meters"],
        correctAnswer: 1
      }
    ],
    'Science': [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2
      },
      {
        question: "How many bones are in the adult human body?",
        options: ["186", "206", "226", "246"],
        correctAnswer: 1
      },
      {
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2
      },
      {
        question: "What gas makes up about 78% of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 2
      },
      {
        question: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correctAnswer: 0
      },
      {
        question: "Which organ in the human body produces insulin?",
        options: ["Liver", "Kidney", "Pancreas", "Heart"],
        correctAnswer: 2
      },
      {
        question: "What is the smallest unit of matter?",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        correctAnswer: 1
      },
      {
        question: "What type of animal is a whale?",
        options: ["Fish", "Amphibian", "Reptile", "Mammal"],
        correctAnswer: 3
      }
    ]
  };

  // Add more fallback questions for other topics
  const defaultQuestions: QuizQuestion[] = [
    {
      question: `What is a key characteristic of ${topic}?`,
      options: ["It's important", "It's popular", "It's interesting", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `Which of these is related to ${topic}?`,
      options: ["History", "Culture", "Knowledge", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `What makes ${topic} interesting to study?`,
      options: ["Complexity", "Variety", "Impact", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `How would you describe ${topic}?`,
      options: ["Fascinating", "Educational", "Engaging", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `What can you learn from ${topic}?`,
      options: ["Facts", "Skills", "Perspectives", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `Why is ${topic} relevant today?`,
      options: ["Historical significance", "Current applications", "Future importance", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `What aspect of ${topic} is most important?`,
      options: ["Understanding", "Application", "Appreciation", "All of the above"],
      correctAnswer: 3
    },
    {
      question: `How does ${topic} impact society?`,
      options: ["Culturally", "Economically", "Socially", "All of the above"],
      correctAnswer: 3
    }
  ];

  return fallbackQuestions[topic] || defaultQuestions;
}
