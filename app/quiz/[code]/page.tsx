
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Users, Copy, Play, ArrowLeft, CheckCircle, AlertCircle, Loader2, Crown, Hash, Sparkles, Trophy, Target } from 'lucide-react';
import Link from 'next/link';
import { QuizSession, Participant } from '@/lib/types';
import { getShareableLink, copyToClipboard, ClipboardResult } from '@/lib/utils';

export default function QuizLobby() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = params.code as string;
  
  const [session, setSession] = useState<QuizSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyResult, setCopyResult] = useState<ClipboardResult | null>(null);
  const [isQuizStarting, setIsQuizStarting] = useState(false);

  useEffect(() => {
    if (!sessionCode) return;

    fetchSessionData();
    
    // Set up polling for real-time updates - poll every 1 second for better responsiveness
    const interval = setInterval(fetchSessionData, 1000);
    
    return () => clearInterval(interval);
  }, [sessionCode]);

  // Handle automatic redirect when quiz starts
  useEffect(() => {
    if (session && session.status === 'active' && !isHost) {
      // Show starting indicator first
      setIsQuizStarting(true);
      
      // Redirect participants to the quiz after a brief delay
      const timer = setTimeout(() => {
        router.push(`/quiz/${sessionCode}/play`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [session?.status, isHost, router, sessionCode]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionCode}`);
      if (!response.ok) {
        throw new Error('Session not found');
      }
      
      const data = await response.json();
      setSession(data);
      setParticipants(data.participants || []);
      
      // Check if current user is the host
      const participantId = localStorage.getItem(`participant_${sessionCode}`);
      const currentParticipant = data.participants?.find((p: Participant) => p.id === participantId);
      const isHostUser = !participantId || data.hostName === currentParticipant?.name;
      setIsHost(isHostUser);
      
      // Debug logging
      console.log('Session data:', {
        sessionCode,
        status: data.status,
        participantId,
        currentParticipant: currentParticipant?.name,
        hostName: data.hostName,
        isHost: isHostUser,
        participantCount: data.participants?.length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('Failed to load quiz session');
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      setIsQuizStarting(true);
      
      const response = await fetch(`/api/sessions/${sessionCode}/start`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start quiz');
      }
      
      // Brief delay to show starting indicator
      setTimeout(() => {
        router.push(`/quiz/${sessionCode}/play`);
      }, 1000);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setIsQuizStarting(false);
      alert('Failed to start quiz. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    setCopyLoading(true);
    setCopyResult(null);
    
    try {
      const link = getShareableLink(sessionCode);
      const result = await copyToClipboard(link);
      setCopyResult(result);
      
      // Clear the result after 3 seconds for successful copies
      if (result.success) {
        setTimeout(() => setCopyResult(null), 3000);
      }
    } catch (error) {
      console.error('Error copying link:', error);
      setCopyResult({
        success: false,
        message: 'Failed to copy link. Please try again.',
        method: 'error'
      });
    } finally {
      setCopyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading quiz lobby...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md card-whiz">
          <CardContent className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-red-600 mb-6">{error || 'Quiz session not found'}</p>
            <Link href="/">
              <Button className="btn-whiz">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-6 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Quiz Lobby 🎮</h1>
            <p className="text-lg text-gray-600">Get ready for an epic battle of wits!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Info */}
          <Card className="card-whiz animate-slide-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="bg-gradient-whiz p-3 rounded-xl mr-4">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                Quiz Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Display */}
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-2xl text-gray-900 mb-2 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-blue-600" />
                  {session.topic}
                </h3>
                <p className="text-gray-600">Today's quiz topic - get ready to shine! ✨</p>
              </div>

              {/* Session Code */}
              <div className="text-center">
                <Label className="text-gray-600 font-medium mb-2 block">Session Code</Label>
                <Badge variant="secondary" className="text-3xl font-black py-3 px-6 bg-gradient-whiz text-white rounded-2xl shadow-lg">
                  {session.code}
                </Badge>
                <p className="text-sm text-gray-500 mt-2">Share this code with your friends!</p>
              </div>

              {/* Host Info */}
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-semibold text-gray-900">Quiz Master:</span>
                  </div>
                  <Badge variant="outline" className="font-bold">{session.hostName}</Badge>
                </div>
              </div>

              {/* Copy Link Button */}
              <Button
                variant="outline"
                className="w-full h-12 hover-lift"
                onClick={handleCopyLink}
                disabled={copyLoading}
              >
                {copyLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : copyResult?.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : copyResult && !copyResult.success ? (
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                ) : (
                  <Copy className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold">
                  {copyLoading ? 'Copying...' : copyResult?.success ? 'Copied!' : 'Copy Share Link'}
                </span>
              </Button>

              {copyResult && (
                <div className={`text-sm text-center p-3 rounded-xl ${
                  copyResult.success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {copyResult.message}
                  {copyResult.method === 'manual' && (
                    <div className="mt-1 text-xs text-gray-500">
                      Press Ctrl+C (or Cmd+C on Mac) to copy
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {isHost && (
                <div className="pt-4 border-t">
                  <Button
                    className="btn-whiz w-full h-14 text-lg"
                    onClick={handleStartQuiz}
                    disabled={participants.length === 0 || isQuizStarting}
                  >
                    {isQuizStarting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Starting Quiz...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start Quiz Now!
                      </>
                    )}
                  </Button>
                  {participants.length === 0 && !isQuizStarting && (
                    <p className="text-center text-gray-500 mt-3 text-sm">
                      🎯 Waiting for brave participants to join the challenge...
                    </p>
                  )}
                  {isQuizStarting && (
                    <p className="text-center text-blue-600 mt-3 font-semibold">
                      🚀 Launching quiz for all participants...
                    </p>
                  )}
                </div>
              )}

              {!isHost && (
                <div className="pt-4 border-t">
                  <div className="text-center">
                    {isQuizStarting ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                          <p className="text-blue-600 font-bold text-lg">Quiz Starting...</p>
                        </div>
                        <p className="text-gray-600">Get ready to show off your knowledge! 🧠</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                          <p className="text-orange-800 font-semibold">⏳ Waiting for Quiz Master</p>
                          <p className="text-orange-600 text-sm mt-1">The quiz will begin shortly...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="card-whiz animate-slide-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="bg-gradient-success p-3 rounded-xl mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Players ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Waiting for Players</h3>
                  <p className="text-gray-600 mb-4">
                    Share the session code to invite friends to join! 🎉
                  </p>
                  <div className="text-sm text-gray-500">
                    Perfect for 2-10 players
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-200 animate-zoom-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                          <span className="text-white font-bold text-sm">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">{participant.name}</span>
                      </div>
                      {participant.name === session.hostName && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Host
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quiz Info */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 inline-block">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
              Quiz Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-black text-blue-600 mb-1">8</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-black text-orange-600 mb-1">15</div>
                <div className="text-sm text-gray-600">Seconds Each</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-600 mb-1">10</div>
                <div className="text-sm text-gray-600">Points Each</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-600 mb-1">🏆</div>
                <div className="text-sm text-gray-600">Winner Takes All</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
