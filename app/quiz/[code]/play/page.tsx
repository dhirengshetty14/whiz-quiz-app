
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizQuestion } from '@/components/quiz-question';
import { QuizTimer } from '@/components/quiz-timer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/types';
import { Trophy, Target, Zap, Brain } from 'lucide-react';

export default function QuizPlay() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = params.code as string;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionCode) return;
    fetchQuestions();
  }, [sessionCode]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionCode}/questions`);
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load quiz questions');
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Submit answer to backend
    try {
      const participantId = localStorage.getItem(`participant_${sessionCode}`);
      if (!participantId) return;

      await fetch(`/api/sessions/${sessionCode}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          questionId: currentQuestion.id,
          selectedAnswer: answerIndex,
        }),
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer === undefined) {
      // Auto-submit with no answer
      handleAnswerSelect(-1);
    }
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(undefined);
      setShowResults(false);
    } else {
      // Quiz completed, go to results
      router.push(`/quiz/${sessionCode}/results`);
    }
  };

  useEffect(() => {
    if (showResults) {
      const timer = setTimeout(handleNextQuestion, 3000);
      return () => clearTimeout(timer);
    }
  }, [showResults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-whiz p-6 rounded-2xl shadow-xl mb-6 animate-bounce-gentle">
            <Brain className="h-12 w-12 text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz Questions...</h2>
          <p className="text-gray-600">Get ready to test your knowledge! 🧠</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md card-whiz">
          <CardContent className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-red-600 mb-6">{error || 'No questions available'}</p>
            <button
              onClick={() => router.push(`/quiz/${sessionCode}`)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Lobby
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-in">
          {/* Quiz Info */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-gradient-whiz p-3 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhizQuiz</h1>
              <Badge variant="secondary" className="font-mono text-sm">
                {sessionCode}
              </Badge>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Question</div>
              <div className="text-2xl font-bold text-gray-900">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
            <QuizTimer
              duration={15}
              onTimeUp={handleTimeUp}
              isActive={!showResults}
              key={currentQuestionIndex} // Reset timer for each question
            />
          </div>
        </div>

        {/* Question Component */}
        <QuizQuestion
          question={currentQuestion.questionText}
          options={currentQuestion.options}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
          correctAnswer={showResults ? currentQuestion.correctAnswer : undefined}
          showResults={showResults}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Progress Section */}
        <div className="mt-8 animate-fade-in">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900">Quiz Progress</span>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-whiz h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>
                  {showResults ? '✅ Answered' : '⏳ In Progress'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Question Countdown */}
        {showResults && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 inline-block border border-white/30">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">
                  {currentQuestionIndex < questions.length - 1 
                    ? 'Next question in 3 seconds...' 
                    : 'Going to results in 3 seconds...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
