
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QUIZ_TOPICS } from '@/lib/types';
import { ArrowLeft, Loader2, User, Brain, Sparkles, Trophy, Globe, Music, Gamepad2, FlaskConical, Clock, MapPin, Code, Film, UtensilsCrossed, Plane } from 'lucide-react';
import Link from 'next/link';

const topicIcons = {
  'Sports': Trophy,
  'Entertainment': Sparkles,
  'Music': Music,
  'Science': FlaskConical,
  'History': Clock,
  'Geography': MapPin,
  'Technology': Code,
  'Movies': Film,
  'Food': UtensilsCrossed,
  'Travel': Plane,
};

export default function CreateQuiz() {
  const [hostName, setHostName] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim() || !topic) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostName: hostName.trim(),
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();
      router.push(`/quiz/${session.code}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create quiz session. Please try again.');
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
              <div className="bg-gradient-whiz p-4 rounded-2xl shadow-xl mr-4 animate-bounce-gentle">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">Create Your Quiz</h1>
                <p className="text-lg text-gray-600 mt-1">Become the QuizMaster! 🎮</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <Card className="card-whiz animate-slide-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              Let's Set Up Your Quiz Session
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Choose your name and pick a topic to get started! 🚀
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Host Name Input */}
              <div className="space-y-3">
                <Label htmlFor="hostName" className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  What's your name?
                </Label>
                <Input
                  id="hostName"
                  type="text"
                  placeholder="Enter your awesome name"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm pl-4"
                  required
                />
              </div>

              {/* Topic Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
                  Pick Your Quiz Topic
                </Label>
                <p className="text-gray-600 text-sm">
                  Choose a category that you'd love to challenge your friends with! 🎯
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {QUIZ_TOPICS.map((t) => {
                    const IconComponent = topicIcons[t as keyof typeof topicIcons] || Globe;
                    return (
                      <div
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`topic-card cursor-pointer ${topic === t ? 'selected' : ''}`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <IconComponent className={`h-8 w-8 ${topic === t ? 'text-white' : 'text-blue-600'}`} />
                          <span className={`font-semibold ${topic === t ? 'text-white' : 'text-gray-900'}`}>
                            {t}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="btn-whiz w-full text-lg h-14" 
                  disabled={isLoading || !hostName.trim() || !topic}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating Your Quiz...
                    </>
                  ) : (
                    <>
                      <Gamepad2 className="h-5 w-5 mr-2" />
                      Create Quiz & Open Lobby
                    </>
                  )}
                </Button>
                
                {(!hostName.trim() || !topic) && (
                  <p className="text-center text-gray-500 text-sm mt-3">
                    Please fill in your name and select a topic to continue 📝
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
            Pro Tips for Quiz Masters
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Your friends will join using a 6-digit code</li>
            <li>• Each quiz has 8 AI-generated questions</li>
            <li>• Questions are timed at 15 seconds each</li>
            <li>• Perfect for 2-10 players for maximum fun!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
