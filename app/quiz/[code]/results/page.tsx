
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Home, Crown, Star, Zap, Target, Brain, Sparkles } from 'lucide-react';
import { Participant } from '@/lib/types';

interface LeaderboardEntry extends Participant {
  rank: number;
}

export default function QuizResults() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = params.code as string;
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionCode) return;
    fetchResults();
  }, [sessionCode]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionCode}/results`);
      if (!response.ok) {
        throw new Error('Failed to load results');
      }
      
      const data = await response.json();
      
      // Sort participants by score and add rankings
      const sortedParticipants = data.participants
        .sort((a: Participant, b: Participant) => b.score - a.score)
        .map((participant: Participant, index: number) => ({
          ...participant,
          rank: index + 1,
        }));
      
      setLeaderboard(sortedParticipants);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load quiz results');
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white border-0';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0';
    }
  };

  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-xl';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 shadow-lg';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-lg';
      default:
        return 'bg-white/60 backdrop-blur-sm border border-white/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-whiz p-6 rounded-2xl shadow-xl mb-6 animate-bounce-gentle">
            <Trophy className="h-12 w-12 text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating Results...</h2>
          <p className="text-gray-600">Drumroll please... 🥁</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md card-whiz">
          <CardContent className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/')} className="btn-whiz">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-2xl shadow-xl animate-bounce-gentle">
              <Trophy className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Quiz Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            What an epic battle of wits!
          </p>
          {winner && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
              <Crown className="h-5 w-5 mr-2 inline" />
              {winner.name} takes the crown!
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <Card className="card-whiz mb-8 animate-slide-in">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-900 flex items-center justify-center">
              <div className="bg-gradient-whiz p-3 rounded-xl mr-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              Final Leaderboard
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Here's how everyone performed! 🏆
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {leaderboard.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-300 animate-zoom-in ${getCardStyle(participant.rank)}`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank Icon */}
                    <div className="flex items-center space-x-3">
                      {getRankIcon(participant.rank)}
                      <Badge className={`text-lg font-bold py-1 px-3 ${getRankBadgeStyle(participant.rank)}`}>
                        #{participant.rank}
                      </Badge>
                    </div>
                    
                    {/* Player Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-xl text-gray-900">{participant.name}</p>
                        {participant.rank === 1 && (
                          <div className="flex space-x-1">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-semibold text-yellow-600">WINNER!</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 font-semibold">
                        {participant.score} points • {Math.round((participant.score / 80) * 100)}% accuracy
                      </p>
                    </div>
                  </div>
                  
                  {/* Score Display */}
                  <div className="text-right">
                    <div className="text-4xl font-black text-gray-900 animate-count-up">
                      {participant.score}
                    </div>
                    <div className="text-sm text-gray-500 font-semibold">
                      out of 80 points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-whiz p-3 rounded-xl w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">8</div>
              <div className="text-gray-600 font-semibold">Questions Answered</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border border-white/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-accent p-3 rounded-xl w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{leaderboard.length}</div>
              <div className="text-gray-600 font-semibold">Total Players</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border border-white/30 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-success p-3 rounded-xl w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">
                {winner ? Math.round((winner.score / 80) * 100) : 0}%
              </div>
              <div className="text-gray-600 font-semibold">Highest Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 inline-block">
            <p className="text-gray-600 font-semibold mb-2">Quiz Session</p>
            <Badge variant="secondary" className="font-mono text-lg px-4 py-2">
              {sessionCode}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Button onClick={() => router.push('/')} size="lg" className="btn-whiz text-lg px-8">
              <Home className="h-5 w-5 mr-2" />
              Create Another Quiz
            </Button>
            
            <p className="text-gray-600">
              Ready for another round? Challenge your friends again! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
