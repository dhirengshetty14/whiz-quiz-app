
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  options: string[];
  onAnswerSelect: (answerIndex: number) => void;
  selectedAnswer?: number;
  correctAnswer?: number;
  showResults?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  options,
  onAnswerSelect,
  selectedAnswer,
  correctAnswer,
  showResults = false,
  questionNumber,
  totalQuestions
}: QuizQuestionProps) {
  const [localSelected, setLocalSelected] = useState<number | undefined>(selectedAnswer);

  const handleAnswerClick = (index: number) => {
    if (showResults) return;
    
    setLocalSelected(index);
    onAnswerSelect(index);
  };

  const getButtonClasses = (index: number) => {
    if (!showResults) {
      return localSelected === index ? 'answer-btn selected' : 'answer-btn';
    }

    if (index === correctAnswer) {
      return 'answer-btn correct';
    }

    if (localSelected === index && index !== correctAnswer) {
      return 'answer-btn incorrect';
    }

    return 'answer-btn opacity-50';
  };

  const getAnswerIcon = (index: number) => {
    if (!showResults) return null;
    
    if (index === correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-white" />;
    }
    
    if (localSelected === index && index !== correctAnswer) {
      return <XCircle className="h-5 w-5 text-white" />;
    }
    
    return null;
  };

  return (
    <Card className="card-whiz w-full max-w-5xl mx-auto animate-slide-in">
      <CardContent className="p-8">
        {/* Question Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-whiz p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-blue-600 font-bold">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {showResults ? '✅ Answered' : '⏳ Think fast!'}
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                getButtonClasses(index),
                'h-auto p-6 text-left justify-start whitespace-normal text-wrap min-h-[80px] relative overflow-hidden'
              )}
              onClick={() => handleAnswerClick(index)}
              disabled={showResults}
            >
              <div className="flex items-center w-full">
                {/* Answer Letter */}
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm mr-4 flex-shrink-0',
                  !showResults && localSelected === index ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700',
                  showResults && index === correctAnswer ? 'bg-white/20 text-white' : '',
                  showResults && localSelected === index && index !== correctAnswer ? 'bg-white/20 text-white' : ''
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Answer Text */}
                <span className="text-lg font-semibold flex-grow">
                  {option}
                </span>
                
                {/* Result Icon */}
                {getAnswerIcon(index) && (
                  <div className="ml-2 flex-shrink-0">
                    {getAnswerIcon(index)}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Results Message */}
        {showResults && (
          <div className="mt-8 text-center animate-fade-in">
            {localSelected === correctAnswer ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-800">Correct! 🎉</span>
                </div>
                <p className="text-green-700">Great job! You got it right!</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="h-8 w-8 text-red-500 mr-2" />
                  <span className="text-2xl font-bold text-red-800">Incorrect 😔</span>
                </div>
                <p className="text-red-700">
                  The correct answer was: <span className="font-bold">{options[correctAnswer!]}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
