
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, User, Hash, Users, Sparkles, Trophy, Target } from 'lucide-react';
import Link from 'next/link';

function JoinQuizForm() {
  const [name, setName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams?.get('code');
    if (code) {
      setSessionCode(code.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sessionCode.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sessions/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          sessionCode: sessionCode.trim().toUpperCase(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join session');
      }

      const result = await response.json();
      
      // Store participant ID in localStorage for this session
      localStorage.setItem(`participant_${sessionCode}`, result.participantId);
      
      router.push(`/quiz/${sessionCode.toUpperCase()}`);
    } catch (error) {
      console.error('Error joining session:', error);
      alert(error instanceof Error ? error.message : 'Failed to join quiz session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-6 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-success p-4 rounded-2xl shadow-xl mr-4 animate-bounce-gentle">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">Join the Fun</h1>
                <p className="text-lg text-gray-600 mt-1">Ready to compete? 🎯</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <Card className="card-whiz animate-slide-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              Jump Into the Quiz Action!
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Enter your details to join an exciting quiz session 🚀
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  What's your name?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your awesome name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/80 backdrop-blur-sm pl-4"
                  required
                />
              </div>

              {/* Session Code Input */}
              <div className="space-y-3">
                <Label htmlFor="sessionCode" className="text-lg font-semibold text-gray-900 flex items-center">
                  <Hash className="h-5 w-5 mr-2 text-orange-600" />
                  Quiz Session Code
                </Label>
                <Input
                  id="sessionCode"
                  type="text"
                  placeholder="Enter 6-digit code (e.g., ABC123)"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="h-14 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-xl bg-white/80 backdrop-blur-sm pl-4 font-mono tracking-wider"
                  required
                />
                <p className="text-sm text-gray-600 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Ask your quiz master for this special code!
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="btn-accent w-full text-lg h-14" 
                  disabled={isLoading || !name.trim() || !sessionCode.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Joining Quiz...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Join Quiz & Start Playing
                    </>
                  )}
                </Button>
                
                {(!name.trim() || !sessionCode.trim()) && (
                  <p className="text-center text-gray-500 text-sm mt-3">
                    Please fill in your name and session code to join 📝
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
            How to Join a Quiz
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Get the 6-digit session code from your quiz master</li>
            <li>• Enter your name and the code above</li>
            <li>• Wait in the lobby for the quiz to start</li>
            <li>• Compete with friends and climb the leaderboard!</li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Don't have a code? Start your own quiz!</p>
          <Link href="/create">
            <Button variant="outline" className="hover-lift">
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JoinQuiz() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading WhizQuiz...</p>
        </div>
      </div>
    }>
      <JoinQuizForm />
    </Suspense>
  );
}
