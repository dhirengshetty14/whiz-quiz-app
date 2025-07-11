
'use client';

import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { Clock, Zap } from 'lucide-react';

interface QuizTimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  className?: string;
}

export function QuizTimer({ duration, onTimeUp, isActive, className }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10;

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      {/* Timer Display */}
      <div className={cn(
        'relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300',
        isUrgent 
          ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg animate-pulse' 
          : isWarning 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg' 
            : 'bg-gradient-whiz shadow-lg'
      )}>
        <div className="text-center">
          <div className={cn(
            'text-3xl font-black text-white transition-all duration-300',
            isUrgent && 'animate-bounce'
          )}>
            {timeLeft}
          </div>
          <div className="text-xs text-white/80 font-medium">
            {timeLeft === 1 ? 'sec' : 'secs'}
          </div>
        </div>
        
        {/* Pulse Ring for Urgent */}
        {isUrgent && (
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-32 space-y-2">
        <Progress 
          value={percentage} 
          className={cn(
            'h-3 transition-all duration-300',
            isUrgent ? 'bg-red-100' : isWarning ? 'bg-orange-100' : 'bg-blue-100'
          )}
        />
        
        {/* Status Text */}
        <div className="text-center">
          <div className={cn(
            'text-sm font-semibold transition-colors duration-300',
            isUrgent ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-blue-600'
          )}>
            {isUrgent ? (
              <span className="flex items-center justify-center">
                <Zap className="h-4 w-4 mr-1" />
                Hurry up!
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1" />
                Think fast
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
